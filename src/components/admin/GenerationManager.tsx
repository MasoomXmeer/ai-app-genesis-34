
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Globe, 
  Smartphone, 
  Code, 
  Download, 
  Play, 
  Pause, 
  RefreshCw,
  Eye,
  Settings,
  Trash2
} from 'lucide-react';

interface GenerationJob {
  id: string;
  type: 'webapp' | 'wordpress' | 'website';
  name: string;
  description: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

const GenerationManager = () => {
  const [jobs, setJobs] = useState<GenerationJob[]>([
    {
      id: '1',
      type: 'webapp',
      name: 'E-commerce Dashboard',
      description: 'React-based admin dashboard for online store',
      status: 'completed',
      progress: 100,
      createdAt: '2024-01-15 14:30',
      completedAt: '2024-01-15 14:45'
    },
    {
      id: '2',
      type: 'wordpress',
      name: 'Contact Form Plugin',
      description: 'WordPress plugin for advanced contact forms',
      status: 'generating',
      progress: 65,
      createdAt: '2024-01-15 15:00'
    },
    {
      id: '3',
      type: 'website',
      name: 'Portfolio Website',
      description: 'Personal portfolio with blog functionality',
      status: 'pending',
      progress: 0,
      createdAt: '2024-01-15 15:30'
    }
  ]);

  const [newJob, setNewJob] = useState({
    type: 'webapp' as const,
    name: '',
    description: '',
    requirements: ''
  });

  const handleCreateJob = () => {
    if (!newJob.name || !newJob.description) return;

    const job: GenerationJob = {
      id: Date.now().toString(),
      type: newJob.type,
      name: newJob.name,
      description: newJob.description,
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setJobs([job, ...jobs]);
    setNewJob({ type: 'webapp', name: '', description: '', requirements: '' });
    
    // Simulate job processing
    setTimeout(() => {
      setJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: 'generating' } : j
      ));
      
      // Simulate progress updates
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { 
              ...j, 
              status: 'completed', 
              progress: 100,
              completedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
            } : j
          ));
        } else {
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, progress: Math.round(progress) } : j
          ));
        }
      }, 1000);
    }, 1000);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const getStatusColor = (status: GenerationJob['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'generating': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: GenerationJob['type']) => {
    switch (type) {
      case 'webapp': return <Smartphone className="h-4 w-4" />;
      case 'wordpress': return <Code className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            AI Generation Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md bg-muted/50">
              <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Create New
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Active Jobs ({jobs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Generation Type
                    </label>
                    <Select value={newJob.type} onValueChange={(value: any) => setNewJob({ ...newJob, type: value })}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webapp">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            Web Application
                          </div>
                        </SelectItem>
                        <SelectItem value="wordpress">
                          <div className="flex items-center">
                            <Code className="h-4 w-4 mr-2" />
                            WordPress Plugin
                          </div>
                        </SelectItem>
                        <SelectItem value="website">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 mr-2" />
                            Static Website
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Project Name
                    </label>
                    <Input 
                      placeholder="Enter project name"
                      value={newJob.name}
                      onChange={(e) => setNewJob({ ...newJob, name: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description
                    </label>
                    <Textarea 
                      placeholder="Describe what you want to build..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="bg-background/50 min-h-20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Detailed Requirements
                    </label>
                    <Textarea 
                      placeholder="Additional requirements, features, styling preferences..."
                      value={newJob.requirements}
                      onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                      className="bg-background/50 min-h-32"
                    />
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <h4 className="font-medium text-foreground">Generation Settings</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Framework:</span>
                        <span className="ml-2 text-foreground">
                          {newJob.type === 'webapp' ? 'React + TypeScript' : 
                           newJob.type === 'wordpress' ? 'PHP + WordPress API' : 
                           'HTML + CSS + JS'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Styling:</span>
                        <span className="ml-2 text-foreground">Tailwind CSS</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AI Model:</span>
                        <span className="ml-2 text-foreground">GPT-4 Turbo</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Time:</span>
                        <span className="ml-2 text-foreground">5-15 minutes</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateJob} 
                    disabled={!newJob.name || !newJob.description}
                    className="w-full gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Generation
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No generation jobs yet</h3>
                  <p className="text-muted-foreground">Create your first AI-powered project to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Card key={job.id} className="bg-muted/30 border-primary/10 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              {getTypeIcon(job.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{job.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Created: {job.createdAt}
                                {job.completedAt && ` • Completed: ${job.completedAt}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status === 'generating' && <RefreshCw className="h-3 w-3 mr-1 animate-spin" />}
                              {job.status}
                            </Badge>
                          </div>
                        </div>

                        {job.status === 'generating' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="text-foreground">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${job.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="border-primary/20">
                              {job.type === 'webapp' ? 'Web App' : 
                               job.type === 'wordpress' ? 'WordPress Plugin' : 
                               'Website'}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            {job.status === 'completed' && (
                              <>
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {job.status === 'generating' && (
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                <Pause className="h-4 w-4" />
                              </Button>
                            )}
                            {job.status === 'pending' && (
                              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteJob(job.id)}
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerationManager;
