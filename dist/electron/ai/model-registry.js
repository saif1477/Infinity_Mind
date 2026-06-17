"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_MODELS = void 0;
exports.SUPPORTED_MODELS = [
    {
        id: 'gemma-4-e2b',
        name: 'Gemma 4 E2B',
        repo: 'bartowski/gemma-4-e2b-GGUF',
        file: 'gemma-4-e2b-Q4_K_M.gguf',
        sizeMB: 1500,
        minRamGB: 4,
        promptTemplate: 'gemma',
    },
    {
        id: 'gemma-3-4b',
        name: 'Gemma 3 4B',
        repo: 'bartowski/gemma-3-4b-GGUF',
        file: 'gemma-3-4b-Q4_K_M.gguf',
        sizeMB: 2500,
        minRamGB: 8,
        promptTemplate: 'gemma',
    },
    {
        id: 'qwen-3-4b',
        name: 'Qwen 3 4B',
        repo: 'Qwen/Qwen-3-4B-GGUF',
        file: 'qwen-3-4b-q4_k_m.gguf',
        sizeMB: 2600,
        minRamGB: 8,
        promptTemplate: 'qwen',
    },
    {
        id: 'phi-4-mini',
        name: 'Phi-4 Mini',
        repo: 'bartowski/Phi-4-mini-instruct-GGUF',
        file: 'Phi-4-mini-instruct-Q4_K_M.gguf',
        sizeMB: 2200,
        minRamGB: 6,
        promptTemplate: 'phi',
    }
];
