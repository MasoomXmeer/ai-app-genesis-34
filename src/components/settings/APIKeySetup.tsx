
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ExternalLink, Key, Database } from 'lucide-react';
import { AIServiceManager } from '@/services/ai/AIServiceManager';
import { SupabaseAPIKeyManager } from '@/services/supabase/SupabaseAPIKeyManager';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const APIKeySetup = () => {
  const { user } = useAuth();
  const [aiService] = useState(() => AIServiceManager.getInstance());
  const [apiKeyManager] = useState(() => new SupabaseAPIKeyManager());
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [keys, setKeys] = useState<Record<string, string>>({
    openai: '',
    anthropic: '',
    google: '',
    groq: ''
  });
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4 and GPT-3.5 models',
      placeholder: 'sk-...',
      link: 'https://platform.openai.com/api-keys'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude 3 models',
      placeholder: 'sk-ant-...',
      link: 'https://console.anthropic.com/'
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini models',
      placeholder: 'AI...',
      link: 'https://makersuite.google.com/app/apikey'
    },
    {
      id: 'groq',
      name: 'Groq',
      description: 'Fast inference with Mixtral',
      placeholder: 'gsk_...',
      link: 'https://console.groq.com/keys'
    }
  ];

  useEffect(() => {
    if (user) {
      loadConfiguredProviders();
    }
  }, [user]);

  const loadConfiguredProviders = async () => {
    try {
      const providers = await apiKeyManager.getConfiguredProviders();
      setConfiguredProviders(providers);
    } catch (error) {
      console.error('Failed to load configured providers:', error);
    }
  };

  const handleKeyChange = (provider: string, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleSaveKey = async (provider: string) => {
    const key = keys[provider];
    if (!key.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    try {
      await apiKeyManager.saveApiKey(provider, key);
      await loadConfiguredProviders();
      toast({
        title: "API Key Saved",
        description: `${provider} API key has been saved successfully`
      });
      setKeys(prev => ({ ...prev, [provider]: '' }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive"
      });
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <div className="space-y-6">
      {/* Supabase Integration Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">Supabase Integration Active</CardTitle>
          </div>
          <CardDescription className="text-blue-700">
            Your API keys are securely stored in Supabase with encryption. 
            This provides enhanced security and backend functionality.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* API Keys Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>AI Provider API Keys</span>
              </CardTitle>
              <CardDescription>
                Configure API keys for AI providers. Keys are encrypted and stored securely.
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {configuredProviders.map(provider => (
                <Badge key={provider} variant="secondary" className="bg-green-100 text-green-800">
                  {provider}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="openai" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {providers.map(provider => (
                <TabsTrigger key={provider.id} value={provider.id}>
                  {provider.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {providers.map(provider => (
              <TabsContent key={provider.id} value={provider.id} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${provider.id}-key`}>{provider.name} API Key</Label>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id={`${provider.id}-key`}
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      placeholder={provider.placeholder}
                      value={keys[provider.id]}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggleKeyVisibility(provider.id)}
                    >
                      {showKeys[provider.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button onClick={() => handleSaveKey(provider.id)}>
                    Save
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={provider.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Get API Key
                    </a>
                  </Button>
                  {configuredProviders.includes(provider.id) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Configured
                    </Badge>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
