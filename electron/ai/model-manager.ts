import * as os from 'os';
import { SUPPORTED_MODELS, ModelMetadata } from './model-registry';
import { AIEngine } from './engine';
import { DownloadManager } from './download-manager';

export class ModelManager {
  public static getRecommendedModel(): ModelMetadata {
    const totalRAM = os.totalmem() / (1024 * 1024 * 1024);
    
    if (totalRAM >= 8) {
      return SUPPORTED_MODELS.find(m => m.id === 'gemma-3-4b') || SUPPORTED_MODELS[0];
    } else {
      return SUPPORTED_MODELS.find(m => m.id === 'gemma-4-e2b') || SUPPORTED_MODELS[0];
    }
  }

  public static async loadModel(modelId: string, onProgress?: (p: number) => void): Promise<void> {
    const meta = SUPPORTED_MODELS.find(m => m.id === modelId);
    if (!meta) throw new Error(`Model ${modelId} not found`);

    const path = await DownloadManager.download(meta.repo, meta.file, onProgress || (() => {}));
    await AIEngine.initialize(path);
  }
}
