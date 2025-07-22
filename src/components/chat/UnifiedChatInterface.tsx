
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Send,
  Bot,
  User,
  Zap,
  Bug,
  Code2,
  FileText,
  Settings,
  Download,
  Upload,
  Trash2,
  Brain,
  History,
  Tool
} from 'lucide-react';
import { UnifiedChatService, ChatMessage, ToolType } from '@/services/chat/UnifiedChatService';
import { SmartDebugger } from '@/components/ai/SmartDebugger';
import { CodeOptimizer } from '@/components/ai/CodeOptimizer';
import { MultiFileGenerator } from '@/components/ai/MultiFileGenerator';
import { toast } from '@/hooks/use-toast';

interface UnifiedChatInterfaceProps {
  projectId?: string;
  framework?: string;
  projectType?: string;
  onCodeGenerated?: (code: string, files: any[]) => void;
}

export const UnifiedChatInterface: React.FC<UnifiedChatInterfaceProps> = ({
  projectId = 'default-project',
  framework = 'react',
  projectType = 'web-app',
  onCodeGenerated
}) => {
  const [chatService] = useState(() => UnifiedChatService.getInstance());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTool, setCurrentTool] = useState<ToolType | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [projectContext, setProjectContext] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeChat();
  }, [projectId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      await chatService.initializeProject(projectId);
      setMessages(chatService.getMessages());
      setCurrentTool(chatService.getCurrentTool());
      
      // Load project context for admin view
      const context = await chatService.getProjectContext();
      setProjectContext(context);

      toast({
        title: "Chat initialized",
        description: "AI Builder is ready with full project context"
      });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      toast({
        title: "Initialization failed",
        description: "Failed to load project context",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const message = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(message, {
        framework,
        projectType
      });

      setMessages(chatService.getMessages());
      setCurrentTool(chatService.getCurrentTool());

      // Handle code generation callback
      if (response.metadata?.codeGenerated && onCodeGenerated) {
        onCodeGenerated(response.content, response.metadata.filesAffected || []);
      }

      // Update project context
      const updatedContext = await chatService.getProjectContext();
      setProjectContext(updatedContext);

    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolSwitch = async (tool: ToolType) => {
    try {
      await chatService.switchToTool(tool);
      setCurrentTool(tool);
      
      toast({
        title: `Switched to ${tool.toUpperCase()} mode`,
        description: `AI Builder is now optimized for ${tool} operations`
      });
    } catch (error) {
      console.error('Failed to switch tool:', error);
    }
  };

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getToolIcon = (tool?: string) => {
    switch (tool) {
      case 'debug': return <Bug className="h-3 w-3" />;
      case 'optimize': return <Zap className="h-3 w-3" />;
      case 'generate': return <Code2 className="h-3 w-3" />;
      case 'analyze': return <FileText className="h-3 w-3" />;
      case 'refactor': return <Settings className="h-3 w-3" />;
      default: return <Bot className="h-3 w-3" />;
    }
  };

  const getToolColor = (tool?: string) => {
    switch (tool) {
      case 'debug': return 'bg-red-100 text-red-800 border-red-200';
      case 'optimize': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'generate': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyze': return 'bg-green-100 text-green-800 border-green-200';
      case 'refactor': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const exportConversation = async () => {
    try {
      const exported = await chatService.exportConversation();
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${projectId}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Conversation exported",
        description: "Chat history and context saved successfully"
      });
    } catch (error) {
      console.error('Failed to export conversation:', error);
      toast({
        title: "Export failed",
        description: "Failed to export conversation",
        variant: "destructive"
      });
    }
  };

  const clearConversation = async () => {
    try {
      await chatService.clearConversation();
      setMessages([]);
      setCurrentTool(null);
      
      toast({
        title: "Conversation cleared",
        description: "Chat history and context reset"
      });
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Builder</h3>
            </div>
            
            {currentTool && (
              <Badge className={getToolColor(currentTool)}>
                {getToolIcon(currentTool)}
                <span className="ml-1">{currentTool.toUpperCase()} Mode</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowContext(!showContext)}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportConversation}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Tool Buttons */}
        <div className="flex items-center space-x-2 mt-3">
          <span className="text-sm text-muted-foreground">Quick Tools:</span>
          {(['debug', 'optimize', 'generate', 'analyze', 'refactor'] as ToolType[]).map(tool => (
            <Button
              key={tool}
              variant={currentTool === tool ? "default" : "outline"}
              size="sm"
              onClick={() => handleToolSwitch(tool)}
              className="text-xs"
            >
              {getToolIcon(tool)}
              <span className="ml-1 hidden sm:inline">{tool}</span>
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={showContext ? "context" : "chat"} onValueChange={(value) => setShowContext(value === "context")} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="context">Project Context</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-0">
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Welcome to AI Builder</h3>
                  <p className="text-muted-foreground mb-4">
                    I'm your intelligent development assistant with persistent project memory.
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickCommand("/generate a React component")}
                    >
                      Generate Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickCommand("/debug my application")}
                    >
                      Debug Issues
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickCommand("/optimize performance")}
                    >
                      Optimize Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickCommand("/analyze my codebase")}
                    >
                      Analyze Project
                    </Button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'ml-4' : 'mr-4'}`}>
                      <Card className={`p-3 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : message.role === 'system'
                          ? 'bg-muted border-muted-foreground/20'
                          : 'bg-card'
                      }`}>
                        <div className="flex items-center space-x-2 mb-2">
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : message.role === 'system' ? (
                            <Tool className="h-4 w-4" />
                          ) : (
                            getToolIcon(message.tool)
                          )}
                          <span className="text-sm font-medium">
                            {message.role === 'user' ? 'You' : 
                             message.role === 'system' ? 'System' : 
                             message.tool ? `AI (${message.tool})` : 'AI Builder'}
                          </span>
                          {message.tool && (
                            <Badge variant="secondary" className="text-xs">
                              {message.tool}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm">
                          <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                        </div>
                        {message.metadata && (
                          <div className="flex items-center space-x-2 mt-2 text-xs opacity-70">
                            {message.metadata.codeGenerated && (
                              <Badge variant="outline" className="text-xs">Code Generated</Badge>
                            )}
                            {message.metadata.errorFixed && (
                              <Badge variant="outline" className="text-xs">Error Fixed</Badge>
                            )}
                            {message.metadata.optimizationApplied && (
                              <Badge variant="outline" className="text-xs">Optimized</Badge>
                            )}
                          </div>
                        )}
                      </Card>
                      <div className="text-xs text-muted-foreground mt-1 px-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] mr-4">
                    <Card className="p-3 bg-card">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">AI Builder is thinking...</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentTool 
                    ? `Ask about ${currentTool} or use /command...` 
                    : "Ask me anything about your project or use /command..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Commands: /debug, /optimize, /generate, /analyze, /refactor
            </div>
          </div>
        </TabsContent>

        <TabsContent value="context" className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Project Context</h3>
              <p className="text-muted-foreground text-sm">
                Hidden cache system maintaining AI continuity
              </p>
            </div>

            {projectContext && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Project State</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Project ID:</strong> {projectContext.state?.projectId}</p>
                    <p><strong>User Intent:</strong> {projectContext.state?.aiMemory?.userIntent || 'None'}</p>
                    <p><strong>Active Components:</strong> {projectContext.state?.activeContext?.activeComponents?.length || 0}</p>
                    <p><strong>Pending Tasks:</strong> {projectContext.state?.activeContext?.pendingTasks?.length || 0}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Code Structure</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Functions:</strong> {Object.keys(projectContext.structure?.functions || {}).length}</p>
                    <p><strong>Components:</strong> {Object.keys(projectContext.structure?.components || {}).length}</p>
                    <p><strong>Variables:</strong> {Object.keys(projectContext.structure?.variables || {}).length}</p>
                    <p><strong>Files:</strong> {Object.keys(projectContext.structure?.imports || {}).length}</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Generation History</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Total Attempts:</strong> {projectContext.history?.attempts?.length || 0}</p>
                    <p><strong>Success Rate:</strong> {
                      projectContext.history?.attempts?.length > 0 
                        ? Math.round((projectContext.history.attempts.filter((a: any) => a.success).length / projectContext.history.attempts.length) * 100)
                        : 0
                    }%</p>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">User Preferences</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Functions:</strong> {projectContext.preferences?.namingConventions?.functions}</p>
                    <p><strong>State Management:</strong> {projectContext.preferences?.codingPatterns?.preferredStateManagement}</p>
                    <p><strong>Styling:</strong> {projectContext.preferences?.codingPatterns?.styling}</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
