
import { GenerationOptions, StreamingResponse } from '../types';

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(prompt: string, systemPrompt: string, options: GenerationOptions): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate code with OpenAI');
    }
  }

  async streamCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const id = crypto.randomUUID();
    let content = '';

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onUpdate({
                id,
                modelUsed: 'GPT-4',
                content,
                progress: 100,
                stage: 'Complete',
                estimatedCompletion: Date.now(),
                isComplete: true
              });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content || '';
              content += delta;

              onUpdate({
                id,
                modelUsed: 'GPT-4',
                content,
                progress: Math.min(content.length / 10, 95),
                stage: 'Generating...',
                estimatedCompletion: Date.now() + 5000,
                isComplete: false
              });
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      onUpdate({
        id,
        modelUsed: 'GPT-4',
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
