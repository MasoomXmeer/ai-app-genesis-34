import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle, Bug, Zap, Code, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'high' | 'medium' | 'low';
  file: string;
  line: number;
  column: number;
  message: string;
  rule: string;
  fixable: boolean;
  suggestion?: string;
  autoFixCode?: string;
}

interface SmartDebuggerProps {
  projectCode?: string;
  framework?: string;
  onCodeFixed?: (fixedCode: string) => void;
}

export const SmartDebugger: React.FC<SmartDebuggerProps> = ({ 
  projectCode = '', 
  framework = 'react', 
  onCodeFixed 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);
  const [fixedCode, setFixedCode] = useState(projectCode);

  useEffect(() => {
    if (projectCode) {
      analyzeCode();
    }
  }, [projectCode, framework]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate static analysis (would use ESLint, TypeScript compiler, etc. in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockIssues: CodeIssue[] = generateMockIssues(framework);
      setIssues(mockIssues);
      
      if (autoFixEnabled) {
        const autoFixableIssues = mockIssues.filter(issue => issue.fixable);
        if (autoFixableIssues.length > 0) {
          await autoFixIssues(autoFixableIssues);
        }
      }

      toast({
        title: "Code analysis complete",
        description: `Found ${mockIssues.length} issues in your code`
      });

    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockIssues = (framework: string): CodeIssue[] => {
    const baseIssues = [
      {
        id: '1',
        type: 'error' as const,
        severity: 'high' as const,
        file: 'App.tsx',
        line: 23,
        column: 15,
        message: 'Property "onClick" is missing in type',
        rule: '@typescript-eslint/no-unused-vars',
        fixable: true,
        suggestion: 'Add onClick handler to button component',
        autoFixCode: 'onClick={() => console.log("clicked")}'
      },
      {
        id: '2',
        type: 'warning' as const,
        severity: 'medium' as const,
        file: 'components/Button.tsx',
        line: 45,
        column: 8,
        message: 'Missing dependency in useEffect hook',
        rule: 'react-hooks/exhaustive-deps',
        fixable: true,
        suggestion: 'Add missing dependency to useEffect dependency array'
      },
      {
        id: '3',
        type: 'warning' as const,
        severity: 'low' as const,
        file: 'utils/helpers.ts',
        line: 12,
        column: 1,
        message: 'Prefer const assertions instead of type annotations',
        rule: '@typescript-eslint/prefer-as-const',
        fixable: true
      },
      {
        id: '4',
        type: 'info' as const,
        severity: 'low' as const,
        file: 'App.tsx',
        line: 67,
        column: 23,
        message: 'Consider using optional chaining',
        rule: '@typescript-eslint/prefer-optional-chain',
        fixable: true
      }
    ];

    if (framework === 'laravel') {
      return [
        {
          id: '5',
          type: 'error' as const,
          severity: 'high' as const,
          file: 'app/Http/Controllers/UserController.php',
          line: 34,
          column: 12,
          message: 'Undefined method User::findByEmail',
          rule: 'phpstan/undefined-method',
          fixable: false,
          suggestion: 'Create findByEmail method in User model or use where() clause'
        },
        {
          id: '6',
          type: 'warning' as const,
          severity: 'medium' as const,
          file: 'routes/web.php',
          line: 15,
          column: 1,
          message: 'Route missing middleware protection',
          rule: 'security/missing-middleware',
          fixable: true,
          suggestion: 'Add auth middleware to protected routes'
        },
        ...baseIssues.slice(2)
      ];
    }

    return baseIssues;
  };

  const autoFixIssues = async (issues: CodeIssue[]) => {
    let updatedCode = fixedCode;
    
    for (const issue of issues) {
      if (issue.autoFixCode) {
        // Simulate applying fix
        updatedCode = applyFix(updatedCode, issue);
      }
    }
    
    setFixedCode(updatedCode);
    setIssues(prev => prev.map(issue => 
      issues.find(fixedIssue => fixedIssue.id === issue.id) 
        ? { ...issue, type: 'info' as const, message: `Fixed: ${issue.message}` }
        : issue
    ));

    toast({
      title: "Auto-fix applied",
      description: `Fixed ${issues.length} issues automatically`
    });
  };

  const applyFix = (code: string, issue: CodeIssue): string => {
    // This would implement actual code fixes in production
    return code.replace(
      /console\.log\("clicked"\)/g,
      issue.autoFixCode || 'console.log("fixed")'
    );
  };

  const fixSingleIssue = async (issue: CodeIssue) => {
    if (!issue.fixable) return;

    const updatedCode = applyFix(fixedCode, issue);
    setFixedCode(updatedCode);
    setIssues(prev => prev.map(i => 
      i.id === issue.id 
        ? { ...i, type: 'info' as const, message: `Fixed: ${i.message}` }
        : i
    ));

    toast({
      title: "Issue fixed",
      description: `Fixed: ${issue.message}`
    });
  };

  const applyAllFixes = () => {
    const fixableIssues = issues.filter(issue => issue.fixable && issue.type !== 'info');
    autoFixIssues(fixableIssues);
    if (onCodeFixed) {
      onCodeFixed(fixedCode);
    }
  };

  const getIssueIcon = (type: CodeIssue['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: CodeIssue['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const fixableCount = issues.filter(i => i.fixable && i.type !== 'info').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Smart Debugger
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-fix"
                  checked={autoFixEnabled}
                  onCheckedChange={setAutoFixEnabled}
                />
                <Label htmlFor="auto-fix">Auto-fix</Label>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={analyzeCode}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{fixableCount}</div>
              <div className="text-sm text-muted-foreground">Fixable</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{issues.filter(i => i.type === 'info').length}</div>
              <div className="text-sm text-muted-foreground">Fixed</div>
            </div>
          </div>

          {fixableCount > 0 && (
            <div className="mb-4">
              <Button onClick={applyAllFixes} className="w-full">
                <Code className="h-4 w-4 mr-2" />
                Fix All Issues ({fixableCount})
              </Button>
            </div>
          )}

          <Tabs defaultValue="issues">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="fixed">Fixed Code</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-3">
              {issues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isAnalyzing ? 'Analyzing your code...' : 'No issues found'}
                </div>
              ) : (
                issues.map((issue) => (
                  <Card key={issue.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getIssueIcon(issue.type)}
                          <span className="font-medium">{issue.file}:{issue.line}:{issue.column}</span>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          {issue.fixable && issue.type !== 'info' && (
                            <Badge variant="outline">Fixable</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{issue.message}</p>
                        <p className="text-xs text-muted-foreground">Rule: {issue.rule}</p>
                        {issue.suggestion && (
                          <p className="text-xs text-blue-600 mt-1">{issue.suggestion}</p>
                        )}
                      </div>
                      {issue.fixable && issue.type !== 'info' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fixSingleIssue(issue)}
                        >
                          Fix
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="fixed">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Updated Code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCodeFixed?.(fixedCode)}
                  >
                    Apply Changes
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
                  <pre className="text-sm">
                    <code>{fixedCode}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};