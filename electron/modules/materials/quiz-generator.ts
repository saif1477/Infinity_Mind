import { AIEngine } from '../../ai/engine';
import { SYSTEM_PROMPTS } from '../../ai/prompts/prompts';
import { TextChunker } from './chunker';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export class QuizGenerator {
  private static readonly MAX_INPUT_TOKENS = 2500;
  private static readonly MAX_RETRIES = 2;

  /**
   * Generate quiz questions from the provided text.
   * @param text - Source text to generate questions from
   * @param count - Number of questions to generate (default 5)
   */
  static async generate(text: string, count: number = 5): Promise<QuizQuestion[]> {
    if (!text || text.trim().length === 0) {
      throw new Error('Cannot generate quiz from empty text.');
    }

    // If text is too long, take the most representative chunks
    let inputText = text;
    const estimatedTokens = TextChunker.estimateTokens(text);
    if (estimatedTokens > this.MAX_INPUT_TOKENS) {
      const chunks = TextChunker.chunk(text, this.MAX_INPUT_TOKENS, 0);
      // Use the first chunk(s) that fit
      inputText = chunks.slice(0, 2).map(c => c.content).join('\n\n');
    }

    const userPrompt = count !== 5
      ? `Generate exactly ${count} multiple-choice questions from this text:\n\n${inputText}`
      : `Generate questions from this text:\n\n${inputText}`;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await AIEngine.generateResponse(
          SYSTEM_PROMPTS.QUIZ_GENERATOR,
          userPrompt
        );

        const questions = this.parseResponse(response);
        if (questions.length === 0) {
          throw new Error('Parsed response contained no valid questions.');
        }
        return questions;
      } catch (err: any) {
        lastError = err;
        console.warn(`Quiz generation attempt ${attempt + 1} failed: ${err.message}`);
      }
    }

    throw new Error(`Quiz generation failed after ${this.MAX_RETRIES + 1} attempts: ${lastError?.message}`);
  }

  /**
   * Parse the AI response into structured QuizQuestion objects.
   * Handles various LLM output quirks (markdown fences, trailing commas, etc.)
   */
  private static parseResponse(response: string): QuizQuestion[] {
    const jsonStr = this.extractJSON(response);

    let parsed: any;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Try fixing common JSON issues
      const fixed = jsonStr
        .replace(/,\s*]/g, ']')    // trailing commas in arrays
        .replace(/,\s*}/g, '}')    // trailing commas in objects
        .replace(/'/g, '"')        // single quotes to double quotes
        .replace(/\n/g, '\\n');    // unescaped newlines in strings
      try {
        parsed = JSON.parse(fixed);
      } catch (err: any) {
        throw new Error(`Failed to parse quiz JSON: ${err.message}`);
      }
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Expected a JSON array of questions.');
    }

    return parsed.map((item: any, i: number) => this.normalizeQuestion(item, i)).filter(Boolean) as QuizQuestion[];
  }

  /**
   * Normalize a single raw question object into the QuizQuestion interface.
   * Handles the AI prompt format: { q, options, answer, explanation }
   */
  private static normalizeQuestion(item: any, index: number): QuizQuestion | null {
    try {
      const question = item.q || item.question || item.Question || '';
      const options = item.options || item.Options || item.choices || [];
      const explanation = item.explanation || item.Explanation || item.reason || '';

      if (!question || !Array.isArray(options) || options.length < 2) {
        console.warn(`Skipping malformed question at index ${index}`);
        return null;
      }

      // Parse correct answer index — could be a number or string
      let correctIndex: number;
      const rawAnswer = item.answer ?? item.correctIndex ?? item.correct ?? 0;

      if (typeof rawAnswer === 'number') {
        correctIndex = rawAnswer;
      } else if (typeof rawAnswer === 'string') {
        // Try parsing as number first
        const parsed = parseInt(rawAnswer, 10);
        if (!isNaN(parsed)) {
          correctIndex = parsed;
        } else {
          // Try matching the answer text to one of the options
          correctIndex = options.findIndex(
            (opt: string) => opt.toLowerCase().trim() === rawAnswer.toLowerCase().trim()
          );
          if (correctIndex === -1) correctIndex = 0;
        }
      } else {
        correctIndex = 0;
      }

      // Clamp to valid range
      correctIndex = Math.max(0, Math.min(correctIndex, options.length - 1));

      return {
        question: String(question).trim(),
        options: options.map((o: any) => String(o).trim()),
        correctIndex,
        explanation: String(explanation).trim(),
      };
    } catch {
      console.warn(`Failed to normalize question at index ${index}`);
      return null;
    }
  }

  /**
   * Extract the JSON array from an AI response that might contain markdown fences
   * or other surrounding text.
   */
  private static extractJSON(text: string): string {
    // Try to find JSON in markdown code fences
    const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenceMatch) {
      return fenceMatch[1].trim();
    }

    // Try to find a JSON array directly
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return arrayMatch[0];
    }

    // Return the whole thing and hope for the best
    return text.trim();
  }
}
