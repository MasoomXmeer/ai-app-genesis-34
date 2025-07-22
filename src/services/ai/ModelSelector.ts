
import { AIModel, ProjectComplexity, GenerationOptions } from './types';

export class ModelSelector {
  private static models: AIModel[] = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      capabilities: [
        {
          type: 'code-generation',
          frameworks: ['react', 'vue', 'angular', 'nextjs'],
          languages: ['typescript', 'javascript', 'python']
        }
      ],
      maxTokens: 128000,
      costPerToken: 0.00003,
      speed: 'medium',
      complexity: 'complex'
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'anthropic',
      capabilities: [
        {
          type: 'architecture',
          frameworks: ['laravel', 'react', 'vue'],
          languages: ['php', 'typescript', 'javascript']
        }
      ],
      maxTokens: 200000,
      costPerToken: 0.00003,
      speed: 'medium',
      complexity: 'complex'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      capabilities: [
        {
          type: 'code-generation',
          frameworks: ['laravel', 'symfony', 'php'],
          languages: ['php', 'mysql', 'javascript']
        }
      ],
      maxTokens: 32768,
      costPerToken: 0.000125,
      speed: 'fast',
      complexity: 'medium'
    },
    {
      id: 'llama-3-70b',
      name: 'Llama 3 70B',
      provider: 'groq',
      capabilities: [
        {
          type: 'debugging',
          frameworks: ['react', 'vue', 'angular'],
          languages: ['typescript', 'javascript']
        }
      ],
      maxTokens: 8192,
      costPerToken: 0.00001,
      speed: 'fast',
      complexity: 'simple'
    }
  ];

  static selectOptimalModel(options: GenerationOptions): AIModel {
    const { framework, projectType, complexity } = options;
    
    // Enterprise/Complex projects -> GPT-4 or Claude
    if (complexity.level === 'enterprise' || complexity.level === 'complex') {
      if (framework === 'laravel' || projectType === 'fullstack') {
        return this.models.find(m => m.id === 'claude-3-5-sonnet') || this.models[0];
      }
      return this.models.find(m => m.id === 'gpt-4-turbo') || this.models[0];
    }

    // Laravel/PHP projects -> Gemini Pro
    if (framework === 'laravel' || projectType.includes('laravel')) {
      return this.models.find(m => m.id === 'gemini-pro') || this.models[0];
    }

    // Simple/Fast iterations -> Groq
    if (complexity.level === 'simple' || options.streaming) {
      return this.models.find(m => m.id === 'llama-3-70b') || this.models[0];
    }

    // Default to GPT-4 for React/complex frontend
    return this.models.find(m => m.id === 'gpt-4-turbo') || this.models[0];
  }

  static getAvailableModels(): AIModel[] {
    return [...this.models];
  }

  static getModelById(id: string): AIModel | undefined {
    return this.models.find(m => m.id === id);
  }

  static getModelsByCapability(capability: string): AIModel[] {
    return this.models.filter(m => 
      m.capabilities.some(c => c.type === capability)
    );
  }
}
