"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingEngine = void 0;
const transformers_1 = require("@xenova/transformers");
// Optimization for Transformers.js locally
transformers_1.env.localModelPath = ''; // Uses default cache
transformers_1.env.allowRemoteModels = true;
transformers_1.env.backends.onnx.wasm.numThreads = 4;
class EmbeddingEngine {
    static extractor = null;
    static modelId = 'Xenova/nomic-embed-text-v1.5';
    static async initialize() {
        if (!this.extractor) {
            this.extractor = await (0, transformers_1.pipeline)('feature-extraction', this.modelId, {
                quantized: true, // Use smaller INT8 models
            });
        }
    }
    static async getEmbedding(text) {
        if (!this.extractor)
            await this.initialize();
        // Create embedding
        const output = await this.extractor(text, {
            pooling: 'mean',
            normalize: true
        });
        return Array.from(output.data);
    }
}
exports.EmbeddingEngine = EmbeddingEngine;
