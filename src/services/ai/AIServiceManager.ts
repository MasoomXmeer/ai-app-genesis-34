
import { GenerationOptions, StreamingResponse, CodeGenerationRequest, AIModel } from './types';
import { ModelSelector } from './ModelSelector';
import { PromptEngine } from './PromptEngine';
import { SupabaseAPIKeyManager } from '../supabase/SupabaseAPIKeyManager';
import { OpenAIService } from './providers/OpenAIService';
import { AnthropicService } from './providers/AnthropicService';
import { GoogleAIService } from './providers/GoogleAIService';
import { GroqService } from './providers/GroqService';

export class AIServiceManager {
  private static instance: AIServiceManager;
  private streamingCallbacks = new Map<string, (response: StreamingResponse) => void>();
  private apiKeyManager = SupabaseAPIKeyManager.getInstance();

  static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  async generateCode(request: CodeGenerationRequest): Promise<string> {
    const { prompt, options } = request;
    
    try {
      // Select optimal model
      const selectedModel = ModelSelector.selectOptimalModel(options);
      console.log(`Selected model: ${selectedModel.name} for complexity: ${options.complexity.level}`);
      
      // Generate prompts with real system instructions
      const systemPrompt = PromptEngine.generateSystemPrompt(options);
      const userPrompt = PromptEngine.generateUserPrompt(prompt, options);
      
      // Call the actual AI service
      const result = await this.callAIService(selectedModel, systemPrompt, userPrompt, options);
      
      return result;
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error(`Failed to generate code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamCodeGeneration(
    request: CodeGenerationRequest,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const generationId = crypto.randomUUID();
    this.streamingCallbacks.set(generationId, onUpdate);
    
    try {
      const selectedModel = ModelSelector.selectOptimalModel(request.options);
      
      // Use real streaming API
      await this.streamWithAIService(generationId, selectedModel, request, onUpdate);
      
    } catch (error) {
      onUpdate({
        id: generationId,
        modelUsed: 'unknown',
        content: '',
        progress: 0,
        stage: 'error',
        estimatedCompletion: 0,
        isComplete: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      this.streamingCallbacks.delete(generationId);
    }
  }

  private async callAIService(
    model: AIModel,
    systemPrompt: string,
    userPrompt: string,
    options: GenerationOptions
  ): Promise<string> {
    const apiKey = await this.apiKeyManager.getApiKey(model.provider);
    if (!apiKey) {
      throw new Error(`No API key configured for ${model.provider}. Please configure your API keys in Settings.`);
    }

    try {
      switch (model.provider) {
        case 'openai': {
          const service = new OpenAIService(apiKey);
          return await service.generateCode(userPrompt, systemPrompt, options);
        }
        case 'anthropic': {
          const service = new AnthropicService(apiKey);
          return await service.generateCode(userPrompt, systemPrompt, options);
        }
        case 'google': {
          const service = new GoogleAIService(apiKey);
          return await service.generateCode(userPrompt, systemPrompt, options);
        }
        case 'groq': {
          const service = new GroqService(apiKey);
          return await service.generateCode(userPrompt, systemPrompt, options);
        }
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }
    } catch (error) {
      console.error(`API call failed for ${model.provider}:`, error);
      throw new Error(`Failed to generate code with ${model.provider}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async streamWithAIService(
    id: string,
    model: AIModel,
    request: CodeGenerationRequest,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const apiKey = await this.apiKeyManager.getApiKey(model.provider);
    if (!apiKey) {
      throw new Error(`No API key configured for ${model.provider}. Please configure your API keys in Settings.`);
    }

    const systemPrompt = PromptEngine.generateSystemPrompt(request.options);
    const userPrompt = PromptEngine.generateUserPrompt(request.prompt, request.options);

    try {
      switch (model.provider) {
        case 'openai': {
          const service = new OpenAIService(apiKey);
          await service.streamCode(userPrompt, systemPrompt, request.options, onUpdate);
          break;
        }
        case 'anthropic': {
          const service = new AnthropicService(apiKey);
          await service.streamCode(userPrompt, systemPrompt, request.options, onUpdate);
          break;
        }
        case 'google': {
          const service = new GoogleAIService(apiKey);
          await service.streamCode(userPrompt, systemPrompt, request.options, onUpdate);
          break;
        }
        case 'groq': {
          const service = new GroqService(apiKey);
          await service.streamCode(userPrompt, systemPrompt, request.options, onUpdate);
          break;
        }
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }
    } catch (error) {
      console.error(`Streaming failed for ${model.provider}:`, error);
      throw error;
    }
  }

  getAvailableModels(): AIModel[] {
    return ModelSelector.getAvailableModels();
  }

  async setApiKey(provider: string, key: string): Promise<void> {
    await this.apiKeyManager.setApiKey(provider, key);
  }

  async hasApiKey(provider: string): Promise<boolean> {
    return await this.apiKeyManager.hasApiKey(provider);
  }

  async getConfiguredProviders(): Promise<string[]> {
    return await this.apiKeyManager.getAvailableProviders();
  }
}
