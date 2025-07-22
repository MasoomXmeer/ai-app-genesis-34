import { GenerationOptions, StreamingResponse } from '../types';

export class GoogleAIService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions
  ): Promise<string> {
    const response = await fetch(`${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 4000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async streamCode(
    prompt: string,
    systemPrompt: string,
    options: GenerationOptions,
    onUpdate: (response: StreamingResponse) => void
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/models/gemini-pro:streamGenerateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 4000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.statusText}`);
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
          try {
            const parsed = JSON.parse(line);
            
            if (parsed.candidates && parsed.candidates[0]?.content?.parts) {
              const delta = parsed.candidates[0].content.parts[0]?.text || '';
              content += delta;
              totalTokens++;

              const isComplete = parsed.candidates[0]?.finishReason === 'STOP';

              onUpdate({
                id: crypto.randomUUID(),
                modelUsed: 'Gemini Pro',
                content,
                progress: isComplete ? 100 : Math.min(95, (totalTokens / 50) * 100),
                stage: isComplete ? 'Generation complete' : 'Generating code...',
                estimatedCompletion: Date.now() + (isComplete ? 0 : 5000),
                isComplete
              });

              if (isComplete) return;
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}