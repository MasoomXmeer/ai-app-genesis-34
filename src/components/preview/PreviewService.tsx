
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Sparkles, 
  Target, 
  ExternalLink, 
  Globe, 
  Smartphone, 
  Server,
  Code,
  Database,
  Shield
} from 'lucide-react';

interface PreviewServiceProps {
  isGenerating: boolean;
  isPreviewLoading: boolean;
  selectedTemplate: any;
  selectedFramework: string;
  previewUrl: string;
  onGenerate: () => void;
}

export const PreviewService: React.FC<PreviewServiceProps> = ({
  isGenerating,
  isPreviewLoading,
  selectedTemplate,
  selectedFramework,
  previewUrl,
  onGenerate
}) => {
  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case 'laravel': return <Server className="h-6 w-6" />;
      case 'react': return <Code className="h-6 w-6" />;
      case 'vue': return <Globe className="h-6 w-6" />;
      case 'angular': return <Shield className="h-6 w-6" />;
      case 'nextjs': return <Database className="h-6 w-6" />;
      default: return <Code className="h-6 w-6" />;
    }
  };

  const getFrameworkColor = (framework: string) => {
    switch (framework) {
      case 'laravel': return 'border-red-200 bg-red-50 text-red-700';
      case 'react': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'vue': return 'border-green-200 bg-green-50 text-green-700';
      case 'angular': return 'border-purple-200 bg-purple-50 text-purple-700';
      case 'nextjs': return 'border-gray-200 bg-gray-50 text-gray-700';
      default: return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  };

  if (previewUrl && !isPreviewLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg border ${getFrameworkColor(selectedFramework)}`}>
              {getFrameworkIcon(selectedFramework)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Live Preview Ready</h3>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate?.name || 'Custom Application'} - {selectedFramework.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
              ✓ Generated
            </Badge>
            <Button variant="outline" size="sm" onClick={() => window.open(previewUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
        
        <div className="flex-1 bg-background rounded-lg border border-border overflow-hidden">
          <iframe 
            src={previewUrl}
            className="w-full h-full border-none"
            title="Application Preview"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
          />
        </div>
      </div>
    );
  }

  if (isGenerating || isPreviewLoading) {
    return (
      <div className="bg-muted rounded-lg h-[600px] lg:h-full min-h-[600px] flex items-center justify-center border border-border">
        <div className="text-center space-y-6">
          <div className="relative">
            <RefreshCw className="h-20 w-20 text-primary animate-spin mx-auto" />
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              {isPreviewLoading ? 'Deploying Preview...' : 'Generating Your Application'}
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {isPreviewLoading 
                ? `Creating live preview environment for your ${selectedFramework.toUpperCase()} application`
                : `Our AI is creating a professional, production-ready ${selectedFramework.toUpperCase()} application based on your requirements`
              }
            </p>
            {selectedTemplate && (
              <div className="mt-4">
                <Badge variant="outline" className={getFrameworkColor(selectedFramework)}>
                  {selectedTemplate.name} - {selectedFramework.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedTemplate) {
    return (
      <div className="bg-muted rounded-lg h-[600px] lg:h-full min-h-[600px] flex items-center justify-center border border-border">
        <div className="text-center space-y-6 max-w-2xl mx-auto p-8">
          <div className={`p-6 rounded-lg border ${getFrameworkColor(selectedFramework)} inline-block`}>
            {getFrameworkIcon(selectedFramework)}
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">{selectedTemplate.name}</h3>
            <p className="text-muted-foreground">{selectedTemplate.description}</p>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Key Features:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedTemplate.features.slice(0, 6).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {selectedTemplate.features.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedTemplate.features.length - 6} more features
                  </Badge>
                )}
              </div>
            </div>

            {selectedFramework === 'laravel' && selectedTemplate.laravelFeatures && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Laravel-Specific Features:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedTemplate.laravelFeatures.slice(0, 4).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {selectedTemplate.laravelFeatures.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedTemplate.laravelFeatures.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Button onClick={onGenerate} className="gradient-primary" size="lg">
            <Sparkles className="h-5 w-5 mr-2" />
            Generate {selectedFramework.toUpperCase()} Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg h-[600px] lg:h-full min-h-[600px] flex items-center justify-center border border-border">
      <div className="text-center space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <Server className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-700">Laravel Apps</p>
            <p className="text-xs text-red-600">Full-stack PHP applications</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-700">React Apps</p>
            <p className="text-xs text-blue-600">Modern web applications</p>
          </div>
        </div>
        
        <Sparkles className="h-16 w-16 text-muted-foreground/50 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Ready to Build</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select a framework and template, or describe your requirements to generate a professional application with live preview
          </p>
        </div>
      </div>
    </div>
  );
};
