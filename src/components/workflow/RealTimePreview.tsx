
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveCodeEditor } from '@/components/editor/LiveCodeEditor';
import { 
  Monitor, 
  Code, 
  Eye, 
  RefreshCw, 
  Play,
  Pause,
  Settings,
  Zap,
  Globe,
  Server,
  Database
} from 'lucide-react';

interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

interface PreviewEnvironment {
  id: string;
  name: string;
  framework: 'react' | 'vue' | 'angular' | 'laravel' | 'vanilla';
  status: 'building' | 'ready' | 'error' | 'updating';
  files: ProjectFile[];
}

const RealTimePreview: React.FC = () => {
  const [environments, setEnvironments] = useState<PreviewEnvironment[]>([]);
  const [activeEnvironment, setActiveEnvironment] = useState<string>('react-app');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Initialize sample environments
  useEffect(() => {
    const sampleFiles: ProjectFile[] = [
      {
        path: 'src/App.tsx',
        content: `import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome to Live Preview!
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Counter Example</h2>
          <p className="text-gray-600 mb-6">Click the button to see live updates!</p>
          
          <div className="space-y-4">
            <div className="text-3xl font-bold text-blue-600">
              Count: {count}
            </div>
            
            <div className="space-x-4">
              <button 
                onClick={() => setCount(count + 1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Increment
              </button>
              
              <button 
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Decrement
              </button>
              
              <button 
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Edit the code in the editor to see changes in real-time!
        </div>
      </div>
    </div>
  );
}

export default App;`,
        type: 'file'
      },
      {
        path: 'src/main.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        type: 'file'
      },
      {
        path: 'package.json',
        content: `{
  "name": "live-preview-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.3.0"
  }
}`,
        type: 'file'
      }
    ];

    const initialEnvironments: PreviewEnvironment[] = [
      {
        id: 'react-app',
        name: 'React Application',
        framework: 'react',
        status: 'ready',
        files: sampleFiles
      },
      {
        id: 'vue-app',
        name: 'Vue Application',
        framework: 'vue',
        status: 'ready',
        files: [
          {
            path: 'src/App.vue',
            content: `<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
    <div class="max-w-2xl mx-auto text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Vue Live Preview</h1>
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-4">{{ message }}</h2>
        <button 
          @click="updateMessage"
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Update Message
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello from Vue!'
    };
  },
  methods: {
    updateMessage() {
      this.message = \`Updated at \${new Date().toLocaleTimeString()}\`;
    }
  }
};
</script>`,
            type: 'file'
          }
        ]
      }
    ];

    setEnvironments(initialEnvironments);
  }, []);

  const activeEnv = environments.find(env => env.id === activeEnvironment);

  const handleFileSave = (files: ProjectFile[]) => {
    setEnvironments(prev => prev.map(env => 
      env.id === activeEnvironment 
        ? { ...env, files, status: 'updating' }
        : env
    ));

    // Simulate build process
    setTimeout(() => {
      setEnvironments(prev => prev.map(env => 
        env.id === activeEnvironment 
          ? { ...env, status: 'ready' }
          : env
      ));
    }, 1000);
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case 'react': return <Code className="h-4 w-4" />;
      case 'vue': return <Globe className="h-4 w-4" />;
      case 'angular': return <Zap className="h-4 w-4" />;
      case 'laravel': return <Server className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'building': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'updating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="h-screen bg-background">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5 text-primary" />
              <span>Live Development Environment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600">
                Live
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setIsAutoRefresh(!isAutoRefresh)}>
                {isAutoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 h-full">
          <Tabs value={activeEnvironment} onValueChange={setActiveEnvironment} className="h-full">
            <div className="border-b">
              <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                {environments.map((env) => (
                  <TabsTrigger 
                    key={env.id} 
                    value={env.id}
                    className="flex items-center space-x-2 h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    {getFrameworkIcon(env.framework)}
                    <span>{env.name}</span>
                    <Badge variant="outline" className={getStatusColor(env.status)}>
                      {env.status === 'updating' && <RefreshCw className="h-3 w-3 animate-spin mr-1" />}
                      {env.status}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {environments.map((env) => (
              <TabsContent key={env.id} value={env.id} className="h-full m-0">
                <LiveCodeEditor
                  initialFiles={env.files}
                  framework={env.framework as any}
                  onSave={handleFileSave}
                  onFileChange={(file) => {
                    // Handle individual file changes for real-time updates
                    if (isAutoRefresh) {
                      setEnvironments(prev => prev.map(e => 
                        e.id === env.id 
                          ? { 
                              ...e, 
                              files: e.files.map(f => f.path === file.path ? file : f),
                              status: 'updating'
                            }
                          : e
                      ));
                    }
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimePreview;
