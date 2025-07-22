import { GenerationOptions, StreamingResponse } from '../types';

export class AnthropicService {
  private apiKey: string;
  private baseURL = 'https://api.anthropic.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 4000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ],
        temperature: options.temperature || 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async streamCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 4000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ],
        temperature: options.temperature || 0.7,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let content = '';
    let totalTokens = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'content_block_delta') {
                const delta = parsed.delta?.text || '';
                content += delta;
                totalTokens++;

                onUpdate({
                  id: crypto.randomUUID(),
                  modelUsed: 'Claude 3.5 Sonnet',
                  content,
                  progress: Math.min(95, (totalTokens / 50) * 100),
                  stage: 'Generating code...',
                  estimatedCompletion: Date.now() + 5000,
                  isComplete: false
                });
              } else if (parsed.type === 'message_stop') {
                onUpdate({
                  id: crypto.randomUUID(),
                  modelUsed: 'Claude 3.5 Sonnet',
                  content,
                  progress: 100,
                  stage: 'Generation complete',
                  estimatedCompletion: Date.now(),
                  isComplete: true
                });
                return;
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}