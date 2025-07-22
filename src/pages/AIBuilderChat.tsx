
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Settings, 
  Download, 
  Share2,
  Zap,
  Crown,
  Rocket,
  Menu,
  X,
  Brain
} from 'lucide-react';
import { UnifiedChatInterface } from '@/components/chat/UnifiedChatInterface';
import CodePreview from '@/components/chat/CodePreview';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';

const AIBuilderChat = () => {
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [projectId] = useState(() => `project-${Date.now()}`);
  const isMobile = useIsMobile();

  const handleCodeGenerated = (code: string, files: any[]) => {
    console.log('Code generated:', { code, files });
    // Transform to expected format if needed
    const formattedFiles = files.map(file => ({
      filename: file.filename || 'generated.js',
      code: file.code || code,
      type: file.type || 'component',
      language: file.language || 'javascript'
    }));
    setGeneratedFiles(formattedFiles as any);
  };

  const handleCodeOptimized = (optimizedCode: string, filename: string) => {
    console.log('Code optimized:', { optimizedCode, filename });
    setGeneratedFiles(prev => prev.map(file => 
      (file as any).filename === filename 
        ? { ...file, code: optimizedCode }
        : file
    ));
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free': return <Zap className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'pro': return <Crown className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'enterprise': return <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return <Zap className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-500 text-white';
      case 'pro': return 'bg-blue-500 text-white';
      case 'enterprise': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-2 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-sm sm:text-xl font-bold">AI Builder Pro</h1>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Unified
              </Badge>
            </div>
            
            <Separator orientation="vertical" className="h-4 sm:h-6" />
            
            <Badge variant="outline" className={`${getPlanColor(userPlan)} border-0 text-xs sm:text-sm px-1 sm:px-2`}>
              {getPlanIcon(userPlan)}
              <span className="ml-1 capitalize hidden sm:inline">{userPlan} Plan</span>
              <span className="ml-1 capitalize sm:hidden">{userPlan.charAt(0).toUpperCase()}</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Code Preview Toggle */}
            {isMobile && generatedFiles.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCodePreview(!showCodePreview)}
                className="p-1 sm:p-2"
              >
                {showCodePreview ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            )}
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>

            <Button variant="outline" size="sm" className="p-1 sm:p-2">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Layout */}
        {isMobile ? (
          <>
            {/* Chat Interface - Always visible on mobile */}
            <div className={`${showCodePreview ? 'hidden' : 'flex'} w-full`}>
              <UnifiedChatInterface 
                projectId={projectId}
                framework="react"
                projectType="web-app"
                onCodeGenerated={handleCodeGenerated}
              />
            </div>

            {/* Code Preview - Toggle on mobile */}
            {showCodePreview && (
              <div className="w-full">
                {generatedFiles.length > 0 ? (
                  <CodePreview 
                    files={generatedFiles}
                    generationType="app"
                    onOptimize={handleCodeOptimized}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-muted/20 p-4">
                    <div className="text-center max-w-md">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold mb-2">Ready to Build</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Start a conversation to generate your app. Code will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Desktop Layout */
          <>
            {/* Unified Chat Interface */}
            <div className="w-1/2 border-r">
              <UnifiedChatInterface 
                projectId={projectId}
                framework="react"
                projectType="web-app"
                onCodeGenerated={handleCodeGenerated}
              />
            </div>

            {/* Code Preview */}
            <div className="w-1/2">
              {generatedFiles.length > 0 ? (
                <CodePreview 
                  files={generatedFiles}
                  generationType="app"
                  onOptimize={handleCodeOptimized}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/20">
                  <div className="text-center max-w-md">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI Builder Pro Ready</h3>
                    <p className="text-muted-foreground mb-6">
                      Your intelligent development assistant with persistent memory and unified tool integration. 
                      Code will appear here as it's generated.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Context-aware generation</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Unified tool integration</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Persistent project memory</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Enhanced Status Bar */}
      <div className="border-t bg-muted/30 px-2 sm:px-4 py-1 sm:py-2">
        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="hidden sm:inline">Status: AI Ready</span>
            <span className="sm:hidden">Ready</span>
            <span className="hidden sm:inline">•</span>
            <span>Project: {projectId.split('-').pop()}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-primary">Context: Active</span>
            {userPlan === 'enterprise' && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-green-600 text-xs sm:text-sm">Custom API</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm">AI Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBuilderChat;
