import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { AIServiceManager } from '@/services/ai';

interface APIKeySetupProps {
  onSetupComplete?: () => void;
}

export const APIKeySetup: React.FC<APIKeySetupProps> = ({ onSetupComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keys, setKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    groq: ''
  });
  const [aiService] = useState(() => AIServiceManager.getInstance());

  const providers = [
    { 
      id: 'openai', 
      name: 'OpenAI GPT-4', 
      description: 'Best for complex applications',
      placeholder: 'sk-...',
      required: false
    },
    { 
      id: 'anthropic', 
      name: 'Anthropic Claude', 
      description: 'Excellent for architecture planning',
      placeholder: 'sk-ant-...',
      required: false
    },
    { 
      id: 'google', 
      name: 'Google Gemini', 
      description: 'Great for Laravel development',
      placeholder: 'AIza...',
      required: false
    },
    { 
      id: 'groq', 
      name: 'Groq Llama', 
      description: 'Ultra-fast generation',
      placeholder: 'gsk_...',
      required: false
    }
  ];

  const handleSaveKeys = () => {
    Object.entries(keys).forEach(([provider, key]) => {
      if (key.trim()) {
        aiService.setApiKey(provider, key.trim());
      }
    });
    
    setIsOpen(false);
    onSetupComplete?.();
  };

  const getProviderStatus = (providerId: string) => {
    return aiService.hasApiKey(providerId);
  };

  const configuredCount = providers.filter(p => getProviderStatus(p.id)).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <Key className="h-4 w-4" />
          <span>Setup AI Keys</span>
          <Badge variant={configuredCount > 0 ? "default" : "secondary"}>
            {configuredCount}/{providers.length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>AI API Keys Configuration</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure API keys for AI providers to enable real code generation. At least one provider is recommended.
          </p>
          
          {providers.map((provider) => (
            <Card key={provider.id} className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center space-x-2">
                    <span>{provider.name}</span>
                    {getProviderStatus(provider.id) ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <Badge variant={getProviderStatus(provider.id) ? "default" : "secondary"}>
                    {getProviderStatus(provider.id) ? 'Configured' : 'Not Set'}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{provider.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor={provider.id}>API Key</Label>
                  <Input
                    id={provider.id}
                    type="password"
                    placeholder={provider.placeholder}
                    value={keys[provider.id as keyof typeof keys]}
                    onChange={(e) => setKeys(prev => ({
                      ...prev,
                      [provider.id]: e.target.value
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-between items-center pt-4">
            <p className="text-xs text-muted-foreground">
              Keys are stored locally and used for direct API calls
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveKeys}>
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};