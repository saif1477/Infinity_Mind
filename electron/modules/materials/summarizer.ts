import { AIEngine } from '../../ai/engine';
import { SYSTEM_PROMPTS } from '../../ai/prompts/prompts';
import { TextChunker } from './chunker';

export class Summarizer {
  private static readonly MAX_INPUT_TOKENS = 3000;

  public static async summarize(text: string): Promise<string> {
    let inputText = text;
    const estimatedTokens = TextChunker.estimateTokens(text);
    if (estimatedTokens > this.MAX_INPUT_TOKENS) {
      const chunks = TextChunker.chunk(text, this.MAX_INPUT_TOKENS, 0);
      inputText = chunks.slice(0, 3).map(c => c.content).join('\n\n');
    }

    const prompt = `Summarize the following study material concisely:\n\n${inputText}`;
    return await AIEngine.generateResponse(SYSTEM_PROMPTS.SUMMARIZER, prompt);
  }
}
