import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import { 
  FileText, 
  Download, 
  Play, 
  Smartphone, 
  Monitor, 
  Tablet,
  Copy,
  Check,
  Zap,
  RefreshCw,
  Settings,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface FileData {
  filename: string;
  code: string;
  language: string;
  type: 'component' | 'style' | 'config' | 'asset';
}

interface CodePreviewProps {
  files: FileData[];
  generationType: 'app' | 'website' | 'wordpress';
  onOptimize: (optimizedCode: string, filename: string) => void;
}

const CodePreview = ({ files, generationType, onOptimize }: CodePreviewProps) => {
  const [activeFile, setActiveFile] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [copied, setCopied] = useState<string>('');
  const [optimizing, setOptimizing] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'files' | 'preview'>('files');
  const isMobile = useIsMobile();

  // Mock files for demonstration
  const mockFiles: FileData[] = files.length > 0 ? files : [
    {
      filename: 'App.tsx',
      code: `import React from 'react';
import { Button } from './components/ui/button';

export default function App() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Your AI-Generated App
        </h1>
        <div className="flex justify-center">
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  );
}`,
      language: 'typescript',
      type: 'component'
    },
    {
      filename: 'styles.css',
      code: `.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: translateY(-2px);
}`,
      language: 'css',
      type: 'style'
    }
  ];

  const currentFiles = mockFiles;

  useEffect(() => {
    if (currentFiles.length > 0 && !activeFile) {
      setActiveFile(currentFiles[0].filename);
    }
  }, [currentFiles, activeFile]);

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx': case 'ts': return 'typescript';
      case 'jsx': case 'js': return 'javascript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'php': return 'php';
      default: return 'text';
    }
  };

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(filename);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleOptimize = async (filename: string) => {
    const file = currentFiles.find(f => f.filename === filename);
    if (!file) return;

    setOptimizing(filename);
    
    // Mock optimization process
    setTimeout(() => {
      const optimizedCode = `// Optimized code for ${filename}\n${file.code}\n\n// Performance improvements applied:\n// - Reduced bundle size\n// - Improved rendering performance\n// - Better memory management`;
      onOptimize(optimizedCode, filename);
      setOptimizing('');
      toast.success('Code optimized successfully');
    }, 2000);
  };

  const getPreviewSize = () => {
    switch (previewDevice) {
      case 'mobile': return 'w-80 h-96';
      case 'tablet': return 'w-96 h-80';
      case 'desktop': return 'w-full h-full';
      default: return 'w-full h-full';
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'files' | 'preview');
  };

  const currentFile = currentFiles.find(f => f.filename === activeFile);

  if (isMobile) {
    return (
      <div className="h-full bg-background">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
          <div className="border-b bg-card/50">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="files" className="flex-1 m-0">
            <div className="h-full flex flex-col">
              {/* File List */}
              <div className="border-b bg-muted/20 p-2">
                <ScrollArea className="w-full">
                  <div className="flex space-x-2">
                    {currentFiles.map((file) => (
                      <Button
                        key={file.filename}
                        variant={activeFile === file.filename ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveFile(file.filename)}
                        className="text-xs whitespace-nowrap"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {file.filename}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Editor */}
              <div className="flex-1">
                {currentFile && (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-2 border-b bg-card/50">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {currentFile.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {currentFile.filename}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(currentFile.code, currentFile.filename)}
                          className="p-1"
                        >
                          {copied === currentFile.filename ? 
                            <Check className="h-3 w-3" /> : 
                            <Copy className="h-3 w-3" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOptimize(currentFile.filename)}
                          disabled={optimizing === currentFile.filename}
                          className="p-1"
                        >
                          {optimizing === currentFile.filename ? 
                            <RefreshCw className="h-3 w-3 animate-spin" /> : 
                            <Zap className="h-3 w-3" />
                          }
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <MonacoEditor
                        value={currentFile.code}
                        language={getLanguageFromFilename(currentFile.filename)}
                        onChange={(value) => {
                          // Handle code changes
                        }}
                        readOnly={false}
                        minimap={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 m-0">
            <div className="h-full flex flex-col">
              <div className="border-b bg-card/50 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewDevice('mobile')}
                      className="p-1"
                    >
                      <Smartphone className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewDevice('tablet')}
                      className="p-1"
                    >
                      <Tablet className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewDevice('desktop')}
                      className="p-1"
                    >
                      <Monitor className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 p-4 bg-muted/20 flex items-center justify-center">
                <div className={`${getPreviewSize()} bg-white border rounded-lg shadow-sm flex items-center justify-center`}>
                  <div className="text-center p-4">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Live Preview</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your {generationType} preview will appear here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-semibold">Code Preview</h3>
            <Badge variant="outline" className="capitalize">
              {generationType}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r bg-muted/20">
          <div className="p-4 border-b">
            <h4 className="font-medium text-sm">Project Files</h4>
          </div>
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {currentFiles.map((file) => (
                <Button
                  key={file.filename}
                  variant={activeFile === file.filename ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFile(file.filename)}
                  className="w-full justify-start text-xs"
                >
                  <FileText className="h-3 w-3 mr-2" />
                  {file.filename}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <div className="border-b bg-card/50">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">Code Editor</TabsTrigger>
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="flex-1 m-0">
              {currentFile && (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b bg-card/50">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{currentFile.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {currentFile.filename}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(currentFile.code, currentFile.filename)}
                      >
                        {copied === currentFile.filename ? 
                          <Check className="h-4 w-4 mr-2" /> : 
                          <Copy className="h-4 w-4 mr-2" />
                        }
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOptimize(currentFile.filename)}
                        disabled={optimizing === currentFile.filename}
                      >
                        {optimizing === currentFile.filename ? 
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : 
                          <Zap className="h-4 w-4 mr-2" />
                        }
                        Optimize
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <MonacoEditor
                      value={currentFile.code}
                      language={getLanguageFromFilename(currentFile.filename)}
                      onChange={(value) => {
                        // Handle code changes
                      }}
                      readOnly={false}
                      minimap={false}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="border-b bg-card/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewDevice('mobile')}
                      >
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile
                      </Button>
                      <Button
                        variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewDevice('tablet')}
                      >
                        <Tablet className="h-4 w-4 mr-2" />
                        Tablet
                      </Button>
                      <Button
                        variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPreviewDevice('desktop')}
                      >
                        <Monitor className="h-4 w-4 mr-2" />
                        Desktop
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Run
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 p-6 bg-muted/20 flex items-center justify-center">
                  <div className={`${getPreviewSize()} bg-white border rounded-lg shadow-lg flex items-center justify-center`}>
                    <div className="text-center p-8">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h4 className="font-medium mb-2">Live Preview</h4>
                      <p className="text-sm text-muted-foreground">
                        Your {generationType} preview will appear here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
