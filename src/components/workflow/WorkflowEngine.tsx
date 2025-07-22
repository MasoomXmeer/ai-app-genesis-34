import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Database, 
  Globe, 
  Smartphone,
  Server,
  Zap,
  Eye,
  Download
} from 'lucide-react';
import { AIServiceManager } from '@/services/ai';
import type { StreamingResponse, GenerationOptions, ProjectComplexity } from '@/services/ai/types';

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  progress: number;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  artifacts?: string[];
  logs?: string[];
}

export interface WorkflowConfig {
  projectType: 'webapp' | 'website' | 'wordpress' | 'fullstack';
  framework: 'react' | 'laravel' | 'vue' | 'angular' | 'nextjs';
  features: string[];
  template?: string;
  customization: Record<string, any>;
}

interface WorkflowEngineProps {
  config: WorkflowConfig;
  onStageUpdate?: (stage: WorkflowStage) => void;
  onComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

const WorkflowEngine: React.FC<WorkflowEngineProps> = ({
  config,
  onStageUpdate,
  onComplete,
  onError
}) => {
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [streamingLogs, setStreamingLogs] = useState<string[]>([]);
  const [realTimeCode, setRealTimeCode] = useState<string>('');
  const [currentAIModel, setCurrentAIModel] = useState<string>('');
  const [aiService] = useState(() => AIServiceManager.getInstance());

  // Initialize workflow stages based on project type and framework
  const initializeStages = useCallback(() => {
    const baseStages: Omit<WorkflowStage, 'status' | 'progress'>[] = [
      {
        id: 'analysis',
        name: 'Project Analysis',
        description: 'Analyzing requirements and generating architecture'
      },
      {
        id: 'setup',
        name: 'Project Setup',
        description: 'Setting up project structure and dependencies'
      },
      {
        id: 'core',
        name: 'Core Generation',
        description: 'Generating core application logic and components'
      },
      {
        id: 'ui',
        name: 'UI Components',
        description: 'Creating user interface components and styling'
      },
      {
        id: 'integration',
        name: 'Feature Integration',
        description: 'Integrating requested features and functionality'
      },
      {
        id: 'optimization',
        name: 'Code Optimization',
        description: 'Optimizing performance and code quality'
      },
      {
        id: 'testing',
        name: 'Testing Setup',
        description: 'Generating tests and quality assurance'
      },
      {
        id: 'deployment',
        name: 'Deployment Prep',
        description: 'Preparing for deployment and building artifacts'
      }
    ];

    // Add framework-specific stages
    if (config.framework === 'laravel') {
      baseStages.splice(2, 0, {
        id: 'database',
        name: 'Database Schema',
        description: 'Creating migrations, models, and relationships'
      });
      baseStages.splice(4, 0, {
        id: 'api',
        name: 'API Development',
        description: 'Building REST API endpoints and controllers'
      });
    }

    if (config.projectType === 'fullstack') {
      baseStages.splice(-1, 0, {
        id: 'sync',
        name: 'Frontend-Backend Sync',
        description: 'Synchronizing frontend and backend components'
      });
    }

    const initializedStages: WorkflowStage[] = baseStages.map(stage => ({
      ...stage,
      status: 'pending',
      progress: 0,
      logs: [],
      artifacts: []
    }));

    setStages(initializedStages);
  }, [config]);

  // Simulate real-time code streaming
  const simulateCodeStreaming = useCallback((stageId: string, content: string[]) => {
    content.forEach((line, index) => {
      setTimeout(() => {
        setStreamingLogs(prev => [...prev, `[${stageId}] ${line}`]);
      }, index * 100);
    });
  }, []);

  // Enhanced executeStage with real AI integration
  const executeStage = useCallback(async (stageIndex: number) => {
    if (stageIndex >= stages.length) return;

    const stage = stages[stageIndex];
    const updatedStage: WorkflowStage = {
      ...stage,
      status: 'running',
      startTime: new Date()
    };

    setStages(prev => prev.map((s, i) => i === stageIndex ? updatedStage : s));
    onStageUpdate?.(updatedStage);

    try {
      // Real AI integration for code generation stages
      if (stage.id === 'core' || stage.id === 'ui' || stage.id === 'integration') {
        await executeAICodeGeneration(stage, stageIndex);
      } else {
        // Keep existing simulation for non-code stages
        await executeRegularStage(stage, stageIndex);
      }
    } catch (error) {
      const failedStage: WorkflowStage = {
        ...updatedStage,
        status: 'failed',
        progress: 0,
        endTime: new Date(),
        logs: [...(updatedStage.logs || []), `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
      
      setStages(prev => prev.map((s, i) => i === stageIndex ? failedStage : s));
      onError?.(error);
    }
  }, [stages, config, aiService]);

  const executeAICodeGeneration = async (stage: WorkflowStage, stageIndex: number) => {
    const generationOptions: GenerationOptions = {
      framework: config.framework,
      projectType: config.projectType,
      complexity: {
        level: config.features.length > 5 ? 'complex' : 'medium',
        estimatedLines: config.features.length * 100,
        frameworks: [config.framework],
        integrations: config.features
      },
      features: config.features,
      streaming: true
    };

    const prompt = generateStagePrompt(stage, config);

    await aiService.streamCodeGeneration(
      {
        prompt,
        options: generationOptions
      },
      (response: StreamingResponse) => {
        setCurrentAIModel(response.modelUsed);
        setRealTimeCode(response.content);
        
        const progressStage: WorkflowStage = {
          ...stage,
          status: 'running',
          progress: response.progress,
          logs: [
            ...(stage.logs || []),
            `[${response.modelUsed}] ${response.stage}`
          ]
        };

        setStages(prev => prev.map((s, i) => i === stageIndex ? progressStage : s));
        onStageUpdate?.(progressStage);

        if (response.isComplete) {
          const completedStage: WorkflowStage = {
            ...progressStage,
            status: 'completed',
            progress: 100,
            endTime: new Date(),
            duration: Date.now() - (stage.startTime?.getTime() || 0),
            artifacts: [`${stage.id}-generated-code.${config.framework === 'laravel' ? 'php' : 'tsx'}`]
          };

          setStages(prev => prev.map((s, i) => i === stageIndex ? completedStage : s));
          onStageUpdate?.(completedStage);

          // Move to next stage
          if (stageIndex < stages.length - 1) {
            setCurrentStageIndex(stageIndex + 1);
          } else {
            setIsRunning(false);
            onComplete?.({
              stages: stages.map((s, i) => i === stageIndex ? completedStage : s),
              totalDuration: Date.now() - (stages[0].startTime?.getTime() || 0),
              artifacts: stages.flatMap(s => s.artifacts || []),
              generatedCode: realTimeCode
            });
          }
        }

        if (response.error) {
          throw new Error(response.error);
        }
      }
    );
  };

  const executeRegularStage = async (stage: WorkflowStage, stageIndex: number) => {
    const stageContent = getStageContent(stage.id, config);
    simulateCodeStreaming(stage.id, stageContent.logs);

    let progress = 0;
    const progressInterval = setInterval(() => {
      if (isPaused) return;
      
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;

      const progressStage: WorkflowStage = {
        ...stage,
        status: 'running',
        progress,
        logs: stageContent.logs.slice(0, Math.floor((progress / 100) * stageContent.logs.length))
      };

      setStages(prev => prev.map((s, i) => i === stageIndex ? progressStage : s));
      onStageUpdate?.(progressStage);

      if (progress >= 100) {
        clearInterval(progressInterval);
        
        const completedStage: WorkflowStage = {
          ...progressStage,
          status: 'completed',
          progress: 100,
          endTime: new Date(),
          duration: Date.now() - (stage.startTime?.getTime() || 0),
          artifacts: stageContent.artifacts
        };

        setStages(prev => prev.map((s, i) => i === stageIndex ? completedStage : s));
        onStageUpdate?.(completedStage);

        // Move to next stage
        if (stageIndex < stages.length - 1) {
          setCurrentStageIndex(stageIndex + 1);
        } else {
          // Workflow complete
          setIsRunning(false);
          onComplete?.({
            stages: stages.map((s, i) => i === stageIndex ? completedStage : s),
            totalDuration: Date.now() - (stages[0].startTime?.getTime() || 0),
            artifacts: stages.flatMap(s => s.artifacts || [])
          });
        }
      }
    }, 200 + Math.random() * 300);

    return () => clearInterval(progressInterval);
  };

  const generateStagePrompt = (stage: WorkflowStage, config: WorkflowConfig): string => {
    const prompts = {
      core: `Generate the core application logic for a ${config.projectType} using ${config.framework}. Include:
- Main application structure
- Core business logic components
- Basic routing and navigation
- State management setup
- Essential services and utilities`,
      
      ui: `Create the user interface components for a ${config.projectType} application. Include:
- Main layout components
- Navigation components
- Form components with validation
- Display components for data
- Responsive design with modern styling`,
      
      integration: `Implement feature integrations for: ${config.features.join(', ')}. Include:
- Feature-specific components
- API integration logic
- Data flow implementation
- Error handling and validation
- Performance optimizations`
    };
    
    return prompts[stage.id as keyof typeof prompts] || `Generate code for ${stage.name} stage`;
  };

  // Start workflow execution
  const startWorkflow = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStageIndex(0);
    setStreamingLogs([]);
    
    // Reset all stages to pending
    setStages(prev => prev.map(stage => ({
      ...stage,
      status: 'pending',
      progress: 0,
      startTime: undefined,
      endTime: undefined,
      duration: undefined
    })));
  }, []);

  // Pause/Resume workflow
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Stop workflow
  const stopWorkflow = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  // Execute stages sequentially
  useEffect(() => {
    if (isRunning && !isPaused && currentStageIndex < stages.length) {
      executeStage(currentStageIndex);
    }
  }, [isRunning, isPaused, currentStageIndex, executeStage]);

  // Calculate global progress
  useEffect(() => {
    const completedStages = stages.filter(s => s.status === 'completed').length;
    const currentProgress = stages[currentStageIndex]?.progress || 0;
    const totalProgress = ((completedStages * 100) + currentProgress) / stages.length;
    setGlobalProgress(totalProgress);
  }, [stages, currentStageIndex]);

  const getStageIcon = (stage: WorkflowStage) => {
    switch (stage.id) {
      case 'analysis': return <Zap className="h-4 w-4" />;
      case 'setup': return <Code className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'core': return <Server className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      case 'ui': return <Smartphone className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStageStatusColor = (status: WorkflowStage['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Workflow Controls with AI Model Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>AI-Powered Workflow Engine</span>
              {currentAIModel && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {currentAIModel}
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              {!isRunning ? (
                <Button onClick={startWorkflow} className="gradient-primary">
                  <Play className="h-4 w-4 mr-2" />
                  Start Generation
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={togglePause}>
                    {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button variant="outline" onClick={stopWorkflow}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(globalProgress)}%</span>
              </div>
              <Progress value={globalProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{config.projectType.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground">Project Type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{config.framework.toUpperCase()}</div>
                <div className="text-sm text-muted-foreground">Framework</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{stages.filter(s => s.status === 'completed').length}/{stages.length}</div>
                <div className="text-sm text-muted-foreground">Stages Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {isRunning ? `${Math.round((Date.now() - (stages[0].startTime?.getTime() || Date.now())) / 1000)}s` : '0s'}
                </div>
                <div className="text-sm text-muted-foreground">Elapsed Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced workflow display with real-time code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generation Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <div className={`p-2 rounded-lg ${getStageStatusColor(stage.status)}`}>
                    {stage.status === 'running' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : stage.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : stage.status === 'failed' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      getStageIcon(stage)
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{stage.name}</span>
                      <Badge variant="outline" className={getStageStatusColor(stage.status)}>
                        {stage.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                    
                    {stage.status === 'running' && (
                      <div className="space-y-1">
                        <Progress value={stage.progress} className="h-1" />
                        <div className="text-xs text-muted-foreground">{Math.round(stage.progress)}% complete</div>
                      </div>
                    )}
                    
                    {stage.duration && (
                      <div className="text-xs text-muted-foreground">
                        Completed in {Math.round(stage.duration / 1000)}s
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Real-time Code Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Real-time AI Code Generation</span>
              <div className="flex items-center space-x-2">
                {currentAIModel && (
                  <Badge variant="secondary">{currentAIModel}</Badge>
                )}
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
              {realTimeCode ? (
                <pre className="whitespace-pre-wrap">{realTimeCode}</pre>
              ) : streamingLogs.length > 0 ? (
                streamingLogs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500">{new Date().toLocaleTimeString()}</span> {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Waiting for AI code generation to start...</div>
              )}
              {isRunning && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">AI is generating code...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to get stage-specific content
const getStageContent = (stageId: string, config: WorkflowConfig) => {
  const baseContent = {
    logs: [
      'Initializing stage...',
      'Loading configuration...',
      'Processing requirements...',
      'Generating code structure...',
      'Applying optimizations...',
      'Stage completed successfully!'
    ],
    artifacts: [`${stageId}-output.json`]
  };

  switch (stageId) {
    case 'analysis':
      return {
        logs: [
          'Analyzing project requirements...',
          `Detected ${config.projectType} project type`,
          `Framework: ${config.framework}`,
          'Generating architecture blueprint...',
          'Creating dependency graph...',
          'Architecture analysis complete!'
        ],
        artifacts: ['architecture.json', 'dependencies.json', 'requirements.md']
      };
    
    case 'setup':
      return {
        logs: [
          'Creating project structure...',
          'Installing dependencies...',
          'Setting up build configuration...',
          'Configuring development environment...',
          'Initializing version control...',
          'Project setup complete!'
        ],
        artifacts: ['package.json', 'tsconfig.json', 'vite.config.ts']
      };
    
    case 'database':
      return {
        logs: [
          'Creating database schema...',
          'Generating migration files...',
          'Building Eloquent models...',
          'Setting up relationships...',
          'Creating seeders...',
          'Database layer complete!'
        ],
        artifacts: ['migrations/', 'models/', 'seeders/']
      };
    
    default:
      return baseContent;
  }
};

export default WorkflowEngine;
