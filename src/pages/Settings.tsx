
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Trash2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { SupabaseAPIKeyManager } from '@/services/supabase/SupabaseAPIKeyManager';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [apiKeyManager] = useState(() => SupabaseAPIKeyManager.getInstance());
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4, GPT-3.5 models for code generation',
      keyFormat: 'sk-...',
      docsUrl: 'https://platform.openai.com/api-keys',
      website: 'https://platform.openai.com/'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude models for advanced reasoning',
      keyFormat: 'sk-ant-...',
      docsUrl: 'https://console.anthropic.com/',
      website: 'https://console.anthropic.com/'
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini models for multimodal capabilities',
      keyFormat: 'AI...',
      docsUrl: 'https://makersuite.google.com/app/apikey',
      website: 'https://ai.google.dev/'
    },
    {
      id: 'groq',
      name: 'Groq',
      description: 'Ultra-fast inference with Mixtral models',
      keyFormat: 'gsk_...',
      docsUrl: 'https://console.groq.com/keys',
      website: 'https://groq.com/'
    }
  ];

  useEffect(() => {
    loadConfiguredProviders();
  }, []);

  const loadConfiguredProviders = async () => {
    try {
      const providers = await apiKeyManager.getAvailableProviders();
      setConfiguredProviders(providers);
    } catch (error) {
      console.error('Failed to load configured providers:', error);
    }
  };

  const handleSaveApiKey = async (provider: string) => {
    const key = apiKeys[provider];
    if (!key?.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }

    // Validate key format
    if (!apiKeyManager.validateApiKey(provider, key)) {
      toast({
        title: "Invalid API Key Format",
        description: `Please check the API key format for ${provider}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(prev => ({ ...prev, [provider]: true }));

    try {
      await apiKeyManager.setApiKey(provider, key);
      await loadConfiguredProviders();
      
      toast({
        title: "API Key Saved",
        description: `Successfully configured ${provider} API key`
      });

      // Clear the input
      setApiKeys(prev => ({ ...prev, [provider]: '' }));
    } catch (error) {
      console.error('Failed to save API key:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleRemoveApiKey = async (provider: string) => {
    setLoading(prev => ({ ...prev, [provider]: true }));

    try {
      await apiKeyManager.removeApiKey(provider);
      await loadConfiguredProviders();
      
      toast({
        title: "API Key Removed",
        description: `Successfully removed ${provider} API key`
      });
    } catch (error) {
      console.error('Failed to remove API key:', error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const isConfigured = (providerId: string) => configuredProviders.includes(providerId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Configure your AI providers and manage your account preferences
          </p>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            <div className="mb-6">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Your API keys are encrypted and stored securely. They are only used to make requests to AI providers on your behalf.
                </AlertDescription>
              </Alert>
            </div>

            <div className="grid gap-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {provider.name}
                          {isConfigured(provider.id) && (
                            <Badge variant="secondary" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Configured
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{provider.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Get Key
                          </a>
                        </Button>
                        {isConfigured(provider.id) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveApiKey(provider.id)}
                            disabled={loading[provider.id]}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`${provider.id}-key`}>
                          API Key (Format: {provider.keyFormat})
                        </Label>
                        <div className="relative">
                          <Input
                            id={`${provider.id}-key`}
                            type={showKeys[provider.id] ? "text" : "password"}
                            placeholder={`Enter your ${provider.name} API key`}
                            value={apiKeys[provider.id] || ''}
                            onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => toggleKeyVisibility(provider.id)}
                          >
                            {showKeys[provider.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSaveApiKey(provider.id)}
                        disabled={loading[provider.id] || !apiKeys[provider.id]?.trim()}
                        className="mt-6"
                      >
                        {loading[provider.id] ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Get your API key from{' '}
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                      >
                        {provider.website}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    placeholder="Enter your full name"
                    defaultValue={user?.user_metadata?.full_name || ''}
                  />
                </div>
                <Button>Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Generation Preferences</CardTitle>
                <CardDescription>
                  Configure how AI models generate code for your projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Framework</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option value="react">React</option>
                    <option value="vue">Vue.js</option>
                    <option value="angular">Angular</option>
                    <option value="svelte">Svelte</option>
                  </select>
                </div>
                <div>
                  <Label>Code Style Preference</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
                <div>
                  <Label>Default Complexity Level</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
