import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Search, 
  Target, 
  Layers, 
  Database, 
  Shield,
  Users,
  Zap,
  CheckCircle
} from 'lucide-react';

export interface RequirementAnalysis {
  projectType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  features: string[];
  techStack: string[];
  architecture: string;
  estimatedTime: string;
  securityLevel: 'basic' | 'enhanced' | 'enterprise';
  scalabilityNeeds: string[];
}

interface IntelligentRequirementAnalysisProps {
  userInput: string;
  onAnalysisComplete: (analysis: RequirementAnalysis) => void;
  isAnalyzing: boolean;
}

const IntelligentRequirementAnalysis: React.FC<IntelligentRequirementAnalysisProps> = ({
  userInput,
  onAnalysisComplete,
  isAnalyzing
}) => {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<RequirementAnalysis | null>(null);

  const analysisStages = [
    { name: 'Natural Language Processing', icon: Brain, duration: 1000 },
    { name: 'Feature Extraction', icon: Search, duration: 1500 },
    { name: 'Complexity Assessment', icon: Target, duration: 1200 },
    { name: 'Architecture Planning', icon: Layers, duration: 2000 },
    { name: 'Tech Stack Selection', icon: Database, duration: 1800 },
    { name: 'Security Analysis', icon: Shield, duration: 1300 }
  ];

  useEffect(() => {
    if (isAnalyzing && userInput) {
      performAnalysis();
    }
  }, [isAnalyzing, userInput]);

  const performAnalysis = async () => {
    setAnalysisProgress(0);
    
    for (let i = 0; i < analysisStages.length; i++) {
      const stage = analysisStages[i];
      setCurrentStage(stage.name);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, stage.duration));
      setAnalysisProgress(((i + 1) / analysisStages.length) * 100);
    }

    // Generate analysis result based on user input
    const analysis = generateAnalysis(userInput);
    setAnalysisResult(analysis);
    onAnalysisComplete(analysis);
  };

  const generateAnalysis = (input: string): RequirementAnalysis => {
    // AI-powered analysis simulation
    const keywords = input.toLowerCase();
    
    let projectType = 'webapp';
    if (keywords.includes('e-commerce') || keywords.includes('shop')) projectType = 'ecommerce';
    if (keywords.includes('blog') || keywords.includes('cms')) projectType = 'cms';
    if (keywords.includes('saas') || keywords.includes('dashboard')) projectType = 'saas';
    if (keywords.includes('portfolio') || keywords.includes('landing')) projectType = 'portfolio';

    const features = [];
    if (keywords.includes('auth') || keywords.includes('login')) features.push('authentication');
    if (keywords.includes('payment') || keywords.includes('stripe')) features.push('payments');
    if (keywords.includes('chat') || keywords.includes('messaging')) features.push('real-time-chat');
    if (keywords.includes('admin') || keywords.includes('dashboard')) features.push('admin-panel');
    if (keywords.includes('api') || keywords.includes('rest')) features.push('rest-api');
    if (keywords.includes('database') || keywords.includes('storage')) features.push('database');
    if (keywords.includes('mobile') || keywords.includes('responsive')) features.push('responsive-design');
    if (keywords.includes('seo') || keywords.includes('optimization')) features.push('seo');

    const complexity = features.length > 8 ? 'enterprise' : 
                      features.length > 5 ? 'complex' : 
                      features.length > 2 ? 'moderate' : 'simple';

    const techStack = ['React', 'TypeScript', 'Tailwind CSS'];
    if (keywords.includes('laravel') || keywords.includes('php')) techStack.push('Laravel', 'PHP');
    if (keywords.includes('node') || keywords.includes('express')) techStack.push('Node.js', 'Express');
    if (keywords.includes('wordpress')) techStack.push('WordPress', 'PHP');
    if (features.includes('database')) techStack.push('PostgreSQL');
    if (features.includes('real-time-chat')) techStack.push('WebSocket', 'Socket.io');

    return {
      projectType,
      complexity,
      features,
      techStack,
      architecture: complexity === 'enterprise' ? 'microservices' : 
                   complexity === 'complex' ? 'modular-monolith' : 'monolith',
      estimatedTime: complexity === 'enterprise' ? '3-5 weeks' :
                    complexity === 'complex' ? '2-3 weeks' :
                    complexity === 'moderate' ? '1-2 weeks' : '3-7 days',
      securityLevel: complexity === 'enterprise' ? 'enterprise' :
                    features.includes('payments') ? 'enhanced' : 'basic',
      scalabilityNeeds: complexity === 'enterprise' ? ['load-balancing', 'cdn', 'caching', 'auto-scaling'] :
                       complexity === 'complex' ? ['caching', 'cdn'] : ['basic-optimization']
    };
  };

  if (!isAnalyzing && !analysisResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Intelligent Requirement Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ready to analyze your project requirements</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary animate-pulse" />
            Analyzing Requirements...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStage}</span>
              <span>{Math.round(analysisProgress)}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {analysisStages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCompleted = analysisProgress > (index / analysisStages.length) * 100;
              const isActive = currentStage === stage.name;

              return (
                <div key={stage.name} className={`p-3 rounded-lg border text-center transition-all ${
                  isCompleted ? 'bg-primary/10 border-primary' : 
                  isActive ? 'bg-muted border-muted-foreground' : 'bg-muted/50'
                }`}>
                  <StageIcon className={`h-6 w-6 mx-auto mb-2 ${
                    isCompleted ? 'text-primary' : 
                    isActive ? 'text-foreground animate-pulse' : 'text-muted-foreground'
                  }`} />
                  <p className="text-xs font-medium">{stage.name}</p>
                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />}
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
          Analysis Complete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {analysisResult && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Project Type</h4>
                  <Badge variant="outline" className="capitalize">
                    {analysisResult.projectType.replace('-', ' ')}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Complexity Level</h4>
                  <Badge variant={
                    analysisResult.complexity === 'enterprise' ? 'destructive' :
                    analysisResult.complexity === 'complex' ? 'default' :
                    analysisResult.complexity === 'moderate' ? 'secondary' : 'outline'
                  } className="capitalize">
                    {analysisResult.complexity}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Estimated Timeline</h4>
                  <p className="text-sm text-muted-foreground">{analysisResult.estimatedTime}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Architecture</h4>
                  <Badge variant="outline" className="capitalize">
                    {analysisResult.architecture.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Core Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Security Level</h4>
                  <Badge variant={
                    analysisResult.securityLevel === 'enterprise' ? 'destructive' :
                    analysisResult.securityLevel === 'enhanced' ? 'default' : 'outline'
                  } className="capitalize">
                    {analysisResult.securityLevel}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Scalability Requirements</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.scalabilityNeeds.map((need) => (
                  <Badge key={need} variant="secondary" className="text-xs">
                    {need.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligentRequirementAnalysis;