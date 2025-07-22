
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { MonacoEditor } from './MonacoEditor';
import { LivePreviewSandbox } from '../preview/LivePreviewSandbox';
import { 
  FileText, 
  Code, 
  Eye, 
  Save, 
  Download, 
  FolderTree,
  Plus,
  Trash2,
  MoreHorizontal,
  Terminal
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
  icon?: React.ReactNode;
  language?: string;
}

interface LiveCodeEditorProps {
  initialFiles?: ProjectFile[];
  framework: 'react' | 'vue' | 'angular' | 'vanilla';
  onSave?: (files: ProjectFile[]) => void;
  onFileChange?: (file: ProjectFile) => void;
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({
  initialFiles = [],
  framework,
  onSave,
  onFileChange
}) => {
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [activeFile, setActiveFile] = useState<string>(initialFiles[0]?.path || '');
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  // Get language from file extension
  const getLanguageFromPath = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'tsx': 'typescript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'js': 'javascript',
      'vue': 'vue',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  // Get file icon based on extension
  const getFileIcon = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, React.ReactNode> = {
      'tsx': <Code className="h-4 w-4 text-blue-500" />,
      'ts': <Code className="h-4 w-4 text-blue-600" />,
      'jsx': <Code className="h-4 w-4 text-yellow-500" />,
      'js': <Code className="h-4 w-4 text-yellow-600" />,
      'vue': <Code className="h-4 w-4 text-green-500" />,
      'html': <FileText className="h-4 w-4 text-orange-500" />,
      'css': <FileText className="h-4 w-4 text-blue-400" />,
      'json': <FileText className="h-4 w-4 text-yellow-400" />,
      'md': <FileText className="h-4 w-4 text-gray-500" />
    };
    return iconMap[ext || ''] || <FileText className="h-4 w-4 text-gray-400" />;
  };

  const activeFileData = files.find(f => f.path === activeFile);

  const handleFileContentChange = useCallback((content: string) => {
    if (!activeFile) return;
    
    setFiles(prev => prev.map(file => 
      file.path === activeFile 
        ? { ...file, content }
        : file
    ));
    
    setUnsavedChanges(prev => new Set([...prev, activeFile]));
    
    const updatedFile = { ...activeFileData!, content };
    onFileChange?.(updatedFile);
  }, [activeFile, activeFileData, onFileChange]);

  const handleSave = useCallback(() => {
    if (!activeFile) return;
    
    setUnsavedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(activeFile);
      return newSet;
    });
    
    onSave?.(files);
    
    toast({
      title: "File saved",
      description: `${activeFile} has been saved successfully`
    });
  }, [activeFile, files, onSave]);

  const createNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;
    
    const newFile: ProjectFile = {
      path: fileName,
      content: '',
      type: 'file',
      language: getLanguageFromPath(fileName)
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFile(fileName);
  };

  const deleteFile = (filePath: string) => {
    if (confirm(`Are you sure you want to delete ${filePath}?`)) {
      setFiles(prev => prev.filter(f => f.path !== filePath));
      if (activeFile === filePath) {
        setActiveFile(files[0]?.path || '');
      }
    }
  };

  // Auto-save effect with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (unsavedChanges.size > 0) {
        handleSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [files, handleSave, unsavedChanges.size]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Live Code Editor</h2>
          <Badge variant="outline">{framework.toUpperCase()}</Badge>
          {unsavedChanges.size > 0 && (
            <Badge variant="secondary">{unsavedChanges.size} unsaved</Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={createNewFile}>
            <Plus className="h-4 w-4 mr-2" />
            New File
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewOpen ? 'Hide' : 'Show'} Preview
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <Card className="h-full rounded-none border-r">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <FolderTree className="h-4 w-4 mr-2" />
                  Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {files.map((file) => (
                    <div
                      key={file.path}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted/50 ${
                        activeFile === file.path ? 'bg-muted' : ''
                      }`}
                      onClick={() => setActiveFile(file.path)}
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getFileIcon(file.path)}
                        <span className="text-sm truncate">{file.path}</span>
                        {unsavedChanges.has(file.path) && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.path);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          {/* Code Editor */}
          <ResizablePanel defaultSize={isPreviewOpen ? 40 : 80}>
            <div className="h-full">
              {activeFileData ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(activeFileData.path)}
                      <span className="text-sm font-medium">{activeFileData.path}</span>
                      <Badge variant="outline" className="text-xs">
                        {getLanguageFromPath(activeFileData.path)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <MonacoEditor
                      value={activeFileData.content}
                      language={getLanguageFromPath(activeFileData.path)}
                      onChange={handleFileContentChange}
                      onSave={handleSave}
                      theme="dark"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">No file selected</h3>
                      <p className="text-sm text-muted-foreground">Select a file from the explorer to start editing</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Live Preview */}
          {isPreviewOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={30}>
                <LivePreviewSandbox
                  files={files}
                  activeFile={activeFile}
                  framework={framework}
                  onError={(error) => {
                    toast({
                      title: "Preview Error",
                      description: error,
                      variant: "destructive"
                    });
                  }}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
