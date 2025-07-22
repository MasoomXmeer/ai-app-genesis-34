import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FolderTree,
  FileText, 
  Download, 
  Folder,
  Code,
  Package,
  Settings,
  Database,
  Globe
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FileEditor } from './FileEditor';
import { InteractiveFileTree } from './InteractiveFileTree';
import { generateZip, downloadFile } from '@/utils/zipGenerator';

interface ProjectFile {
  path: string;
  type: 'file' | 'directory';
  content?: string;
  size?: string;
  icon: React.ReactNode;
}

interface MultiFileGeneratorProps {
  projectType?: string;
  framework?: string;
  requirements?: string;
  onProjectGenerated?: (files: ProjectFile[]) => void;
}

export const MultiFileGenerator: React.FC<MultiFileGeneratorProps> = ({
  projectType = 'webapp',
  framework = 'react',
  requirements = '',
  onProjectGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<ProjectFile[]>([]);
  const [projectName, setProjectName] = useState('my-app');
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const generateProject = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedFiles([]);

    try {
      const stages = [
        'Creating project structure...',
        'Generating core files...',
        'Setting up components...',
        'Creating utilities...',
        'Adding configuration...',
        'Generating documentation...',
        'Finalizing project...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(stages[i]);
        setProgress(Math.round(((i + 1) / stages.length) * 100));
        
        const stageFiles = generateStageFiles(i, framework, projectType);
        setGeneratedFiles(prev => [...prev, ...stageFiles]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const allFiles = generateCompleteProject(framework, projectType, projectName);
      setGeneratedFiles(allFiles);
      if (onProjectGenerated) {
        onProjectGenerated(allFiles);
      }

      toast({
        title: "Project generated successfully",
        description: `Created ${allFiles.filter(f => f.type === 'file').length} files`
      });

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate project files",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateStageFiles = (stage: number, framework: string, projectType: string): ProjectFile[] => {
    const allFiles = generateCompleteProject(framework, projectType, projectName);
    const filesPerStage = Math.ceil(allFiles.length / 7);
    const startIndex = stage * filesPerStage;
    const endIndex = Math.min(startIndex + filesPerStage, allFiles.length);
    
    return allFiles.slice(startIndex, endIndex);
  };

  const generateCompleteProject = (framework: string, projectType: string, name: string): ProjectFile[] => {
    if (framework === 'react') {
      return generateReactProject(name, projectType);
    } else if (framework === 'laravel') {
      return generateLaravelProject(name, projectType);
    } else if (framework === 'vue') {
      return generateVueProject(name, projectType);
    }
    return [];
  };

  const handleFileClick = (file: ProjectFile) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  const handleFileSave = (updatedFile: ProjectFile) => {
    setGeneratedFiles(prev => 
      prev.map(f => f.path === updatedFile.path ? updatedFile : f)
    );
  };

  const handleFileDelete = (file: ProjectFile) => {
    setGeneratedFiles(prev => prev.filter(f => f.path !== file.path));
    toast({
      title: "File deleted",
      description: `${file.path} has been removed`
    });
  };

  const handleNewFile = (parentPath: string) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const newFile: ProjectFile = {
        path: `${parentPath}${fileName}`,
        type: 'file',
        content: '// New file',
        size: '0.1KB',
        icon: <FileText className="h-4 w-4 text-blue-600" />
      };
      setGeneratedFiles(prev => [...prev, newFile]);
      toast({
        title: "File created",
        description: `${newFile.path} has been added`
      });
    }
  };

  const downloadProject = async () => {
    if (generatedFiles.length === 0) {
      toast({
        title: "No files to download",
        description: "Generate a project first",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);

    try {
      const zipBlob = await generateZip(generatedFiles, projectName);
      const fileName = `${projectName}.zip`;
      downloadFile(zipBlob, fileName);

      toast({
        title: "Download started",
        description: `${fileName} is being downloaded`
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to create project archive",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const generateReactProject = (name: string, projectType: string): ProjectFile[] => {
    return [
      // Root files
      { path: 'package.json', type: 'file', icon: <Package className="h-4 w-4 text-green-600" />, size: '1.2KB', content: generatePackageJson(name) },
      { path: 'README.md', type: 'file', icon: <FileText className="h-4 w-4 text-blue-600" />, size: '0.8KB', content: generateReadme(name, projectType) },
      { path: 'tsconfig.json', type: 'file', icon: <Settings className="h-4 w-4 text-blue-700" />, size: '0.5KB', content: generateTsConfig() },
      { path: 'tailwind.config.ts', type: 'file', icon: <Settings className="h-4 w-4 text-cyan-500" />, size: '0.3KB', content: generateTailwindConfig() },
      { path: 'vite.config.ts', type: 'file', icon: <Settings className="h-4 w-4 text-purple-600" />, size: '0.4KB', content: generateViteConfig() },
      
      // Directories
      { path: 'src/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'public/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      
      // Public files
      { path: 'public/index.html', type: 'file', icon: <Globe className="h-4 w-4 text-orange-600" />, size: '0.6KB', content: generateIndexHtml(name) },
      { path: 'public/favicon.ico', type: 'file', icon: <FileText className="h-4 w-4 text-gray-600" />, size: '4.2KB' },
      
      // Source structure
      { path: 'src/main.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '0.3KB', content: generateMainTsx() },
      { path: 'src/App.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '1.1KB', content: generateAppTsx(projectType) },
      { path: 'src/index.css', type: 'file', icon: <FileText className="h-4 w-4 text-purple-500" />, size: '2.1KB', content: generateIndexCss() },
      
      // Components
      { path: 'src/components/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/components/ui/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/components/ui/button.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '2.3KB', content: generateButtonComponent() },
      { path: 'src/components/ui/card.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '1.8KB', content: generateCardComponent() },
      { path: 'src/components/Header.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '1.5KB', content: generateHeaderComponent() },
      { path: 'src/components/Footer.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '0.9KB', content: generateFooterComponent() },
      
      // Pages
      { path: 'src/pages/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/pages/Home.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '2.1KB', content: generateHomePage(projectType) },
      { path: 'src/pages/About.tsx', type: 'file', icon: <Code className="h-4 w-4 text-blue-600" />, size: '1.2KB', content: generateAboutPage() },
      
      // Utilities
      { path: 'src/lib/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/lib/utils.ts', type: 'file', icon: <Code className="h-4 w-4 text-green-600" />, size: '0.8KB', content: generateUtils() },
      { path: 'src/hooks/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/hooks/use-toast.ts', type: 'file', icon: <Code className="h-4 w-4 text-green-600" />, size: '1.3KB', content: generateUseToast() },
      
      // Types
      { path: 'src/types/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/types/index.ts', type: 'file', icon: <Code className="h-4 w-4 text-blue-700" />, size: '0.6KB', content: generateTypes(projectType) }
    ];
  };

  const generateLaravelProject = (name: string, projectType: string): ProjectFile[] => {
    return [
      // Root files
      { path: 'composer.json', type: 'file', icon: <Package className="h-4 w-4 text-orange-600" />, size: '2.1KB', content: generateComposerJson(name) },
      { path: 'README.md', type: 'file', icon: <FileText className="h-4 w-4 text-blue-600" />, size: '1.2KB', content: generateReadme(name, projectType) },
      { path: '.env.example', type: 'file', icon: <Settings className="h-4 w-4 text-gray-600" />, size: '0.8KB', content: generateEnvExample() },
      
      // App structure
      { path: 'app/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'app/Http/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'app/Http/Controllers/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'app/Http/Controllers/Controller.php', type: 'file', icon: <Code className="h-4 w-4 text-purple-600" />, size: '0.4KB', content: generateBaseController() },
      { path: 'app/Http/Controllers/HomeController.php', type: 'file', icon: <Code className="h-4 w-4 text-purple-600" />, size: '1.1KB', content: generateHomeController(projectType) },
      
      // Models
      { path: 'app/Models/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'app/Models/User.php', type: 'file', icon: <Code className="h-4 w-4 text-purple-600" />, size: '1.8KB', content: generateUserModel() },
      
      // Database
      { path: 'database/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'database/migrations/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'database/migrations/2024_01_01_000000_create_users_table.php', type: 'file', icon: <Database className="h-4 w-4 text-green-600" />, size: '1.2KB', content: generateUserMigration() },
      
      // Routes
      { path: 'routes/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'routes/web.php', type: 'file', icon: <Code className="h-4 w-4 text-purple-600" />, size: '0.8KB', content: generateWebRoutes() },
      { path: 'routes/api.php', type: 'file', icon: <Code className="h-4 w-4 text-purple-600" />, size: '0.6KB', content: generateApiRoutes() },
      
      // Resources
      { path: 'resources/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'resources/views/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'resources/views/welcome.blade.php', type: 'file', icon: <Globe className="h-4 w-4 text-orange-600" />, size: '2.3KB', content: generateWelcomeView(projectType) }
    ];
  };

  const generateVueProject = (name: string, projectType: string): ProjectFile[] => {
    return [
      // Root files
      { path: 'package.json', type: 'file', icon: <Package className="h-4 w-4 text-green-600" />, size: '1.3KB', content: generateVuePackageJson(name) },
      { path: 'README.md', type: 'file', icon: <FileText className="h-4 w-4 text-blue-600" />, size: '0.9KB', content: generateReadme(name, projectType) },
      { path: 'vite.config.ts', type: 'file', icon: <Settings className="h-4 w-4 text-purple-600" />, size: '0.5KB', content: generateVueViteConfig() },
      
      // Source structure
      { path: 'src/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/main.ts', type: 'file', icon: <Code className="h-4 w-4 text-green-600" />, size: '0.4KB', content: generateVueMain() },
      { path: 'src/App.vue', type: 'file', icon: <Code className="h-4 w-4 text-green-600" />, size: '1.8KB', content: generateVueApp(projectType) },
      
      // Components
      { path: 'src/components/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'src/components/HelloWorld.vue', type: 'file', icon: <Code className="h-4 w-4 text-green-600" />, size: '1.4KB', content: generateVueHelloWorld() },
      
      // Public
      { path: 'public/', type: 'directory', icon: <Folder className="h-4 w-4 text-yellow-600" /> },
      { path: 'public/index.html', type: 'file', icon: <Globe className="h-4 w-4 text-orange-600" />, size: '0.5KB', content: generateVueIndexHtml(name) }
    ];
  };

  const generatePackageJson = (name: string) => `{
  "name": "${name}",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`;

  const generateReadme = (name: string, projectType: string) => `# ${name}

A modern ${projectType} application built with advanced AI assistance.

## Features

- Modern, responsive design
- TypeScript support
- Optimized performance
- Clean architecture

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

Generated with AI Builder Pro.`;

  const generateTsConfig = () => `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;

  const generateMainTsx = () => `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

  const generateAppTsx = (projectType: string) => `import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App`;

  const generateHomePage = (projectType: string) => `import React from 'react'

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Your ${projectType} App
      </h1>
      <p className="text-lg text-center text-muted-foreground">
        Built with modern technologies and AI assistance
      </p>
    </div>
  )
}

export default Home`;

  const generateHeaderComponent = () => `import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My App</h1>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header`;

  const generateFooterComponent = () => `import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">
          © 2024 My App. Built with AI Builder Pro.
        </p>
      </div>
    </footer>
  )
}

export default Footer`;

  const generateTailwindConfig = () => `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`;

  const generateViteConfig = () => `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;

  const generateIndexHtml = (name: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  const generateIndexCss = () => `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
}

* {
  border-color: hsl(var(--border));
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}`;

  const generateButtonComponent = () => `import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'default', 
  size = 'md',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors'
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground'
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-8'
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}

export default Button`;

  const generateCardComponent = () => `import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
    {...props}
  />
)

export default Card`;

  const generateUtils = () => `import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

  const generateUseToast = () => `import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  return { toast, toasts }
}`;

  const generateTypes = (projectType: string) => `export interface User {
  id: string
  name: string
  email: string
  createdAt: Date
}

export interface ${projectType.charAt(0).toUpperCase() + projectType.slice(1)}Item {
  id: string
  title: string
  description: string
  status: 'active' | 'inactive'
}`;

  const generateAboutPage = () => `import React from 'react'

const About: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="text-lg text-muted-foreground">
        This application was generated using advanced AI technology.
      </p>
    </div>
  )
}

export default About`;

  const generateComposerJson = (name: string) => `{
    "name": "${name.toLowerCase()}",
    "type": "project",
    "description": "Laravel application generated with AI",
    "require": {
        "php": "^8.1",
        "laravel/framework": "^10.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/"
        }
    }
}`;

  const generateEnvExample = () => `APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=`;

  const generateBaseController = () => `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Foundation\\Auth\\Access\\AuthorizesRequests;
use Illuminate\\Foundation\\Validation\\ValidatesRequests;
use Illuminate\\Routing\\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}`;

  const generateHomeController = (projectType: string) => `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class HomeController extends Controller
{
    public function index()
    {
        return view('welcome', [
            'title' => '${projectType} Application',
            'message' => 'Welcome to your Laravel application'
        ]);
    }
}`;

  const generateUserModel = () => `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}`;

  const generateUserMigration = () => `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};`;

  const generateWebRoutes = () => `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\HomeController;

Route::get('/', [HomeController::class, 'index']);`;

  const generateApiRoutes = () => `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});`;

  const generateWelcomeView = (projectType: string) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex items-center justify-center">
        <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-center mb-4">{{ $title }}</h1>
            <p class="text-gray-600 text-center">{{ $message }}</p>
        </div>
    </div>
</body>
</html>`;

  const generateVuePackageJson = (name: string) => `{
  "name": "${name}",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.3.4",
    "typescript": "^5.0.2",
    "vue-tsc": "^1.8.5",
    "vite": "^4.4.5"
  }
}`;

  const generateVueViteConfig = () => `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`;

  const generateVueMain = () => `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`;

  const generateVueApp = (projectType: string) => `<template>
  <div id="app">
    <header class="bg-blue-600 text-white p-4">
      <h1 class="text-2xl font-bold">${projectType} App</h1>
    </header>
    <main class="container mx-auto p-4">
      <HelloWorld msg="Welcome to Vue 3" />
    </main>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>`;

  const generateVueHelloWorld = () => `<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Generated with AI Builder Pro
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 2rem;
}
</style>`;

  const generateVueIndexHtml = (name: string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Multi-File Generator
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadProject}
                disabled={generatedFiles.length === 0 || isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download ZIP'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="my-awesome-app"
            />
          </div>

          <Button 
            onClick={generateProject} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Settings className="h-4 w-4 mr-2 animate-spin" />
                Generating Project...
              </>
            ) : (
              <>
                <FolderTree className="h-4 w-4 mr-2" />
                Generate Complete Project
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                {currentStage}
              </p>
            </div>
          )}

          {generatedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Interactive File Browser</Label>
                <Badge variant="outline">
                  {generatedFiles.filter(f => f.type === 'file').length} files
                </Badge>
              </div>
              <Separator />
              <div className="max-h-96 overflow-auto border rounded-lg p-3">
                <InteractiveFileTree
                  files={generatedFiles}
                  onFileClick={handleFileClick}
                  onFileDelete={handleFileDelete}
                  onNewFile={handleNewFile}
                />
              </div>
            </div>
          )}

          {generatedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {generatedFiles.filter(f => f.type === 'file').length}
                </div>
                <div className="text-sm text-muted-foreground">Files</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {generatedFiles.filter(f => f.type === 'directory').length}
                </div>
                <div className="text-sm text-muted-foreground">Directories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(Math.random() * 500 + 100)}KB
                </div>
                <div className="text-sm text-muted-foreground">Total Size</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFile && (
        <FileEditor
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onSave={handleFileSave}
        />
      )}
    </div>
  );
};
