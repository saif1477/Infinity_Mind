"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelManager = void 0;
const os = __importStar(require("os"));
const model_registry_1 = require("./model-registry");
const engine_1 = require("./engine");
const download_manager_1 = require("./download-manager");
class ModelManager {
    static getRecommendedModel() {
        const totalRAM = os.totalmem() / (1024 * 1024 * 1024);
        if (totalRAM >= 8) {
            return model_registry_1.SUPPORTED_MODELS.find(m => m.id === 'gemma-3-4b') || model_registry_1.SUPPORTED_MODELS[0];
        }
        else {
            return model_registry_1.SUPPORTED_MODELS.find(m => m.id === 'gemma-4-e2b') || model_registry_1.SUPPORTED_MODELS[0];
        }
    }
    static async loadModel(modelId, onProgress) {
        const meta = model_registry_1.SUPPORTED_MODELS.find(m => m.id === modelId);
        if (!meta)
            throw new Error(`Model ${modelId} not found`);
        const path = await download_manager_1.DownloadManager.download(meta.repo, meta.file, onProgress || (() => { }));
        await engine_1.AIEngine.initialize(path);
    }
}
exports.ModelManager = ModelManager;
