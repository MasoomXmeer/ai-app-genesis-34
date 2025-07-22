import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, Code, Download, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VisualToCodeProps {
  onCodeGenerated?: (code: string, framework: string) => void;
}

export const VisualToCode: React.FC<VisualToCodeProps> = ({ onCodeGenerated }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFramework, setSelectedFramework] = useState('react');
  const [generatedCode, setGeneratedCode] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const frameworks = [
    { value: 'react', label: 'React + TypeScript' },
    { value: 'vue', label: 'Vue.js + TypeScript' },
    { value: 'html', label: 'HTML + CSS' },
    { value: 'tailwind', label: 'Tailwind CSS' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate AI vision analysis
      const stages = [
        'Analyzing image structure...',
        'Identifying UI components...',
        'Detecting layout patterns...',
        'Extracting design tokens...',
        'Generating component code...',
        'Optimizing structure...',
        'Finalizing code...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setProgress(Math.round(((i + 1) / stages.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generate code based on framework
      const code = generateCodeFromImage(selectedFramework, additionalContext);
      setGeneratedCode(code);
      
      toast({
        title: "Code generated successfully",
        description: `Generated ${selectedFramework} code from your image`
      });

    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCodeFromImage = (framework: string, context: string): string => {
    // This would use GPT-4o Vision or similar in production
    const contextHint = context ? `// Additional context: ${context}\n\n` : '';
    
    switch (framework) {
      case 'react':
        return `${contextHint}import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GeneratedComponent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold">
            Generated from Image
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Main Content</h3>
              <p className="text-muted-foreground">
                This component was automatically generated from your uploaded image.
                The layout and styling have been optimized for responsiveness.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="default" className="w-full">
                Primary Action
              </Button>
              <Button variant="outline" className="w-full">
                Secondary Action
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneratedComponent;`;

      case 'vue':
        return `${contextHint}<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 class="text-2xl font-bold">Generated from Image</h1>
      </div>
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">Main Content</h3>
            <p class="text-gray-600">
              This component was automatically generated from your uploaded image.
              The layout and styling have been optimized for responsiveness.
            </p>
          </div>
          <div class="flex flex-col gap-3">
            <button @click="handlePrimary" class="btn btn-primary w-full">
              Primary Action
            </button>
            <button @click="handleSecondary" class="btn btn-outline w-full">
              Secondary Action
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const handlePrimary = () => {
  console.log('Primary action clicked');
};

const handleSecondary = () => {
  console.log('Secondary action clicked');
};
</script>`;

      case 'html':
        return `${contextHint}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated from Image</title>
  <style>
    .container { max-width: 1024px; margin: 0 auto; padding: 24px; }
    .card { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 24px; }
    .content { padding: 32px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
    @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
    .btn { padding: 12px 24px; border-radius: 6px; border: none; cursor: pointer; width: 100%; margin-bottom: 12px; }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-outline { background: transparent; border: 2px solid #3b82f6; color: #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>Generated from Image</h1>
      </div>
      <div class="content">
        <div class="grid">
          <div>
            <h3>Main Content</h3>
            <p>This component was automatically generated from your uploaded image.</p>
          </div>
          <div>
            <button class="btn btn-primary">Primary Action</button>
            <button class="btn btn-outline">Secondary Action</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

      default:
        return `${contextHint}<!-- Generated Tailwind CSS Component -->
<div class="max-w-4xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <h1 class="text-2xl font-bold">Generated from Image</h1>
    </div>
    <div class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">Main Content</h3>
          <p class="text-gray-600">
            This component was automatically generated from your uploaded image.
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full">
            Primary Action
          </button>
          <button class="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 w-full">
            Secondary Action
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Code copied",
        description: "Code has been copied to your clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const insertIntoProject = () => {
    if (onCodeGenerated) {
      onCodeGenerated(generatedCode, selectedFramework);
      toast({
        title: "Code inserted",
        description: "Generated code has been inserted into your project"
      });
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Visual to Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-3">
            <Label>Upload Screenshot or Design</Label>
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div className="space-y-3">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded design" 
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <p className="text-sm text-muted-foreground">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload your design</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PNG, JPG, Figma exports
                    </p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Framework Selection */}
          <div className="space-y-3">
            <Label>Target Framework</Label>
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map(framework => (
                  <SelectItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Context */}
          <div className="space-y-3">
            <Label>Additional Context (Optional)</Label>
            <Textarea
              placeholder="Describe any specific requirements, interactions, or details about the design..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={analyzeImage} 
            disabled={!uploadedImage || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Code className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-muted-foreground">
                Processing your design...
              </p>
            </div>
          )}

          {/* Generated Code */}
          {generatedCode && !isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Generated Code</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Download className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" onClick={insertIntoProject}>
                    <Eye className="h-4 w-4 mr-1" />
                    Insert
                  </Button>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 max-h-64 overflow-auto">
                <pre className="text-sm">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};