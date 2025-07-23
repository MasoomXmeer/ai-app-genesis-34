
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAPIKeyManager {
  private static instance: SupabaseAPIKeyManager;
  private cache: Map<string, string> = new Map();

  static getInstance(): SupabaseAPIKeyManager {
    if (!SupabaseAPIKeyManager.instance) {
      SupabaseAPIKeyManager.instance = new SupabaseAPIKeyManager();
    }
    return SupabaseAPIKeyManager.instance;
  }

  async setApiKey(provider: string, key: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // In a real implementation, you would encrypt the key before storing
    // For now, we'll store it as-is (not recommended for production)
    const { error } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: user.id,
        provider,
        encrypted_key: key // In production, encrypt this
      });

    if (error) throw error;
    
    // Update cache
    this.cache.set(provider, key);
  }

  async saveApiKey(provider: string, key: string): Promise<void> {
    return this.setApiKey(provider, key);
  }

  async getApiKey(provider: string): Promise<string | null> {
    // Check cache first
    if (this.cache.has(provider)) {
      return this.cache.get(provider) || null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_api_keys')
      .select('encrypted_key')
      .eq('user_id', user.id)
      .eq('provider', provider)
      .single();

    if (error || !data) return null;

    // Cache the result
    this.cache.set(provider, data.encrypted_key);
    return data.encrypted_key;
  }

  async hasApiKey(provider: string): Promise<boolean> {
    const key = await this.getApiKey(provider);
    return !!key;
  }

  async removeApiKey(provider: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) throw error;
    
    // Remove from cache
    this.cache.delete(provider);
  }

  async getAvailableProviders(): Promise<string[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_api_keys')
      .select('provider')
      .eq('user_id', user.id);

    if (error) return [];
    
    return data.map(item => item.provider);
  }

  async getConfiguredProviders(): Promise<string[]> {
    return this.getAvailableProviders();
  }

  validateApiKey(provider: string, key: string): boolean {
    // Basic validation patterns for different providers
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
