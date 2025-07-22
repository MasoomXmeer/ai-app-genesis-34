import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  Database, 
  Server, 
  Globe, 
  Shield, 
  Zap,
  GitBranch,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { RequirementAnalysis } from './IntelligentRequirementAnalysis';

export interface ArchitecturePlan {
  frontend: {
    framework: string;
    components: string[];
    routing: string;
    stateManagement: string;
    styling: string;
  };
  backend: {
    framework: string;
    database: string;
    api: string;
    authentication: string;
    fileStorage: string;
  };
  infrastructure: {
    hosting: string;
    cdn: string;
    monitoring: string;
    deployment: string;
    scaling: string[];
  };
  security: {
    authentication: string[];
    authorization: string[];
    dataProtection: string[];
    compliance: string[];
  };
  integrations: {
    thirdParty: string[];
    apis: string[];
    webhooks: string[];
  };
  performance: {
    caching: string[];
    optimization: string[];
    monitoring: string[];
  };
}

interface ArchitecturePlanningEngineProps {
  analysis: RequirementAnalysis;
  onPlanComplete: (plan: ArchitecturePlan) => void;
  isPlanning: boolean;
}

const ArchitecturePlanningEngine: React.FC<ArchitecturePlanningEngineProps> = ({
  analysis,
  onPlanComplete,
  isPlanning
}) => {
  const [planningProgress, setPlanningProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [architecturePlan, setArchitecturePlan] = useState<ArchitecturePlan | null>(null);

  const planningStages = [
    { name: 'Frontend Architecture Design', icon: Globe, duration: 1500 },
    { name: 'Backend Infrastructure Planning', icon: Server, duration: 2000 },
    { name: 'Database Schema Design', icon: Database, duration: 1800 },
    { name: 'Security Framework Setup', icon: Shield, duration: 1600 },
    { name: 'Performance Optimization Strategy', icon: Zap, duration: 1400 },
    { name: 'Integration Planning', icon: GitBranch, duration: 1200 },
    { name: 'Scalability Architecture', icon: BarChart3, duration: 1700 }
  ];

  useEffect(() => {
    if (isPlanning && analysis) {
      performArchitecturePlanning();
    }
  }, [isPlanning, analysis]);

  const performArchitecturePlanning = async () => {
    setPlanningProgress(0);
    
    for (let i = 0; i < planningStages.length; i++) {
      const stage = planningStages[i];
      setCurrentStage(stage.name);
      
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      setPlanningProgress(((i + 1) / planningStages.length) * 100);
    }

    const plan = generateArchitecturePlan(analysis);
    setArchitecturePlan(plan);
    onPlanComplete(plan);
  };

  const generateArchitecturePlan = (analysis: RequirementAnalysis): ArchitecturePlan => {
    const isLaravel = analysis.techStack.includes('Laravel');
    const isWordPress = analysis.techStack.includes('WordPress');
    const isComplex = analysis.complexity === 'complex' || analysis.complexity === 'enterprise';
    const hasPayments = analysis.features.includes('payments');
    const hasRealTime = analysis.features.includes('real-time-chat');

    return {
      frontend: {
        framework: isWordPress ? 'WordPress + React' : 'React 18',
        components: [
          'React Components',
          'TypeScript',
          'React Hook Form',
          'React Query',
          ...(hasRealTime ? ['WebSocket Client'] : []),
          'PWA Support'
        ],
        routing: isWordPress ? 'WordPress Routing' : 'React Router v6',
        stateManagement: isComplex ? 'Zustand + React Query' : 'React Query',
        styling: 'Tailwind CSS + shadcn/ui'
      },
      backend: {
        framework: isLaravel ? 'Laravel 10' : isWordPress ? 'WordPress' : 'Node.js + Express',
        database: isLaravel ? 'MySQL' : 'PostgreSQL',
        api: isLaravel ? 'Laravel API Resources' : isWordPress ? 'REST API + GraphQL' : 'REST + GraphQL',
        authentication: isLaravel ? 'Laravel Sanctum' : 'JWT + OAuth2',
        fileStorage: isComplex ? 'AWS S3 + CloudFront' : 'Local + CDN'
      },
      infrastructure: {
        hosting: isComplex ? 'AWS/Azure' : 'Vercel + Railway',
        cdn: 'CloudFlare',
        monitoring: isComplex ? 'DataDog + Sentry' : 'Vercel Analytics',
        deployment: 'GitHub Actions CI/CD',
        scaling: isComplex ? ['Load Balancer', 'Auto Scaling', 'Redis Cache'] : ['CDN', 'Edge Functions']
      },
      security: {
        authentication: ['Multi-Factor Auth', 'OAuth2/OIDC', 'Session Management'],
        authorization: ['RBAC', 'Permission Guards', 'API Rate Limiting'],
        dataProtection: ['Encryption at Rest', 'HTTPS', 'Input Validation', 'XSS Protection'],
        compliance: hasPayments ? ['PCI DSS', 'GDPR', 'SOC 2'] : ['GDPR', 'Basic Compliance']
      },
      integrations: {
        thirdParty: [
          ...(hasPayments ? ['Stripe', 'PayPal'] : []),
          'Email Service',
          'Push Notifications',
          ...(analysis.features.includes('seo') ? ['Google Analytics', 'Search Console'] : [])
        ],
        apis: ['REST API', 'GraphQL', 'WebHooks'],
        webhooks: hasPayments ? ['Payment Webhooks', 'User Events'] : ['User Events']
      },
      performance: {
        caching: ['Redis Cache', 'CDN Caching', 'Browser Caching'],
        optimization: ['Code Splitting', 'Image Optimization', 'Lazy Loading', 'Tree Shaking'],
        monitoring: ['Performance Metrics', 'Error Tracking', 'User Analytics']
      }
    };
  };

  if (!isPlanning && !architecturePlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Architecture Planning Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ready to design your application architecture</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPlanning) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary animate-pulse" />
            Designing Architecture...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStage}</span>
              <span>{Math.round(planningProgress)}%</span>
            </div>
            <Progress value={planningProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planningStages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCompleted = planningProgress > (index / planningStages.length) * 100;
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Architecture Plan Complete
        </CardTitle>
      </CardHeader>
      <CardContent>
        {architecturePlan && (
          <Tabs defaultValue="frontend" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="frontend" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Framework & Core
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="default">{architecturePlan.frontend.framework}</Badge>
                    <div className="text-sm text-muted-foreground">
                      <p>Routing: {architecturePlan.frontend.routing}</p>
                      <p>State: {architecturePlan.frontend.stateManagement}</p>
                      <p>Styling: {architecturePlan.frontend.styling}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Components</h4>
                  <div className="flex flex-wrap gap-2">
                    {architecturePlan.frontend.components.map((component) => (
                      <Badge key={component} variant="outline" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backend" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Server className="h-4 w-4 mr-2" />
                    Core Infrastructure
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="default">{architecturePlan.backend.framework}</Badge>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Database: {architecturePlan.backend.database}</p>
                      <p>API: {architecturePlan.backend.api}</p>
                      <p>Auth: {architecturePlan.backend.authentication}</p>
                      <p>Storage: {architecturePlan.backend.fileStorage}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Hosting & Deployment
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm space-y-1">
                      <p>Hosting: <Badge variant="outline">{architecturePlan.infrastructure.hosting}</Badge></p>
                      <p>CDN: <Badge variant="outline">{architecturePlan.infrastructure.cdn}</Badge></p>
                      <p>Monitoring: <Badge variant="outline">{architecturePlan.infrastructure.monitoring}</Badge></p>
                      <p>CI/CD: <Badge variant="outline">{architecturePlan.infrastructure.deployment}</Badge></p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Scaling Strategy</h4>
                  <div className="flex flex-wrap gap-2">
                    {architecturePlan.infrastructure.scaling.map((strategy) => (
                      <Badge key={strategy} variant="secondary" className="text-xs">
                        {strategy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(architecturePlan.security).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-2 flex items-center capitalize">
                      <Shield className="h-4 w-4 mr-2" />
                      {category.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(architecturePlan.integrations).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-2 flex items-center capitalize">
                      <GitBranch className="h-4 w-4 mr-2" />
                      {category.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Badge key={item} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(architecturePlan.performance).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-2 flex items-center capitalize">
                      <Zap className="h-4 w-4 mr-2" />
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ArchitecturePlanningEngine;