
import { GenerationOptions, StreamingResponse, CodeGenerationRequest, CodeGenerationResult, AIModel } from './types';
import { ModelSelector } from './ModelSelector';
import { PromptEngine } from './PromptEngine';
import { APIKeyManager } from './APIKeyManager';
import { OpenAIService } from './providers/OpenAIService';
import { AnthropicService } from './providers/AnthropicService';
import { GoogleAIService } from './providers/GoogleAIService';
import { GroqService } from './providers/GroqService';

export class AIServiceManager {
  private static instance: AIServiceManager;
  private streamingCallbacks = new Map<string, (response: StreamingResponse) => void>();
  private apiKeyManager = APIKeyManager.getInstance();

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
      
      // Generate prompts
      const systemPrompt = PromptEngine.generateSystemPrompt(options);
      const userPrompt = PromptEngine.generateUserPrompt(prompt, options);
      
      // For now, simulate the API call to the selected model
      // In production, this would call the actual AI service
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
      
      // Simulate streaming response
      await this.simulateStreamingGeneration(generationId, selectedModel, request, onUpdate);
      
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
    const apiKey = this.apiKeyManager.getApiKey(model.provider);
    if (!apiKey) {
      throw new Error(`No API key configured for ${model.provider}`);
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
      // Fallback to simulation if API fails
      console.warn(`API call failed for ${model.provider}, falling back to simulation:`, error);
      return this.generateFallbackCode(options.framework, options.projectType, userPrompt);
    }
  }

  private async simulateStreamingGeneration(
    id: string,
    model: AIModel,
    request: CodeGenerationRequest,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const apiKey = this.apiKeyManager.getApiKey(model.provider);
    if (!apiKey) {
      throw new Error(`No API key configured for ${model.provider}`);
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
      // Fallback to simulation if API fails
      console.warn(`Streaming failed for ${model.provider}, falling back to simulation:`, error);
      await this.fallbackStreamingGeneration(id, model, request, onUpdate);
    }
  }

  private async fallbackStreamingGeneration(
    id: string,
    model: AIModel,
    request: CodeGenerationRequest,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const stages = [
      'Analyzing requirements...',
      'Planning architecture...',
      'Generating core structure...',
      'Creating components...',
      'Adding styling...',
      'Implementing features...',
      'Optimizing code...',
      'Finalizing application...'
    ];
    
    let content = '';
    
    for (let i = 0; i < stages.length; i++) {
      const progress = Math.round(((i + 1) / stages.length) * 100);
      const isComplete = i === stages.length - 1;
      
      // Simulate code generation
      if (i >= 2) { // Start adding content from stage 3
        content += this.generateCodeChunk(request.options.framework, i);
      }
      
      onUpdate({
        id,
        modelUsed: model.name + ' (Simulated)',
        content,
        progress,
        stage: stages[i],
        estimatedCompletion: Date.now() + ((8 - i) * 1000),
        isComplete
      });
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }
  }

  private generateCodeChunk(framework: string, stage: number): string {
    const chunks = {
      react: [
        '', '', // Empty for first 2 stages
        `import React from 'react';\nimport { Button } from '@/components/ui/button';\n\n`,
        `const App = () => {\n  const [data, setData] = React.useState(null);\n\n`,
        `  return (\n    <div className="container mx-auto p-6">\n`,
        `      <h1 className="text-3xl font-bold mb-6">Generated Application</h1>\n`,
        `      <Button onClick={() => console.log('Generated!')}>Click Me</Button>\n`,
        `    </div>\n  );\n};\n\nexport default App;`
      ],
      laravel: [
        '', '',
        `<?php\n\nnamespace App\\Http\\Controllers;\n\n`,
        `use Illuminate\\Http\\Request;\nuse Illuminate\\Http\\Response;\n\n`,
        `class GeneratedController extends Controller\n{\n`,
        `    public function index(Request $request)\n    {\n`,
        `        return response()->json(['message' => 'Generated successfully']);\n`,
        `    }\n}\n`
      ]
    };
    
    return chunks[framework as keyof typeof chunks]?.[stage] || '';
  }

  private generateFallbackCode(framework: string, projectType: string, prompt: string): string {
    if (framework === 'laravel') {
      return this.generateLaravelCode(projectType, prompt);
    } else if (framework === 'react') {
      return this.generateReactCode(projectType, prompt);
    }
    return this.generateGenericCode(framework, projectType, prompt);
  }

  private generateLaravelCode(projectType: string, prompt: string): string {
    return `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Response;

class ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}Controller extends Controller
{
    public function index(Request $request)
    {
        // Generated based on: ${prompt.substring(0, 50)}...
        return response()->json([
            'message' => 'Laravel application generated successfully',
            'type' => '${projectType}',
            'timestamp' => now()
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users'
        ]);
        
        // Implementation logic here
        
        return response()->json($validated, 201);
    }
}`;
  }

  private generateReactCode(projectType: string, prompt: string): string {
    return `import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generated based on: ${prompt.substring(0, 50)}...
    console.log('${projectType} application initialized');
  }, []);

  const handleAction = async () => {
    setLoading(true);
    try {
      // Implementation logic here
      console.log('Action performed');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Generated ${projectType} Application</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAction} disabled={loading}>
            {loading ? 'Processing...' : 'Get Started'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}App;`;
  }

  private generateGenericCode(framework: string, projectType: string, prompt: string): string {
    return `// Generated ${framework} application for ${projectType}
// Based on prompt: ${prompt.substring(0, 100)}...

console.log('Application generated successfully with ${framework}');
export default {};`;
  }

  getAvailableModels(): AIModel[] {
    return ModelSelector.getAvailableModels();
  }

  setApiKey(provider: string, key: string): void {
    this.apiKeyManager.setApiKey(provider, key);
  }

  hasApiKey(provider: string): boolean {
    return this.apiKeyManager.hasApiKey(provider);
  }

  getConfiguredProviders(): string[] {
    return this.apiKeyManager.getAvailableProviders();
  }
}
