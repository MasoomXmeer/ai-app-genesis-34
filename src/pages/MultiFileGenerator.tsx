import React, { useState } from 'react';
import { MultiFileGenerator as MultiFileGeneratorComponent } from '@/components/ai/MultiFileGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderTree, Folder, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectFile {
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  icon: React.ReactNode;
}

const MultiFileGenerator = () => {
  const [projectName, setProjectName] = useState('my-awesome-app');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState('react');
  const [projectType, setProjectType] = useState('webapp');

  const handleProjectGenerated = (files: ProjectFile[]) => {
    toast.success(`Generated project with ${files.filter(f => f.type === 'file').length} files!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Multi-File Project Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Generate complete project structures with realistic folder organization and production-ready code
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="h-5 w-5" />
                Project Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Framework</Label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React + TypeScript</SelectItem>
                      <SelectItem value="vue">Vue.js + TypeScript</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="laravel">Laravel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Project Type</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webapp">Web Application</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="my-awesome-app"
                />
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You'll Get</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Folder className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Proper Structure</h4>
                    <p className="text-sm text-muted-foreground">
                      Industry-standard folder organization with src/, components/, pages/, utils/
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Configuration Files</h4>
                    <p className="text-sm text-muted-foreground">
                      TypeScript, ESLint, Vite/Webpack configs, package.json with proper dependencies
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-green-500 rounded mt-0.5" />
                  <div>
                    <h4 className="font-medium">Ready Components</h4>
                    <p className="text-sm text-muted-foreground">
                      Pre-built UI components, layouts, and reusable utilities
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-purple-500 rounded mt-0.5" />
                  <div>
                    <h4 className="font-medium">Best Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Error boundaries, proper TypeScript types, accessibility considerations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <MultiFileGeneratorComponent 
          projectType={projectType}
          framework={framework}
          requirements={description}
          onProjectGenerated={handleProjectGenerated}
        />
      </div>
    </div>
  );
};

export default MultiFileGenerator;