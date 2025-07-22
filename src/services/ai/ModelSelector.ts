
import { AIModel, GenerationOptions } from './types';

export class ModelSelector {
  private static models: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      capabilities: [
        {
          type: 'code-generation',
          frameworks: ['react', 'vue', 'angular', 'laravel', 'node'],
          languages: ['typescript', 'javascript', 'php', 'python']
        },
        {
          type: 'code-review',
          frameworks: ['react', 'vue', 'angular', 'laravel'],
          languages: ['typescript', 'javascript', 'php']
        }
      ],
      maxTokens: 8192,
      costPerToken: 0.00003,
      speed: 'medium',
      complexity: 'complex'
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic',
      capabilities: [
        {
          type: 'code-generation',
          frameworks: ['react', 'vue', 'laravel'],
          languages: ['typescript', 'javascript', 'php']
        }
      ],
      maxTokens: 200000,
      costPerToken: 0.000015,
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
          frameworks: ['react', 'vue', 'angular'],
          languages: ['typescript', 'javascript']
        }
      ],
      maxTokens: 30720,
      costPerToken: 0.0000005,
      speed: 'fast',
      complexity: 'medium'
    },
    {
      id: 'mixtral-8x7b',
      name: 'Mixtral 8x7B',
      provider: 'groq',
      capabilities: [
        {
          type: 'code-generation',
          frameworks: ['react', 'vue'],
          languages: ['typescript', 'javascript']
        }
      ],
      maxTokens: 32768,
      costPerToken: 0.0000002,
      speed: 'fast',
      complexity: 'simple'
    }
  ];

  static selectOptimalModel(options: GenerationOptions): AIModel {
    const { framework, complexity } = options;
    
    // Filter models that support the framework
    const compatibleModels = this.models.filter(model =>
      model.capabilities.some(cap =>
        cap.frameworks.includes(framework)
      )
    );

    if (compatibleModels.length === 0) {
      return this.models[0]; // Fallback to GPT-4
    }

    // Select based on complexity
    const complexityOrder = { 'simple': 1, 'medium': 2, 'complex': 3 };
    const targetComplexity = complexityOrder[complexity.level];

    // Find the best match for complexity
    const bestModel = compatibleModels.reduce((best, current) => {
      const bestComplexity = complexityOrder[best.complexity];
      const currentComplexity = complexityOrder[current.complexity];
      
      // Prefer models that match or slightly exceed the required complexity
      if (currentComplexity >= targetComplexity && currentComplexity < bestComplexity) {
        return current;
      }
      
      return best;
    });

    return bestModel;
  }

  static getAvailableModels(): AIModel[] {
    return [...this.models];
  }

  static getModelById(id: string): AIModel | undefined {
    return this.models.find(model => model.id === id);
  }

  static getModelsByProvider(provider: string): AIModel[] {
    return this.models.filter(model => model.provider === provider);
  }
}
