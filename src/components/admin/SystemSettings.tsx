import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings2, 
  Server, 
  Cloud, 
  Shield,
  Zap,
  Code,
  Database,
  Key,
  Globe,
  GitBranch,
  Container,
  Cpu,
  HardDrive,
  Network,
  Terminal,
  FileCode,
  Bot,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemConfig {
  codeGeneration: {
    enabled: boolean;
    maxConcurrentJobs: number;
    defaultTimeout: number;
    sandboxEnabled: boolean;
    dockerEnabled: boolean;
  };
  aiProviders: {
    openai: { enabled: boolean; apiKey: string; model: string };
    anthropic: { enabled: boolean; apiKey: string; model: string };
    google: { enabled: boolean; apiKey: string; model: string };
    groq: { enabled: boolean; apiKey: string; model: string };
  };
  github: {
    enabled: boolean;
    appId: string;
    privateKey: string;
    webhookSecret: string;
    autoCommit: boolean;
    defaultBranch: string;
  };
  compilation: {
    enabled: boolean;
    nodeVersion: string;
    pythonVersion: string;
    dockerImage: string;
    memoryLimit: string;
    cpuLimit: string;
    timeoutLimit: number;
  };
  fileSystem: {
    maxFileSize: number;
    allowedExtensions: string[];
    projectStructure: string;
    autoGenerate: boolean;
  };
  monitoring: {
    enabled: boolean;
    logLevel: string;
    retentionDays: number;
    alertsEnabled: boolean;
    webhookUrl: string;
  };
}

const SystemSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SystemConfig>({
    codeGeneration: {
      enabled: true,
      maxConcurrentJobs: 10,
      defaultTimeout: 900,
      sandboxEnabled: true,
      dockerEnabled: false,
    },
    aiProviders: {
      openai: { enabled: true, apiKey: '', model: 'gpt-4' },
      anthropic: { enabled: false, apiKey: '', model: 'claude-3-sonnet' },
      google: { enabled: false, apiKey: '', model: 'gemini-pro' },
      groq: { enabled: false, apiKey: '', model: 'mixtral-8x7b' },
    },
    github: {
      enabled: false,
      appId: '',
      privateKey: '',
      webhookSecret: '',
      autoCommit: true,
      defaultBranch: 'main',
    },
    compilation: {
      enabled: true,
      nodeVersion: '18',
      pythonVersion: '3.11',
      dockerImage: 'node:18-alpine',
      memoryLimit: '512MB',
      cpuLimit: '1',
      timeoutLimit: 300,
    },
    fileSystem: {
      maxFileSize: 10485760, // 10MB
      allowedExtensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.html', '.json', '.md', '.yml', '.yaml'],
      projectStructure: 'src/\n  components/\n  pages/\n  services/\n  utils/\npublic/\npackage.json\nREADME.md',
      autoGenerate: true,
    },
    monitoring: {
      enabled: true,
      logLevel: 'info',
      retentionDays: 30,
      alertsEnabled: false,
      webhookUrl: '',
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save configuration to localStorage for now
      localStorage.setItem('systemConfig', JSON.stringify(config));
      
      toast({
        title: "Settings Saved",
        description: "System configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save system configuration.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('systemConfig');
    window.location.reload();
  };

  const updateConfig = (section: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateAIProvider = (provider: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      aiProviders: {
        ...prev.aiProviders,
        [provider]: {
          ...prev.aiProviders[provider],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Configuration</h2>
          <p className="text-muted-foreground">Configure backend services and integrations</p>
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

      <Tabs defaultValue="generation" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full max-w-4xl bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="generation">Generation</TabsTrigger>
          <TabsTrigger value="ai-providers">AI Providers</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="compilation">Compilation</TabsTrigger>
          <TabsTrigger value="filesystem">File System</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Code Generation Settings */}
        <TabsContent value="generation">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary" />
                Code Generation Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="generation-enabled" className="text-base font-medium">
                    Enable Code Generation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow AI-powered code generation and compilation
                  </p>
                </div>
                <Switch 
                  id="generation-enabled"
                  checked={config.codeGeneration.enabled}
                  onCheckedChange={(checked) => updateConfig('codeGeneration', 'enabled', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="max-jobs">Max Concurrent Jobs</Label>
                  <Input 
                    id="max-jobs"
                    type="number"
                    value={config.codeGeneration.maxConcurrentJobs}
                    onChange={(e) => updateConfig('codeGeneration', 'maxConcurrentJobs', parseInt(e.target.value))}
                    className="bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="timeout">Default Timeout (seconds)</Label>
                  <Input 
                    id="timeout"
                    type="number"
                    value={config.codeGeneration.defaultTimeout}
                    onChange={(e) => updateConfig('codeGeneration', 'defaultTimeout', parseInt(e.target.value))}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sandbox-enabled" className="text-base font-medium">
                    Sandbox Environment
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Run code generation in isolated environment
                  </p>
                </div>
                <Switch 
                  id="sandbox-enabled"
                  checked={config.codeGeneration.sandboxEnabled}
                  onCheckedChange={(checked) => updateConfig('codeGeneration', 'sandboxEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="docker-enabled" className="text-base font-medium">
                    Docker Containers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use Docker for code execution (requires Docker setup)
                  </p>
                </div>
                <Switch 
                  id="docker-enabled"
                  checked={config.codeGeneration.dockerEnabled}
                  onCheckedChange={(checked) => updateConfig('codeGeneration', 'dockerEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Providers Settings */}
        <TabsContent value="ai-providers">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                AI Provider Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(config.aiProviders).map(([provider, settings]) => (
                <Card key={provider} className="bg-muted/30 border-primary/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-foreground capitalize">{provider}</h3>
                        <Badge variant={settings.enabled ? "default" : "secondary"} className="mt-1">
                          {settings.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <Switch 
                        checked={settings.enabled}
                        onCheckedChange={(checked) => updateAIProvider(provider, 'enabled', checked)}
                      />
                    </div>
                    
                    {settings.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${provider}-key`}>API Key</Label>
                          <Input 
                            id={`${provider}-key`}
                            type="password"
                            placeholder="Enter API key"
                            value={settings.apiKey}
                            onChange={(e) => updateAIProvider(provider, 'apiKey', e.target.value)}
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider}-model`}>Default Model</Label>
                          <Input 
                            id={`${provider}-model`}
                            placeholder="Model name"
                            value={settings.model}
                            onChange={(e) => updateAIProvider(provider, 'model', e.target.value)}
                            className="bg-background/50"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GitHub Integration Settings */}
        <TabsContent value="github">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GitBranch className="h-5 w-5 mr-2 text-primary" />
                GitHub Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="github-enabled" className="text-base font-medium">
                    Enable GitHub Integration
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically push generated code to GitHub repositories
                  </p>
                </div>
                <Switch 
                  id="github-enabled"
                  checked={config.github.enabled}
                  onCheckedChange={(checked) => updateConfig('github', 'enabled', checked)}
                />
              </div>

              {config.github.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="github-app-id">GitHub App ID</Label>
                      <Input 
                        id="github-app-id"
                        placeholder="123456"
                        value={config.github.appId}
                        onChange={(e) => updateConfig('github', 'appId', e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github-webhook">Webhook Secret</Label>
                      <Input 
                        id="github-webhook"
                        type="password"
                        placeholder="Enter webhook secret"
                        value={config.github.webhookSecret}
                        onChange={(e) => updateConfig('github', 'webhookSecret', e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="github-private-key">Private Key (PEM format)</Label>
                    <Textarea 
                      id="github-private-key"
                      placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                      value={config.github.privateKey}
                      onChange={(e) => updateConfig('github', 'privateKey', e.target.value)}
                      className="bg-background/50 min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="github-branch">Default Branch</Label>
                      <Input 
                        id="github-branch"
                        placeholder="main"
                        value={config.github.defaultBranch}
                        onChange={(e) => updateConfig('github', 'defaultBranch', e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-6">
                      <div>
                        <Label htmlFor="auto-commit" className="text-base font-medium">
                          Auto Commit
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically commit generated code
                        </p>
                      </div>
                      <Switch 
                        id="auto-commit"
                        checked={config.github.autoCommit}
                        onCheckedChange={(checked) => updateConfig('github', 'autoCommit', checked)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compilation Settings */}
        <TabsContent value="compilation">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-primary" />
                Code Compilation & Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compilation-enabled" className="text-base font-medium">
                    Enable Code Compilation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Compile and execute generated code for testing
                  </p>
                </div>
                <Switch 
                  id="compilation-enabled"
                  checked={config.compilation.enabled}
                  onCheckedChange={(checked) => updateConfig('compilation', 'enabled', checked)}
                />
              </div>

              {config.compilation.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="node-version">Node.js Version</Label>
                      <Select value={config.compilation.nodeVersion} onValueChange={(value) => updateConfig('compilation', 'nodeVersion', value)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16">Node.js 16</SelectItem>
                          <SelectItem value="18">Node.js 18</SelectItem>
                          <SelectItem value="20">Node.js 20</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="python-version">Python Version</Label>
                      <Select value={config.compilation.pythonVersion} onValueChange={(value) => updateConfig('compilation', 'pythonVersion', value)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3.9">Python 3.9</SelectItem>
                          <SelectItem value="3.10">Python 3.10</SelectItem>
                          <SelectItem value="3.11">Python 3.11</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeout-limit">Timeout (seconds)</Label>
                      <Input 
                        id="timeout-limit"
                        type="number"
                        value={config.compilation.timeoutLimit}
                        onChange={(e) => updateConfig('compilation', 'timeoutLimit', parseInt(e.target.value))}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="docker-image">Docker Image</Label>
                    <Input 
                      id="docker-image"
                      placeholder="node:18-alpine"
                      value={config.compilation.dockerImage}
                      onChange={(e) => updateConfig('compilation', 'dockerImage', e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="memory-limit">Memory Limit</Label>
                      <Select value={config.compilation.memoryLimit} onValueChange={(value) => updateConfig('compilation', 'memoryLimit', value)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="256MB">256MB</SelectItem>
                          <SelectItem value="512MB">512MB</SelectItem>
                          <SelectItem value="1GB">1GB</SelectItem>
                          <SelectItem value="2GB">2GB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cpu-limit">CPU Limit (cores)</Label>
                      <Select value={config.compilation.cpuLimit} onValueChange={(value) => updateConfig('compilation', 'cpuLimit', value)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5 cores</SelectItem>
                          <SelectItem value="1">1 core</SelectItem>
                          <SelectItem value="2">2 cores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* File System Settings */}
        <TabsContent value="filesystem">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCode className="h-5 w-5 mr-2 text-primary" />
                File System Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-generate" className="text-base font-medium">
                    Auto-Generate Structure
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically create project structure and files
                  </p>
                </div>
                <Switch 
                  id="auto-generate"
                  checked={config.fileSystem.autoGenerate}
                  onCheckedChange={(checked) => updateConfig('fileSystem', 'autoGenerate', checked)}
                />
              </div>

              <div>
                <Label htmlFor="max-file-size">Max File Size (bytes)</Label>
                <Input 
                  id="max-file-size"
                  type="number"
                  value={config.fileSystem.maxFileSize}
                  onChange={(e) => updateConfig('fileSystem', 'maxFileSize', parseInt(e.target.value))}
                  className="bg-background/50"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Current: {(config.fileSystem.maxFileSize / 1024 / 1024).toFixed(1)}MB
                </p>
              </div>

              <div>
                <Label htmlFor="allowed-extensions">Allowed File Extensions</Label>
                <Input 
                  id="allowed-extensions"
                  placeholder=".js,.ts,.jsx,.tsx,.css,.html"
                  value={config.fileSystem.allowedExtensions.join(',')}
                  onChange={(e) => updateConfig('fileSystem', 'allowedExtensions', e.target.value.split(','))}
                  className="bg-background/50"
                />
              </div>

              <div>
                <Label htmlFor="project-structure">Default Project Structure</Label>
                <Textarea 
                  id="project-structure"
                  placeholder="src/&#10;  components/&#10;  pages/&#10;package.json"
                  value={config.fileSystem.projectStructure}
                  onChange={(e) => updateConfig('fileSystem', 'projectStructure', e.target.value)}
                  className="bg-background/50 min-h-32"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="h-5 w-5 mr-2 text-primary" />
                Monitoring & Logging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monitoring-enabled" className="text-base font-medium">
                    Enable Monitoring
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Track system performance and errors
                  </p>
                </div>
                <Switch 
                  id="monitoring-enabled"
                  checked={config.monitoring.enabled}
                  onCheckedChange={(checked) => updateConfig('monitoring', 'enabled', checked)}
                />
              </div>

              {config.monitoring.enabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="log-level">Log Level</Label>
                      <Select value={config.monitoring.logLevel} onValueChange={(value) => updateConfig('monitoring', 'logLevel', value)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="retention-days">Log Retention (days)</Label>
                      <Input 
                        id="retention-days"
                        type="number"
                        value={config.monitoring.retentionDays}
                        onChange={(e) => updateConfig('monitoring', 'retentionDays', parseInt(e.target.value))}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="alerts-enabled" className="text-base font-medium">
                        Enable Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send alerts for system errors and failures
                      </p>
                    </div>
                    <Switch 
                      id="alerts-enabled"
                      checked={config.monitoring.alertsEnabled}
                      onCheckedChange={(checked) => updateConfig('monitoring', 'alertsEnabled', checked)}
                    />
                  </div>

                  {config.monitoring.alertsEnabled && (
                    <div>
                      <Label htmlFor="webhook-url">Alert Webhook URL</Label>
                      <Input 
                        id="webhook-url"
                        placeholder="https://your-webhook-url.com/alerts"
                        value={config.monitoring.webhookUrl}
                        onChange={(e) => updateConfig('monitoring', 'webhookUrl', e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;