
import { GenerationOptions, StreamingResponse } from '../types';

export class GoogleAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(prompt: string, systemPrompt: string, options: GenerationOptions): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\nUser: ${prompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2000,
          }
        }),
      });

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Google AI API error:', error);
      throw new Error('Failed to generate code with Google AI');
    }
  }

  async streamCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    // Google AI streaming implementation would go here
    // For now, fall back to non-streaming
    const id = crypto.randomUUID();
    
    try {
      const result = await this.generateCode(prompt, systemPrompt, options);
      
      onUpdate({
        id,
        modelUsed: 'Gemini Pro',
        content: result,
        progress: 100,
        stage: 'Complete',
        estimatedCompletion: Date.now(),
        isComplete: true
      });
    } catch (error) {
      onUpdate({
        id,
        modelUsed: 'Gemini Pro',
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
