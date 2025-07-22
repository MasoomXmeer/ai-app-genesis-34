
import { GenerationOptions, StreamingResponse } from '../types';

export class AnthropicService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(prompt: string, systemPrompt: string, options: GenerationOptions): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: options.maxTokens || 2000,
          system: systemPrompt,
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      const data = await response.json();
      return data.content[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to generate code with Anthropic');
    }
  }

  async streamCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    // Anthropic streaming implementation would go here
    // For now, fall back to non-streaming
    const id = crypto.randomUUID();
    
    try {
      const result = await this.generateCode(prompt, systemPrompt, options);
      
      onUpdate({
        id,
        modelUsed: 'Claude-3-Sonnet',
        content: result,
        progress: 100,
        stage: 'Complete',
        estimatedCompletion: Date.now(),
        isComplete: true
      });
    } catch (error) {
      onUpdate({
        id,
        modelUsed: 'Claude-3-Sonnet',
        content: '',
        progress: 0,
        stage: 'Error',
        estimatedCompletion: 0,
        isComplete: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
