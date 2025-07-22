import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { AIServiceManager, APIKeyManager } from '@/services/ai';

export const AIProviderSettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    groq: ''
  });
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTestingKeys, setIsTestingKeys] = useState(false);
  const [aiService] = useState(() => AIServiceManager.getInstance());
  const [keyManager] = useState(() => APIKeyManager.getInstance());

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      models: ['GPT-4 Turbo', 'GPT-4'],
      description: 'Best for complex enterprise applications and general code generation',
      speed: 'Medium',
      cost: '$0.03/1K tokens',
      strengths: ['Complex reasoning', 'Large context', 'Code quality'],
      placeholder: 'sk-...'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: ['Claude 3.5 Sonnet', 'Claude 3 Opus'],
      description: 'Excellent for architecture planning and code review',
      speed: 'Medium',
      cost: '$0.03/1K tokens',
      strengths: ['Architecture design', 'Code analysis', 'Safety'],
      placeholder: 'sk-ant-...'
    },
    {
      id: 'google',
      name: 'Google AI',
      models: ['Gemini Pro'],
      description: 'Great for Laravel/PHP development and web services',
      speed: 'Fast',
      cost: '$0.125/1K tokens',
      strengths: ['PHP expertise', 'Web development', 'Integration'],
      placeholder: 'AIza...'
    },
    {
      id: 'groq',
      name: 'Groq',
      models: ['Llama 3 70B', 'Mixtral 8x7B'],
      description: 'Ultra-fast generation for rapid prototyping',
      speed: 'Very Fast',
      cost: '$0.01/1K tokens',
      strengths: ['Speed', 'Cost effective', 'Real-time'],
      placeholder: 'gsk_...'
    }
  ];

  useEffect(() => {
    // Load existing keys
    providers.forEach(provider => {
      const existingKey = keyManager.getApiKey(provider.id);
      if (existingKey) {
        setApiKeys(prev => ({
          ...prev,
          [provider.id]: existingKey
        }));
      }
    });
  }, [keyManager]);

  const handleSaveKey = (providerId: string) => {
    const key = apiKeys[providerId as keyof typeof apiKeys];
    if (key.trim()) {
      keyManager.setApiKey(providerId, key.trim());
      setTestResults(prev => ({ ...prev, [providerId]: true }));
    }
  };

  const handleTestKey = async (providerId: string) => {
    const key = apiKeys[providerId as keyof typeof apiKeys];
    if (!key.trim()) return;

    setIsTestingKeys(true);
    try {
      // In production, this would test the actual API
      const isValid = keyManager.validateApiKey(providerId, key);
      setTestResults(prev => ({ ...prev, [providerId]: isValid }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [providerId]: false }));
    } finally {
      setIsTestingKeys(false);
    }
  };

  const getProviderStatus = (providerId: string) => {
    const hasKey = keyManager.hasApiKey(providerId);
    const testResult = testResults[providerId];
    
    if (hasKey && testResult) return 'configured';
    if (hasKey) return 'saved';
    return 'not-configured';
  };

  const configuredCount = providers.filter(p => getProviderStatus(p.id) === 'configured').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>AI Provider Configuration</span>
            </div>
            <Badge variant={configuredCount > 0 ? "default" : "secondary"}>
              {configuredCount}/{providers.length} Configured
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Configuration Progress</span>
              <span>{Math.round((configuredCount / providers.length) * 100)}%</span>
            </div>
            <Progress value={(configuredCount / providers.length) * 100} className="h-2" />
          </div>

          <Tabs defaultValue={providers[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {providers.map((provider) => (
                <TabsTrigger key={provider.id} value={provider.id} className="relative">
                  {provider.name}
                  {getProviderStatus(provider.id) === 'configured' && (
                    <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {providers.map((provider) => (
              <TabsContent key={provider.id} value={provider.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>{provider.name}</span>
                      <Badge variant={getProviderStatus(provider.id) === 'configured' ? 'default' : 'outline'}>
                        {getProviderStatus(provider.id) === 'configured' ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Provider Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Speed</p>
                          <p className="text-xs text-muted-foreground">{provider.speed}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Cost</p>
                          <p className="text-xs text-muted-foreground">{provider.cost}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Models</p>
                          <p className="text-xs text-muted-foreground">{provider.models.join(', ')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Strengths */}
                    <div>
                      <p className="text-sm font-medium mb-2">Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {provider.strengths.map((strength) => (
                          <Badge key={strength} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* API Key Configuration */}
                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="password"
                          placeholder={provider.placeholder}
                          value={apiKeys[provider.id as keyof typeof apiKeys]}
                          onChange={(e) => setApiKeys(prev => ({
                            ...prev,
                            [provider.id]: e.target.value
                          }))}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleTestKey(provider.id)}
                          disabled={isTestingKeys || !apiKeys[provider.id as keyof typeof apiKeys].trim()}
                        >
                          Test
                        </Button>
                        <Button
                          onClick={() => handleSaveKey(provider.id)}
                          disabled={!apiKeys[provider.id as keyof typeof apiKeys].trim()}
                        >
                          Save
                        </Button>
                      </div>
                      
                      {/* Status Indicator */}
                      {getProviderStatus(provider.id) !== 'not-configured' && (
                        <div className="flex items-center space-x-2 text-sm">
                          {getProviderStatus(provider.id) === 'configured' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">API key configured and verified</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-yellow-600">API key saved but not verified</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Usage Recommendations */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Usage Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">For Enterprise Applications:</h4>
                  <p className="text-muted-foreground">Use GPT-4 Turbo or Claude 3.5 Sonnet for complex business logic and architecture.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">For Laravel Development:</h4>
                  <p className="text-muted-foreground">Gemini Pro excels at PHP/Laravel code generation and web service integrations.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">For Rapid Prototyping:</h4>
                  <p className="text-muted-foreground">Groq with Llama 3 provides ultra-fast generation for quick iterations.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">For Code Review:</h4>
                  <p className="text-muted-foreground">Claude models are excellent for code analysis and architectural guidance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};