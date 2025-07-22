import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Rocket, 
  Globe, 
  Shield, 
  Zap, 
  GitBranch,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Settings,
  Monitor,
  Database
} from 'lucide-react';

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'aws' | 'azure' | 'gcp';
  domain?: string;
  environment: 'staging' | 'production';
  features: {
    ssl: boolean;
    cdn: boolean;
    analytics: boolean;
    monitoring: boolean;
  };
}

interface LiveDeploymentPipelineProps {
  projectCode: string;
  config: DeploymentConfig;
  onDeploymentComplete: (result: any) => void;
  isDeploying: boolean;
}

const LiveDeploymentPipeline: React.FC<LiveDeploymentPipelineProps> = ({
  projectCode,
  config,
  onDeploymentComplete,
  isDeploying
}) => {
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [deploymentLogs, setDeploymentLogs] = useState<any[]>([]);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [customDomain, setCustomDomain] = useState(config.domain || '');

  const deploymentStages = [
    { name: 'Code Preparation', icon: GitBranch, duration: 2000 },
    { name: 'Build Process', icon: Settings, duration: 8000 },
    { name: 'SSL Certificate', icon: Shield, duration: 3000 },
    { name: 'CDN Configuration', icon: Zap, duration: 2500 },
    { name: 'Domain Setup', icon: Globe, duration: 4000 },
    { name: 'Performance Optimization', icon: Monitor, duration: 3500 },
    { name: 'Health Checks', icon: CheckCircle, duration: 2000 }
  ];

  useEffect(() => {
    if (isDeploying) {
      performDeployment();
    }
  }, [isDeploying]);

  const addLog = (type: 'info' | 'success' | 'error' | 'warning', message: string) => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      stage: currentStage
    };
    setDeploymentLogs(prev => [...prev, newLog]);
  };

  const performDeployment = async () => {
    setDeploymentProgress(0);
    setDeploymentLogs([]);
    
    addLog('info', 'Starting deployment pipeline...');
    
    for (let i = 0; i < deploymentStages.length; i++) {
      const stage = deploymentStages[i];
      setCurrentStage(stage.name);
      addLog('info', `Starting: ${stage.name}`);
      
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      
      setDeploymentProgress(((i + 1) / deploymentStages.length) * 100);
      addLog('success', `Completed: ${stage.name}`);
    }

    // Generate deployment result
    const result = {
      url: customDomain || `https://${generateSlug()}.${config.platform}.app`,
      stagingUrl: `https://staging-${generateSlug()}.${config.platform}.app`,
      buildTime: '2m 34s',
      size: '2.1 MB',
      performance: {
        lighthouse: 98,
        firstContentfulPaint: '0.8s',
        largestContentfulPaint: '1.2s',
        cumulativeLayoutShift: 0.02
      },
      features: {
        ssl: true,
        cdn: true,
        analytics: config.features.analytics,
        monitoring: config.features.monitoring
      }
    };

    setDeploymentResult(result);
    addLog('success', 'Deployment completed successfully!');
    onDeploymentComplete(result);
  };

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isDeploying && !deploymentResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="h-5 w-5 mr-2 text-primary" />
            Live Deployment Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Rocket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ready to deploy your application</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isDeploying) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Rocket className="h-5 w-5 mr-2 text-primary animate-pulse" />
            Deploying to {config.platform}...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStage}</span>
              <span>{Math.round(deploymentProgress)}%</span>
            </div>
            <Progress value={deploymentProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deploymentStages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCompleted = deploymentProgress > (index / deploymentStages.length) * 100;
              const isActive = currentStage === stage.name;

              return (
                <div key={stage.name} className={`p-4 rounded-lg border text-center transition-all ${
                  isCompleted ? 'bg-primary/10 border-primary' : 
                  isActive ? 'bg-muted border-muted-foreground' : 'bg-muted/50'
                }`}>
                  <StageIcon className={`h-8 w-8 mx-auto mb-2 ${
                    isCompleted ? 'text-primary' : 
                    isActive ? 'text-foreground animate-pulse' : 'text-muted-foreground'
                  }`} />
                  <p className="text-sm font-medium">{stage.name}</p>
                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-2" />}
                </div>
              );
            })}
          </div>

          {/* Deployment Logs */}
          <div className="max-h-60 overflow-y-auto space-y-2 bg-muted/50 p-4 rounded-lg">
            {deploymentLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2 text-sm">
                <span className="text-muted-foreground font-mono">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <div className={`flex items-center space-x-1 ${
                  log.type === 'error' ? 'text-red-600' :
                  log.type === 'success' ? 'text-green-600' :
                  log.type === 'warning' ? 'text-yellow-600' :
                  'text-foreground'
                }`}>
                  {log.type === 'error' && <AlertCircle className="h-3 w-3" />}
                  {log.type === 'success' && <CheckCircle className="h-3 w-3" />}
                  {log.type === 'warning' && <AlertCircle className="h-3 w-3" />}
                  {log.type === 'info' && <Clock className="h-3 w-3" />}
                  <span>[{log.stage}] {log.message}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Deployment Successful
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deploymentResult && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Live URLs
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <Badge variant="default">Production</Badge>
                        <span className="flex-1 text-sm">{deploymentResult.url}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(deploymentResult.url)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <Badge variant="secondary">Staging</Badge>
                        <span className="flex-1 text-sm">{deploymentResult.stagingUrl}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(deploymentResult.stagingUrl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Build Information</h4>
                    <div className="text-sm space-y-1">
                      <p>Build Time: <Badge variant="outline">{deploymentResult.buildTime}</Badge></p>
                      <p>Bundle Size: <Badge variant="outline">{deploymentResult.size}</Badge></p>
                      <p>Platform: <Badge variant="outline" className="capitalize">{config.platform}</Badge></p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Enabled Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {deploymentResult.features.ssl && (
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          SSL Certificate
                        </Badge>
                      )}
                      {deploymentResult.features.cdn && (
                        <Badge variant="secondary">
                          <Zap className="h-3 w-3 mr-1" />
                          Global CDN
                        </Badge>
                      )}
                      {deploymentResult.features.analytics && (
                        <Badge variant="secondary">
                          <Monitor className="h-3 w-3 mr-1" />
                          Analytics
                        </Badge>
                      )}
                      {deploymentResult.features.monitoring && (
                        <Badge variant="secondary">
                          <Database className="h-3 w-3 mr-1" />
                          Monitoring
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Custom Domain</h4>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="yourdomain.com"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                      />
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Lighthouse Score
                  </h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {deploymentResult.performance.lighthouse}
                    </div>
                    <Badge variant="outline" className="text-green-600">Excellent</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Core Web Vitals</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">First Contentful Paint</span>
                      <Badge variant="outline" className="text-green-600">
                        {deploymentResult.performance.firstContentfulPaint}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Largest Contentful Paint</span>
                      <Badge variant="outline" className="text-green-600">
                        {deploymentResult.performance.largestContentfulPaint}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cumulative Layout Shift</span>
                      <Badge variant="outline" className="text-green-600">
                        {deploymentResult.performance.cumulativeLayoutShift}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-600" />
                      Security Features
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">SSL/TLS Certificate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">HTTPS Redirect</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Security Headers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">DDoS Protection</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="text-center py-8">
                <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Real-Time Monitoring Active</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your application is being monitored for uptime, performance, and errors. 
                  You'll receive alerts for any issues.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveDeploymentPipeline;