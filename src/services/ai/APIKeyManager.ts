export class APIKeyManager {
  private static instance: APIKeyManager;
  private keys: Map<string, string> = new Map();

  static getInstance(): APIKeyManager {
    if (!APIKeyManager.instance) {
      APIKeyManager.instance = new APIKeyManager();
    }
    return APIKeyManager.instance;
  }

  setApiKey(provider: string, key: string): void {
    this.keys.set(provider, key);
    // In production, this would be stored securely in Supabase
    localStorage.setItem(`ai_key_${provider}`, key);
  }

  getApiKey(provider: string): string | null {
    let key = this.keys.get(provider);
    if (!key) {
      // Try to get from localStorage as fallback
      key = localStorage.getItem(`ai_key_${provider}`);
      if (key) {
        this.keys.set(provider, key);
      }
    }
    return key;
  }

  hasApiKey(provider: string): boolean {
    return !!this.getApiKey(provider);
  }

  removeApiKey(provider: string): void {
    this.keys.delete(provider);
    localStorage.removeItem(`ai_key_${provider}`);
  }

  getAvailableProviders(): string[] {
    const allProviders = ['openai', 'anthropic', 'google', 'groq'];
    return allProviders.filter(provider => this.hasApiKey(provider));
  }

  validateApiKey(provider: string, key: string): boolean {
    // Basic validation - in production, this would test the API
    const patterns = {
      openai: /^sk-[a-zA-Z0-9]{48}$/,
      anthropic: /^sk-ant-[a-zA-Z0-9\-_]{95}$/,
      google: /^[a-zA-Z0-9\-_]{39}$/,
      groq: /^gsk_[a-zA-Z0-9]{52}$/
    };

    const pattern = patterns[provider as keyof typeof patterns];
    return pattern ? pattern.test(key) : true;
  }
}