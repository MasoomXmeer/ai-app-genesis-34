
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, Monitor, Smartphone, Tablet, RotateCcw, AlertCircle } from 'lucide-react';

interface ProjectFile {
  path: string;
  content: string;
  type: 'file' | 'directory';
}

interface LivePreviewSandboxProps {
  files: ProjectFile[];
  activeFile?: string;
  framework: 'react' | 'vue' | 'angular' | 'vanilla';
  onError?: (error: string) => void;
}

export const LivePreviewSandbox: React.FC<LivePreviewSandboxProps> = ({
  files,
  activeFile,
  framework,
  onError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const getViewportSize = () => {
    const sizes = {
      desktop: { portrait: { width: '100%', height: '100%' }, landscape: { width: '100%', height: '100%' } },
      tablet: { portrait: { width: '768px', height: '1024px' }, landscape: { width: '1024px', height: '768px' } },
      mobile: { portrait: { width: '375px', height: '667px' }, landscape: { width: '667px', height: '375px' } }
    };
    return sizes[deviceMode][orientation];
  };

  const generatePreviewHTML = () => {
    const entryFile = files.find(f => f.path === 'src/App.tsx' || f.path === 'src/main.tsx' || f.path === 'index.html');
    
    if (!entryFile) {
      return `
        <html>
          <body style="font-family: sans-serif; padding: 20px; color: #666;">
            <div style="text-align: center; margin-top: 100px;">
              <h2>No entry file found</h2>
              <p>Please create an App.tsx or index.html file</p>
            </div>
          </body>
        </html>
      `;
    }

    if (framework === 'react') {
      return generateReactPreview();
    } else if (framework === 'vue') {
      return generateVuePreview();
    } else {
      return generateVanillaPreview();
    }
  };

  const generateReactPreview = () => {
    const appFile = files.find(f => f.path === 'src/App.tsx');
    const indexFile = files.find(f => f.path === 'src/main.tsx');
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: system-ui, -apple-system, sans-serif; }
      .error { 
        background: #fee; 
        border: 1px solid #fcc; 
        padding: 20px; 
        margin: 20px; 
        border-radius: 8px; 
        color: #c33;
      }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
      try {
        ${files.map(file => `
          // File: ${file.path}
          ${file.content}
        `).join('\n')}
        
        const App = () => {
          return React.createElement('div', { 
            style: { padding: '20px' } 
          }, 'Hello from Live Preview!');
        };
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
      } catch (error) {
        document.getElementById('root').innerHTML = 
          '<div class="error"><h3>Runtime Error</h3><pre>' + error.message + '</pre></div>';
        console.error('Preview error:', error);
      }
    </script>
</body>
</html>`;
  };

  const generateVuePreview = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Live Preview</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="app">
      <h1 class="text-2xl font-bold text-blue-600">Vue Live Preview</h1>
      <p class="mt-4">{{ message }}</p>
    </div>
    <script>
      const { createApp } = Vue;
      createApp({
        data() {
          return { message: 'Hello from Vue!' };
        }
      }).mount('#app');
    </script>
</body>
</html>`;
  };

  const generateVanillaPreview = () => {
    const htmlFile = files.find(f => f.path.endsWith('.html'));
    return htmlFile?.content || '<html><body><h1>No HTML file found</h1></body></html>';
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const html = generatePreviewHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      iframeRef.current.src = url;
      
      iframeRef.current.onload = () => {
        setIsLoading(false);
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview generation failed');
      setIsLoading(false);
      onError?.(err instanceof Error ? err.message : 'Preview generation failed');
    }
  };

  useEffect(() => {
    updatePreview();
  }, [files, framework]);

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  };

  const viewport = getViewportSize();

  return (
    <div className="h-full flex flex-col bg-muted/50 rounded-lg border">
      {/* Preview Controls */}
      <div className="flex items-center justify-between p-3 border-b bg-background">
        <div className="flex items-center space-x-2">
          <Button
            variant={deviceMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('desktop')}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('tablet')}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={deviceMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDeviceMode('mobile')}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          {deviceMode !== 'desktop' && (
            <Button variant="outline" size="sm" onClick={toggleOrientation}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline">{framework.toUpperCase()}</Badge>
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <Button variant="outline" size="sm" onClick={updatePreview}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(iframeRef.current?.src, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        {error ? (
          <div className="text-center space-y-4 p-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">Preview Error</h3>
              <p className="text-sm text-red-600 dark:text-red-300 mt-2">{error}</p>
            </div>
            <Button variant="outline" onClick={updatePreview}>
              Try Again
            </Button>
          </div>
        ) : (
          <div 
            className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300"
            style={{
              width: viewport.width,
              height: viewport.height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        )}
      </div>
    </div>
  );
};
