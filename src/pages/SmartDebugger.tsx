import React, { useState } from 'react';
import { SmartDebugger as SmartDebuggerComponent } from '@/components/ai/SmartDebugger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Bug } from 'lucide-react';
import { toast } from 'sonner';

const SmartDebugger = () => {
  const [code, setCode] = useState('');
  const [framework, setFramework] = useState('react');

  const handleCodeFixed = (fixedCode: string) => {
    toast.success('Code fixes applied successfully!');
    setCode(fixedCode);
  };

  const exampleCode = `import React, { useState, useEffect } from 'react';

const MyComponent = ({ data }) => {
  const [count, setCount] = useState(0);
  const [unused, setUnused] = useState(null);
  
  useEffect(() => {
    // Missing dependency
    console.log(data);
  }, []);

  const handleClick = () => {
    // Missing semicolon
    setCount(count + 1)
  }

  return (
    <div>
      <button onClick={handleClick}>
        Count: {count}
      </button>
    </div>
  );
};

export default MyComponent;`;

  const loadExample = () => {
    setCode(exampleCode);
    toast.success('Example code loaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Smart Debugger
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Automatically detect and fix syntax errors, warnings, and code issues with AI-powered analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Code Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue.js</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="laravel">Laravel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Code to Debug</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here to analyze for errors and improvements..."
                  className="min-h-64 font-mono text-sm"
                />
              </div>

              <Button onClick={loadExample} variant="outline" className="w-full">
                <Bug className="h-4 w-4 mr-2" />
                Load Example Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Static Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Scans your code using ESLint, TypeScript compiler, and custom rules
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">AI Enhancement</h4>
                    <p className="text-sm text-muted-foreground">
                      AI analyzes patterns and suggests optimizations beyond basic linting
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Auto-Fix</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically applies fixes for common issues with detailed explanations
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <SmartDebuggerComponent 
          projectCode={code} 
          framework={framework} 
          onCodeFixed={handleCodeFixed} 
        />
      </div>
    </div>
  );
};

export default SmartDebugger;