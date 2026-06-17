"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextChunker = void 0;
class TextChunker {
    static CHARS_PER_TOKEN = 4;
    static estimateTokens(text) {
        return Math.ceil(text.length / this.CHARS_PER_TOKEN);
    }
    static chunk(text, maxTokens = 512, overlapTokens = 128) {
        const chunks = [];
        const maxChars = maxTokens * this.CHARS_PER_TOKEN;
        const overlapChars = overlapTokens * this.CHARS_PER_TOKEN;
        let currentIndex = 0;
        let chunkIndex = 0;
        while (currentIndex < text.length) {
            let endIndex = currentIndex + maxChars;
            if (endIndex < text.length) {
                let breakIndex = text.lastIndexOf('\n\n', endIndex);
                if (breakIndex <= currentIndex)
                    breakIndex = text.lastIndexOf('. ', endIndex);
                if (breakIndex > currentIndex)
                    endIndex = breakIndex + 1;
            }
            const chunkContent = text.substring(currentIndex, endIndex).trim();
            if (chunkContent.length > 0) {
                chunks.push({
                    content: chunkContent,
                    tokenCount: Math.ceil(chunkContent.length / this.CHARS_PER_TOKEN),
                    index: chunkIndex++
                });
            }
            currentIndex = endIndex - overlapChars;
            if (currentIndex <= endIndex - maxChars)
                currentIndex = endIndex;
        }
        return chunks;
    }
}
exports.TextChunker = TextChunker;
