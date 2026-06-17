"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summarizer = void 0;
const engine_1 = require("../../ai/engine");
const prompts_1 = require("../../ai/prompts/prompts");
const chunker_1 = require("./chunker");
class Summarizer {
    static MAX_INPUT_TOKENS = 3000;
    static async summarize(text) {
        let inputText = text;
        const estimatedTokens = chunker_1.TextChunker.estimateTokens(text);
        if (estimatedTokens > this.MAX_INPUT_TOKENS) {
            const chunks = chunker_1.TextChunker.chunk(text, this.MAX_INPUT_TOKENS, 0);
            inputText = chunks.slice(0, 3).map(c => c.content).join('\n\n');
        }
        const prompt = `Summarize the following study material concisely:\n\n${inputText}`;
        return await engine_1.AIEngine.generateResponse(prompts_1.SYSTEM_PROMPTS.SUMMARIZER, prompt);
    }
}
exports.Summarizer = Summarizer;
