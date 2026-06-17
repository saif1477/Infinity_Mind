import { getLlama, Llama, LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';

export class AIEngine {
  private static llama: Llama | null = null;
  private static model: LlamaModel | null = null;
  private static context: LlamaContext | null = null;

  public static async initialize(modelPath: string): Promise<void> {
    if (!this.llama) {
      this.llama = await getLlama();
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

  public static async generateResponse(
    systemPrompt: string, 
    userMessage: string, 
    onToken?: (token: string) => void
  ): Promise<string> {
    if (!this.context) throw new Error('AI Engine not initialized');

    const chatSession = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
      systemPrompt: systemPrompt
    });

    const response = await chatSession.prompt(userMessage, {
      onTextChunk: onToken
    });

    return response;
  }
}
