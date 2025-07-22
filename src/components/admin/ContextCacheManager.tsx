
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Eye,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Brain,
  Code,
  MessageSquare,
  TrendingUp,
  User,
  Bug,
  FileText
} from 'lucide-react';
import { ProjectContextManager } from '@/services/cache/ProjectContextManager';
import { DynamicPromptEngine, PromptTemplate } from '@/services/prompt/DynamicPromptEngine';
import { toast } from '@/hooks/use-toast';

export const ContextCacheManager: React.FC = () => {
  const [contextManager] = useState(() => ProjectContextManager.getInstance());
  const [promptEngine] = useState(() => DynamicPromptEngine.getInstance());
  
  const [projectId, setProjectId] = useState('admin-view');
  const [contextData, setContextData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);

  useEffect(() => {
    loadContextData();
    loadPromptTemplates();
  }, [projectId]);

  const loadContextData = async () => {
    setIsLoading(true);
    try {
      contextManager.setProjectId(projectId);
      
      const context = {
        projectState: await contextManager.getProjectState(),
        codeStructure: await contextManager.getCodeStructure(),
        conversationMemory: await contextManager.getConversationMemory(),
        generationHistory: await contextManager.getGenerationHistory(),
        userPreferences: await contextManager.getUserPreferences(),
        errorPatterns: await contextManager.getErrorPatterns(),
        optimizationMap: await contextManager.getOptimizationMap()
      };
      
      setContextData(context);
    } catch (error) {
      console.error('Failed to load context data:', error);
      toast({
        title: "Failed to load context",
        description: "Could not load project context data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPromptTemplates = () => {
    const allTemplates = promptEngine.getAllTemplates();
    setTemplates(allTemplates);
  };

  const handleEditFile = (filename: string, data: any) => {
    setEditingFile(filename);
    setEditContent(JSON.stringify(data, null, 2));
  };

  const handleSaveFile = async () => {
    if (!editingFile) return;
    
    try {
      const parsedData = JSON.parse(editContent);
      
      switch (editingFile) {
        case 'project-state':
          await contextManager.updateProjectState(parsedData);
          break;
        case 'user-preferences':
          await contextManager.updateUserPreferences(parsedData);
          break;
        // Add other file types as needed
      }
      
      await loadContextData();
      setEditingFile(null);
      setEditContent('');
      
      toast({
        title: "File saved",
        description: `${editingFile} updated successfully`
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Invalid JSON format or save error",
        variant: "destructive"
      });
    }
  };

  const exportContext = async () => {
    try {
      const exported = await contextManager.exportProjectContext();
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project-context-${projectId}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Context exported",
        description: "Project context saved to file"
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export context",
        variant: "destructive"
      });
    }
  };

  const importContext = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await contextManager.importProjectContext(content);
        await loadContextData();
        
        toast({
          title: "Context imported",
          description: "Project context restored from file"
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid context file format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const clearContext = async () => {
    try {
      await contextManager.clearProjectContext();
      await loadContextData();
      
      toast({
        title: "Context cleared",
        description: "All project context data removed"
      });
    } catch (error) {
      toast({
        title: "Clear failed",
        description: "Failed to clear context",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (filename: string) => {
    switch (filename) {
      case 'project-state': return <Database className="h-4 w-4" />;
      case 'code-structure': return <Code className="h-4 w-4" />;
      case 'conversation-memory': return <MessageSquare className="h-4 w-4" />;
      case 'generation-history': return <TrendingUp className="h-4 w-4" />;
      case 'user-preferences': return <User className="h-4 w-4" />;
      case 'error-patterns': return <Bug className="h-4 w-4" />;
      case 'optimization-map': return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getHealthStatus = () => {
    if (!contextData) return { status: 'unknown', color: 'bg-gray-500' };
    
    const hasState = contextData.projectState?.projectId;
    const hasStructure = Object.keys(contextData.codeStructure?.functions || {}).length > 0;
    const hasMemory = contextData.conversationMemory?.messages?.length > 0;
    
    if (hasState && hasStructure && hasMemory) {
      return { status: 'healthy', color: 'bg-green-500' };
    } else if (hasState) {
      return { status: 'partial', color: 'bg-yellow-500' };
    } else {
      return { status: 'empty', color: 'bg-red-500' };
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Context Cache Manager
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${healthStatus.color}`}></div>
                <span className="text-sm text-muted-foreground">
                  {healthStatus.status}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={loadContextData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Project ID Input */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="project-id" className="w-20">Project ID:</Label>
              <Input
                id="project-id"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Enter project ID to manage"
                className="flex-1"
              />
              <Button onClick={loadContextData} disabled={isLoading}>
                Load
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button onClick={exportContext} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" asChild>
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importContext}
                    className="hidden"
                  />
                </label>
              </Button>
              <Button onClick={clearContext} variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingFile && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Editing: {editingFile}</CardTitle>
              <div className="space-x-2">
                <Button onClick={handleSaveFile} variant="default">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={() => setEditingFile(null)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-64 font-mono text-sm"
              placeholder="JSON content..."
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="cache-files">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cache-files">Cache Files</TabsTrigger>
          <TabsTrigger value="prompt-templates">Prompt Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="cache-files" className="space-y-4">
          {contextData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(contextData).map(([filename, data]) => (
                <Card key={filename} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(filename)}
                      <h4 className="font-medium">{filename}</h4>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFile(filename, data)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log(data)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {filename === 'project-state' && (
                      <>
                        <p><strong>Project:</strong> {(data as any)?.projectId}</p>
                        <p><strong>Last Interaction:</strong> {new Date((data as any)?.lastAIInteraction).toLocaleDateString()}</p>
                        <p><strong>User Intent:</strong> {(data as any)?.aiMemory?.userIntent || 'None'}</p>
                        <p><strong>Active Files:</strong> {(data as any)?.activeContext?.currentFiles?.length || 0}</p>
                      </>
                    )}

                    {filename === 'code-structure' && (
                      <>
                        <p><strong>Functions:</strong> {Object.keys((data as any)?.functions || {}).length}</p>
                        <p><strong>Components:</strong> {Object.keys((data as any)?.components || {}).length}</p>
                        <p><strong>Variables:</strong> {Object.keys((data as any)?.variables || {}).length}</p>
                        <p><strong>Import Files:</strong> {Object.keys((data as any)?.imports || {}).length}</p>
                      </>
                    )}

                    {filename === 'conversation-memory' && (
                      <>
                        <p><strong>Messages:</strong> {(data as any)?.messages?.length || 0}</p>
                        <p><strong>Token Count:</strong> {(data as any)?.tokenCount || 0}</p>
                        <p><strong>Last Compression:</strong> {(data as any)?.lastCompression ? new Date((data as any).lastCompression).toLocaleDateString() : 'Never'}</p>
                      </>
                    )}

                    {filename === 'generation-history' && (
                      <>
                        <p><strong>Total Attempts:</strong> {(data as any)?.attempts?.length || 0}</p>
                        <p><strong>Success Rate:</strong> {
                          (data as any)?.attempts?.length > 0
                            ? Math.round(((data as any).attempts.filter((a: any) => a.success).length / (data as any).attempts.length) * 100)
                            : 0
                        }%</p>
                      </>
                    )}

                    {filename === 'user-preferences' && (
                      <>
                        <p><strong>Functions:</strong> {(data as any)?.namingConventions?.functions}</p>
                        <p><strong>State Mgmt:</strong> {(data as any)?.codingPatterns?.preferredStateManagement}</p>
                        <p><strong>Styling:</strong> {(data as any)?.codingPatterns?.styling}</p>
                      </>
                    )}

                    {filename === 'error-patterns' && (
                      <>
                        <p><strong>Common Errors:</strong> {(data as any)?.commonErrors?.length || 0}</p>
                        <p><strong>Prevention Rules:</strong> {(data as any)?.preventionRules?.length || 0}</p>
                        <p><strong>Active Rules:</strong> {(data as any)?.preventionRules?.filter((r: any) => r.active)?.length || 0}</p>
                      </>
                    )}

                    {filename === 'optimization-map' && (
                      <>
                        <p><strong>Performance Issues:</strong> {(data as any)?.performanceIssues?.length || 0}</p>
                        <p><strong>Applied Optimizations:</strong> {(data as any)?.appliedOptimizations?.length || 0}</p>
                      </>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      Size: {JSON.stringify(data).length} bytes
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Load a project to view cache files</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="prompt-templates" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge variant="outline">v{template.version}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Used {template.metadata.usage} times
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Effectiveness: {Math.round(template.metadata.effectiveness * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Modified: {new Date(template.metadata.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <ScrollArea className="h-32 bg-muted/30 rounded p-2 mb-3">
                  <pre className="text-xs whitespace-pre-wrap">
                    {template.template.substring(0, 500)}
                    {template.template.length > 500 ? '...' : ''}
                  </pre>
                </ScrollArea>

                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {contextData?.generationHistory?.attempts?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Generations</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {contextData?.conversationMemory?.messages?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(contextData?.codeStructure?.components || {}).length}
              </div>
              <div className="text-sm text-muted-foreground">Components Generated</div>
            </Card>
          </div>

          {contextData?.errorPatterns?.commonErrors && (
            <Card className="p-4">
              <h4 className="font-medium mb-3">Common Error Patterns</h4>
              <div className="space-y-2">
                {contextData.errorPatterns.commonErrors.slice(0, 5).map((error: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm truncate">{error.pattern}</span>
                    <Badge variant="outline">{error.frequency}x</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
