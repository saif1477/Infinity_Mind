import { pipeline, FeatureExtractionPipeline, env } from '@xenova/transformers';

// Optimization for Transformers.js locally
env.localModelPath = ''; // Uses default cache
env.allowRemoteModels = true;
env.backends.onnx.wasm.numThreads = 4;

export class EmbeddingEngine {
  private static extractor: FeatureExtractionPipeline | null = null;
  private static modelId = 'Xenova/nomic-embed-text-v1.5';

  public static async initialize() {
    if (!this.extractor) {
      this.extractor = await pipeline('feature-extraction', this.modelId, {
        quantized: true, // Use smaller INT8 models
      }) as FeatureExtractionPipeline;
    }
  }

  public static async getEmbedding(text: string): Promise<number[]> {
    if (!this.extractor) await this.initialize();
    
    // Create embedding
    const output = await this.extractor!(text, {
      pooling: 'mean',
      normalize: true
    });
    
    return Array.from(output.data);
  }
}
