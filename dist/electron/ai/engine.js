"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIEngine = void 0;
const node_llama_cpp_1 = require("node-llama-cpp");
class AIEngine {
    static llama = null;
    static model = null;
    static context = null;
    static async initialize(modelPath) {
        if (!this.llama) {
            this.llama = await (0, node_llama_cpp_1.getLlama)();
        }
        if (this.model) {
            if (this.context) {
                await this.context.dispose();
            }
            await this.model.dispose();
        }
        this.model = await this.llama.loadModel({
            modelPath: modelPath,
        });
        this.context = await this.model.createContext({
            contextSize: 4096, // Target budget for 8GB max system RAM
        });
    }
    static async generateResponse(systemPrompt, userMessage, onToken) {
        if (!this.context)
            throw new Error('AI Engine not initialized');
        const chatSession = new node_llama_cpp_1.LlamaChatSession({
            contextSequence: this.context.getSequence(),
            systemPrompt: systemPrompt
        });
        const response = await chatSession.prompt(userMessage, {
            onTextChunk: onToken
        });
        return response;
    }
}
exports.AIEngine = AIEngine;
