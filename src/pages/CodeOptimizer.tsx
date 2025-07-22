import React, { useState } from 'react';
import { CodeOptimizer as CodeOptimizerComponent } from '@/components/ai/CodeOptimizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

const CodeOptimizer = () => {
  const [code, setCode] = useState('');
  const [framework, setFramework] = useState('react');

  const handleCodeOptimized = (optimizedCode: string) => {
    toast.success('Code optimization complete!');
    setCode(optimizedCode);
  };

  const exampleReactCode = `import React, { useState, useEffect } from 'react';

const ExpensiveComponent = ({ items, onItemClick }) => {
  const [filter, setFilter] = useState('');
  
  // Expensive calculation on every render
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleClick = (id) => {
    onItemClick(id);
  };

  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter items..." 
      />
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default ExpensiveComponent;`;

  const loadExample = () => {
    setCode(exampleReactCode);
    toast.success('Example code loaded');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Code Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Analyze and optimize your code for better performance, maintainability, and best practices
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
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
                <Label>Code to Optimize</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here for performance analysis and optimization suggestions..."
                  className="min-h-64 font-mono text-sm"
                />
              </div>

              <Button onClick={loadExample} variant="outline" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Load Example Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      React.memo, useCallback, useMemo, code splitting
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-blue-500 rounded mt-0.5" />
                  <div>
                    <h4 className="font-medium">Code Quality</h4>
                    <p className="text-sm text-muted-foreground">
                      Remove dead code, improve readability, reduce complexity
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-green-500 rounded mt-0.5" />
                  <div>
                    <h4 className="font-medium">Best Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Error boundaries, proper typing, accessibility improvements
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 bg-red-500 rounded mt-0.5" />
                  <div>
                    <h4 className="font-medium">Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Input validation, XSS prevention, secure patterns
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CodeOptimizerComponent 
          projectCode={code} 
          framework={framework} 
          onCodeOptimized={handleCodeOptimized} 
        />
      </div>
    </div>
  );
};

export default CodeOptimizer;