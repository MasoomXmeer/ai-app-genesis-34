import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Globe,
  Settings,
  Save,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeploymentConfig {
  vercel: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    name: string;
    description: string;
  };
  netlify: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    name: string;
    description: string;
  };
}

const DeploymentSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<DeploymentConfig>({
    vercel: {
      enabled: true,
      clientId: '',
      clientSecret: '',
      name: 'Vercel',
      description: 'Deploy to Vercel with automatic SSL and global CDN'
    },
    netlify: {
      enabled: true,
      clientId: '',
      clientSecret: '',
      name: 'Netlify',
      description: 'Deploy to Netlify with continuous deployment and edge functions'
    }
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load existing configuration
    const savedConfig = localStorage.getItem('deploymentConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to load deployment config:', error);
      }
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem('deploymentConfig', JSON.stringify(config));
      
      toast({
        title: "Deployment Settings Saved",
        description: "Provider configurations have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save deployment configuration.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({
      vercel: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        name: 'Vercel',
        description: 'Deploy to Vercel with automatic SSL and global CDN'
      },
      netlify: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        name: 'Netlify',
        description: 'Deploy to Netlify with continuous deployment and edge functions'
      }
    });
  };

  const updateProvider = (provider: 'vercel' | 'netlify', field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'vercel':
        return <div className="w-5 h-5 bg-foreground rounded-sm" />;
      case 'netlify':
        return <Cloud className="h-5 w-5 text-blue-500" />;
      default:
        return <Globe className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Deployment Settings</h2>
          <p className="text-muted-foreground">Configure deployment providers and OAuth settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(config).map(([provider, settings]) => (
          <Card key={provider} className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getProviderIcon(provider)}
                  <div>
                    <h3 className="text-lg font-semibold capitalize">{settings.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal">
                      {settings.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={settings.enabled ? "default" : "secondary"}>
                    {settings.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Switch 
                    checked={settings.enabled}
                    onCheckedChange={(checked) => updateProvider(provider as 'vercel' | 'netlify', 'enabled', checked)}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            
            {settings.enabled && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${provider}-client-id`}>Client ID</Label>
                    <Input 
                      id={`${provider}-client-id`}
                      placeholder={`Enter ${settings.name} Client ID`}
                      value={settings.clientId}
                      onChange={(e) => updateProvider(provider as 'vercel' | 'netlify', 'clientId', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${provider}-client-secret`}>Client Secret</Label>
                    <Input 
                      id={`${provider}-client-secret`}
                      type="password"
                      placeholder={`Enter ${settings.name} Client Secret`}
                      value={settings.clientSecret}
                      onChange={(e) => updateProvider(provider as 'vercel' | 'netlify', 'clientSecret', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">OAuth Setup Guide</p>
                    <p className="text-xs text-muted-foreground">
                      Configure OAuth app in {settings.name} dashboard
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={provider === 'vercel' 
                        ? 'https://vercel.com/dashboard/integrations' 
                        : 'https://app.netlify.com/account/applications'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Setup
                    </a>
                  </Button>
                </div>

                <div className="bg-muted/20 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-medium text-sm mb-2">Callback URL Configuration</h4>
                  <code className="text-xs bg-background/50 p-2 rounded block">
                    {window.location.origin}/api/auth/{provider}/callback
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Add this URL to your {settings.name} OAuth app settings
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Deployment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Enabled Providers</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(config)
                  .filter(([_, settings]) => settings.enabled)
                  .map(([provider, settings]) => (
                    <Badge key={provider} variant="default" className="flex items-center space-x-1">
                      {getProviderIcon(provider)}
                      <span className="capitalize">{settings.name}</span>
                    </Badge>
                  ))}
                {Object.values(config).every(settings => !settings.enabled) && (
                  <Badge variant="destructive">No providers enabled</Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Status</h4>
              <div className="text-sm text-muted-foreground">
                {Object.values(config).filter(s => s.enabled).length} of {Object.keys(config).length} providers configured
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentSettings;