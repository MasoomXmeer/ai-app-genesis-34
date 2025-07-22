
import { supabase } from '@/integrations/supabase/client';
import { APIKeyManager } from '@/services/ai/APIKeyManager';

export class SupabaseAPIKeyManager extends APIKeyManager {
  private static supabaseInstance: SupabaseAPIKeyManager;

  static getInstance(): SupabaseAPIKeyManager {
    if (!SupabaseAPIKeyManager.supabaseInstance) {
      SupabaseAPIKeyManager.supabaseInstance = new SupabaseAPIKeyManager();
    }
    return SupabaseAPIKeyManager.supabaseInstance;
  }

  async setApiKey(provider: string, key: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Simple encryption for demo (in production, use proper encryption)
      const encryptedKey = btoa(key);

      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          provider,
          encrypted_key: encryptedKey
        });

      if (error) throw error;

      // Also store in parent class for immediate access
      super.setApiKey(provider, key);
    } catch (error) {
      console.error('Failed to save API key:', error);
      // Fallback to localStorage
      super.setApiKey(provider, key);
    }
  }

  async getApiKey(provider: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return super.getApiKey(provider);

      const { data, error } = await supabase
        .from('user_api_keys')
        .select('encrypted_key')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .single();

      if (error || !data) return super.getApiKey(provider);

      // Simple decryption for demo
      const decryptedKey = atob(data.encrypted_key);
      
      // Cache in parent class
      super.setApiKey(provider, decryptedKey);
      
      return decryptedKey;
    } catch (error) {
      console.error('Failed to get API key:', error);
      return super.getApiKey(provider);
    }
  }

  async removeApiKey(provider: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_api_keys')
          .delete()
          .eq('user_id', user.id)
          .eq('provider', provider);
      }
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
    
    // Always remove from parent class
    super.removeApiKey(provider);
  }

  async loadUserApiKeys(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_api_keys')
        .select('provider, encrypted_key')
        .eq('user_id', user.id);

      if (error || !data) return;

      data.forEach(({ provider, encrypted_key }) => {
        const decryptedKey = atob(encrypted_key);
        super.setApiKey(provider, decryptedKey);
      });
    } catch (error) {
      console.error('Failed to load user API keys:', error);
    }
  }
}
