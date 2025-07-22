
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Workflow, 
  Zap, 
  Settings, 
  Play, 
  Eye, 
  Code,
  Layers,
  Monitor,
  Rocket,
  Brain
} from 'lucide-react';
import WorkflowEngine, { WorkflowConfig } from '@/components/workflow/WorkflowEngine';
import AdvancedTemplateSystem from '@/components/workflow/AdvancedTemplateSystem';
import RealTimePreview from '@/components/workflow/RealTimePreview';

const WorkflowBuilder = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig>({
    projectType: 'webapp',
    framework: 'react',
    features: [],
    customization: {}
  });
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

  const handleStartWorkflow = (config: WorkflowConfig) => {
    setWorkflowConfig(config);
    setIsWorkflowRunning(true);
    setActiveTab('workflow');
  };

  const handleWorkflowComplete = (result: any) => {
    setIsWorkflowRunning(false);
    setActiveTab('preview');
    console.log('Workflow completed:', result);
  };

  const handleWorkflowError = (error: any) => {
    setIsWorkflowRunning(false);
    console.error('Workflow error:', error);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Workflow className="h-8 w-8 text-primary" />
              Advanced Workflow Builder
            </h1>
            <p className="text-muted-foreground mt-1">
              Build professional applications with our intelligent AI-powered workflow system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Next-Gen AI Builder
            </Badge>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="builder" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Builder</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center space-x-2" disabled={!isWorkflowRunning}>
              <Zap className="h-4 w-4" />
              <span>Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary" />
                  Intelligent Project Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Rocket className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    AI-Powered Application Generation
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                    Our advanced AI builder uses intelligent workflows to create professional applications 
                    faster and better than any existing platform. Choose from enterprise templates or 
                    describe your custom requirements.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer" 
                          onClick={() => handleStartWorkflow({
                            projectType: 'webapp',
                            framework: 'react',
                            features: ['authentication', 'real-time', 'responsive'],
                            customization: {}
                          })}>
                      <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">React Web App</h4>
                      <p className="text-sm text-muted-foreground">Modern React application with TypeScript</p>
                    </Card>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => handleStartWorkflow({
                            projectType: 'fullstack',
                            framework: 'laravel',
                            features: ['api', 'database', 'authentication'],
                            customization: {}
                          })}>
                      <Monitor className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">Laravel Full-Stack</h4>
                      <p className="text-sm text-muted-foreground">Complete Laravel backend with frontend</p>
                    </Card>
                    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => handleStartWorkflow({
                            projectType: 'wordpress',
                            framework: 'react',
                            features: ['cms', 'responsive', 'seo'],
                            customization: {}
                          })}>
                      <Layers className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">WordPress Theme</h4>
                      <p className="text-sm text-muted-foreground">Professional WordPress theme with React</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <AdvancedTemplateSystem />
          </TabsContent>

          <TabsContent value="workflow">
            {isWorkflowRunning && (
              <WorkflowEngine
                config={workflowConfig}
                onComplete={handleWorkflowComplete}
                onError={handleWorkflowError}
                onStageUpdate={(stage) => console.log('Stage update:', stage)}
              />
            )}
          </TabsContent>

          <TabsContent value="preview">
            <RealTimePreview />
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Advanced Features That Set Us Apart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">Intelligent AI</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced AI that understands context and generates production-ready code
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Monitor className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1">Real-Time Preview</h4>
                <p className="text-sm text-muted-foreground">
                  Live preview with hot reloading and instant deployment
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">Enterprise Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Professional templates for FinTech, Healthcare, E-commerce, and more
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Rocket className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-1">One-Click Deploy</h4>
                <p className="text-sm text-muted-foreground">
                  Deploy to multiple platforms with automated CI/CD pipelines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
