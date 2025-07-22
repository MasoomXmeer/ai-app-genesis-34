
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X, Bug, Zap, FileText, Code } from 'lucide-react';
import { SmartDebugger } from './SmartDebugger';
import { CodeOptimizer } from './CodeOptimizer';
import { toast } from '@/hooks/use-toast';

interface ProjectFile {
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  icon: React.ReactNode;
}

interface FileEditorProps {
  file: ProjectFile;
  onClose: () => void;
  onSave: (updatedFile: ProjectFile) => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({ file, onClose, onSave }) => {
  const [content, setContent] = useState(file.content || '');
  const [isModified, setIsModified] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsModified(value !== file.content);
  };

  const handleSave = () => {
    const updatedFile = { ...file, content };
    onSave(updatedFile);
    setIsModified(false);
    toast({
      title: "File saved",
      description: `${file.path} has been updated`
    });
  };

  const handleCodeFixed = (fixedCode: string) => {
    setContent(fixedCode);
    setIsModified(true);
  };

  const handleCodeOptimized = (optimizedCode: string) => {
    setContent(optimizedCode);
    setIsModified(true);
  };

  const getFileExtension = (path: string) => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  const getLanguage = (extension: string) => {
    const langMap: Record<string, string> = {
      'tsx': 'typescript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'js': 'javascript',
      'php': 'php',
      'vue': 'vue',
      'css': 'css',
      'html': 'html',
      'json': 'json',
      'md': 'markdown'
    };
    return langMap[extension] || 'text';
  };

  const fileExtension = getFileExtension(file.path);
  const language = getLanguage(fileExtension);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {file.icon}
            <h2 className="text-lg font-semibold">{file.path}</h2>
            <Badge variant="outline">{language}</Badge>
            {isModified && <Badge variant="destructive">Modified</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={!isModified}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Debug
              </TabsTrigger>
              <TabsTrigger value="optimize" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Optimize
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 p-4 overflow-hidden">
              <div className="h-full">
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="h-full font-mono text-sm resize-none"
                  placeholder="Edit your code here..."
                />
              </div>
            </TabsContent>

            <TabsContent value="debug" className="flex-1 p-4 overflow-auto">
              <SmartDebugger
                projectCode={content}
                framework={fileExtension === 'php' ? 'laravel' : 'react'}
                onCodeFixed={handleCodeFixed}
              />
            </TabsContent>

            <TabsContent value="optimize" className="flex-1 p-4 overflow-auto">
              <CodeOptimizer
                projectCode={content}
                framework={fileExtension === 'php' ? 'laravel' : 'react'}
                onCodeOptimized={handleCodeOptimized}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
