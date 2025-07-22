import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Globe,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeploymentProvider {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface DeploymentStatus {
  status: 'idle' | 'connecting' | 'deploying' | 'success' | 'error';
  message: string;
  url?: string;
  progress: number;
}

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData?: any;
}

const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose, projectData }) => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<DeploymentProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: '',
    progress: 0
  });

  useEffect(() => {
    // Load deployment configuration
    const loadProviders = () => {
      const config = localStorage.getItem('deploymentConfig');
      if (config) {
        try {
          const parsed = JSON.parse(config);
          const availableProviders: DeploymentProvider[] = [
            {
              id: 'vercel',
              name: 'Vercel',
              description: 'Deploy with automatic SSL and global CDN',
              icon: <div className="w-5 h-5 bg-foreground rounded-sm" />,
              enabled: parsed.vercel?.enabled || false
            },
            {
              id: 'netlify',
              name: 'Netlify',
              description: 'Deploy with continuous deployment and edge functions',
              icon: <Cloud className="h-5 w-5 text-blue-500" />,
              enabled: parsed.netlify?.enabled || false
            }
          ];
          setProviders(availableProviders.filter(p => p.enabled));
        } catch (error) {
          console.error('Failed to load deployment config:', error);
        }
      }
    };

    if (isOpen) {
      loadProviders();
      setSelectedProvider(null);
      setDeploymentStatus({ status: 'idle', message: '', progress: 0 });
    }
  }, [isOpen]);

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleDeploy = async () => {
    if (!selectedProvider || !projectData) return;

    try {
      setDeploymentStatus({ status: 'connecting', message: 'Connecting to deployment provider...', progress: 10 });
      
      // Check if user is authenticated with the provider
      const authToken = localStorage.getItem(`${selectedProvider}_auth_token`);
      
      if (!authToken) {
        // Initiate OAuth flow
        await initiateOAuth(selectedProvider);
        return;
      }

      // Start deployment process
      await deployToProvider(selectedProvider, authToken);
      
    } catch (error) {
      console.error('Deployment failed:', error);
      setDeploymentStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Deployment failed',
        progress: 0
      });
      
      toast({
        title: "Deployment Failed",
        description: "There was an error deploying your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const initiateOAuth = async (provider: string) => {
    setDeploymentStatus({ status: 'connecting', message: 'Redirecting to authorization...', progress: 5 });
    
    // Get provider configuration
    const config = JSON.parse(localStorage.getItem('deploymentConfig') || '{}');
    const providerConfig = config[provider];
    
    if (!providerConfig?.clientId) {
      throw new Error(`${provider} is not properly configured. Please contact admin.`);
    }

    const authUrl = getOAuthUrl(provider, providerConfig.clientId);
    
    // Open OAuth popup
    const popup = window.open(
      authUrl,
      `${provider}_oauth`,
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for OAuth completion
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Check if auth was successful
        const token = localStorage.getItem(`${provider}_auth_token`);
        if (token) {
          handleDeploy(); // Retry deployment with new token
        } else {
          setDeploymentStatus({
            status: 'error',
            message: 'Authorization was cancelled or failed',
            progress: 0
          });
        }
      }
    }, 1000);
  };

  const getOAuthUrl = (provider: string, clientId: string): string => {
    const redirectUri = `${window.location.origin}/api/auth/${provider}/callback`;
    
    switch (provider) {
      case 'vercel':
        return `https://vercel.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user`;
      case 'netlify':
        return `https://app.netlify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  };

  const deployToProvider = async (provider: string, authToken: string) => {
    setDeploymentStatus({ status: 'deploying', message: 'Preparing project files...', progress: 20 });
    
    // Simulate deployment steps
    const steps = [
      { message: 'Bundling project files...', progress: 30 },
      { message: 'Uploading to deployment provider...', progress: 50 },
      { message: 'Building project...', progress: 70 },
      { message: 'Configuring domain...', progress: 90 },
      { message: 'Deployment complete!', progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDeploymentStatus({ status: 'deploying', message: step.message, progress: step.progress });
    }

    // Simulate successful deployment
    const deploymentUrl = `https://${generateDeploymentId()}.${provider === 'vercel' ? 'vercel.app' : 'netlify.app'}`;
    
    setDeploymentStatus({
      status: 'success',
      message: 'Your project has been successfully deployed!',
      url: deploymentUrl,
      progress: 100
    });

    toast({
      title: "Deployment Successful!",
      description: `Your project is now live at ${deploymentUrl}`,
    });
  };

  const generateDeploymentId = (): string => {
    return Math.random().toString(36).substring(2, 15);
  };

  const getStatusIcon = () => {
    switch (deploymentStatus.status) {
      case 'connecting':
      case 'deploying':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Globe className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const isDeploying = deploymentStatus.status === 'connecting' || deploymentStatus.status === 'deploying';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>Deploy Your Project</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {deploymentStatus.status === 'idle' ? (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose Deployment Provider</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a platform to deploy your project to the web
                </p>
              </div>

              {providers.length === 0 ? (
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">
                        No deployment providers available
                      </p>
                      <p className="text-sm text-amber-600 dark:text-amber-300">
                        Contact your administrator to enable deployment providers
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {providers.map((provider) => (
                    <Card 
                      key={provider.id}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedProvider === provider.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => handleProviderSelect(provider.id)}
                    >
                      <CardContent className="flex items-center space-x-4 p-4">
                        {provider.icon}
                        <div className="flex-1">
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground">{provider.description}</p>
                        </div>
                        <Badge variant={selectedProvider === provider.id ? "default" : "secondary"}>
                          {selectedProvider === provider.id ? 'Selected' : 'Available'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeploy}
                  disabled={!selectedProvider || providers.length === 0}
                  className="gradient-primary"
                >
                  Deploy Project
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div className="flex-1">
                  <h3 className="font-medium">
                    {deploymentStatus.status === 'success' ? 'Deployment Complete!' : 'Deploying Project...'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{deploymentStatus.message}</p>
                </div>
              </div>

              {isDeploying && (
                <div>
                  <Progress value={deploymentStatus.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {deploymentStatus.progress}% complete
                  </p>
                </div>
              )}

              {deploymentStatus.status === 'success' && deploymentStatus.url && (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          Live URL
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-300 font-mono">
                          {deploymentStatus.url}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={deploymentStatus.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3">
                {deploymentStatus.status === 'error' && (
                  <Button variant="outline" onClick={() => setDeploymentStatus({ status: 'idle', message: '', progress: 0 })}>
                    Try Again
                  </Button>
                )}
                <Button onClick={onClose}>
                  {deploymentStatus.status === 'success' ? 'Done' : 'Close'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentModal;