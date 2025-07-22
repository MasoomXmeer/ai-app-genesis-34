import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  TrendingUp, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Smartphone,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OptimizationSuggestion {
  id: string;
  category: 'performance' | 'cleanup' | 'security' | 'accessibility' | 'best-practices';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  beforeCode: string;
  afterCode: string;
  explanation: string;
  benefits: string[];
}

interface CodeOptimizerProps {
  projectCode?: string;
  framework?: string;
  onCodeOptimized?: (optimizedCode: string) => void;
}

export const CodeOptimizer: React.FC<CodeOptimizerProps> = ({ 
  projectCode = '', 
  framework = 'react', 
  onCodeOptimized 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<OptimizationSuggestion | null>(null);
  const [optimizedCode, setOptimizedCode] = useState(projectCode);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzeCodePerformance = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate performance analysis
      const stages = [
        'Analyzing bundle size...',
        'Checking render performance...',
        'Reviewing data structures...',
        'Scanning for anti-patterns...',
        'Identifying optimization opportunities...',
        'Generating recommendations...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setAnalysisProgress(Math.round(((i + 1) / stages.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const mockSuggestions = generateOptimizationSuggestions(framework);
      setSuggestions(mockSuggestions);

      toast({
        title: "Analysis complete",
        description: `Found ${mockSuggestions.length} optimization opportunities`
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

  const generateOptimizationSuggestions = (framework: string): OptimizationSuggestion[] => {
    const reactSuggestions: OptimizationSuggestion[] = [
      {
        id: '1',
        category: 'performance',
        title: 'Implement React.memo for expensive components',
        description: 'Prevent unnecessary re-renders by memoizing components',
        impact: 'high',
        effort: 'easy',
        beforeCode: `const ExpensiveComponent = ({ data, onClick }) => {
  return (
    <div>
      {data.map(item => (
        <ComplexItem key={item.id} item={item} onClick={onClick} />
      ))}
    </div>
  );
};`,
        afterCode: `const ExpensiveComponent = React.memo(({ data, onClick }) => {
  return (
    <div>
      {data.map(item => (
        <ComplexItem key={item.id} item={item} onClick={onClick} />
      ))}
    </div>
  );
});`,
        explanation: 'React.memo prevents re-renders when props haven\'t changed, significantly improving performance for expensive components.',
        benefits: ['Reduced render cycles', 'Better performance', 'Lower CPU usage']
      },
      {
        id: '2',
        category: 'performance',
        title: 'Use useCallback for event handlers',
        description: 'Memoize event handlers to prevent child re-renders',
        impact: 'medium',
        effort: 'easy',
        beforeCode: `const Component = ({ items }) => {
  const handleClick = (id) => {
    // Handle click logic
  };

  return (
    <div>
      {items.map(item => (
        <Item key={item.id} onClick={() => handleClick(item.id)} />
      ))}
    </div>
  );
};`,
        afterCode: `const Component = ({ items }) => {
  const handleClick = useCallback((id) => {
    // Handle click logic
  }, []);

  const memoizedItems = useMemo(() => 
    items.map(item => ({
      ...item,
      onClick: () => handleClick(item.id)
    })), [items, handleClick]
  );

  return (
    <div>
      {memoizedItems.map(item => (
        <Item key={item.id} onClick={item.onClick} />
      ))}
    </div>
  );
};`,
        explanation: 'useCallback memoizes the function reference, preventing unnecessary re-renders of child components.',
        benefits: ['Stable function references', 'Fewer re-renders', 'Better performance']
      },
      {
        id: '3',
        category: 'cleanup',
        title: 'Remove unused imports and variables',
        description: 'Clean up dead code to reduce bundle size',
        impact: 'medium',
        effort: 'easy',
        beforeCode: `import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { utils } from '@/lib/utils';

const Component = () => {
  const [count, setCount] = useState(0);
  const [unused, setUnused] = useState(null);
  
  return <Button>Click me</Button>;
};`,
        afterCode: `import React from 'react';
import { Button } from '@/components/ui/button';

const Component = () => {
  return <Button>Click me</Button>;
};`,
        explanation: 'Removing unused imports and variables reduces bundle size and improves code readability.',
        benefits: ['Smaller bundle size', 'Cleaner code', 'Faster build times']
      },
      {
        id: '4',
        category: 'best-practices',
        title: 'Implement proper error boundaries',
        description: 'Add error handling to prevent app crashes',
        impact: 'high',
        effort: 'medium',
        beforeCode: `const App = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};`,
        afterCode: `const App = () => {
  return (
    <ErrorBoundary>
      <div>
        <Header />
        <ErrorBoundary>
          <MainContent />
        </ErrorBoundary>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};`,
        explanation: 'Error boundaries catch JavaScript errors anywhere in the component tree and display fallback UI.',
        benefits: ['Better error handling', 'Improved user experience', 'Easier debugging']
      }
    ];

    const laravelSuggestions: OptimizationSuggestion[] = [
      {
        id: '5',
        category: 'performance',
        title: 'Add database query optimization',
        description: 'Use eager loading to reduce N+1 query problems',
        impact: 'high',
        effort: 'medium',
        beforeCode: `// Controller
public function index()
{
    $posts = Post::all();
    return view('posts.index', compact('posts'));
}

// View
@foreach($posts as $post)
    <div>
        <h3>{{ $post->title }}</h3>
        <p>By: {{ $post->user->name }}</p>
        <p>Comments: {{ $post->comments->count() }}</p>
    </div>
@endforeach`,
        afterCode: `// Controller
public function index()
{
    $posts = Post::with(['user', 'comments'])->get();
    return view('posts.index', compact('posts'));
}

// View (same as before)
@foreach($posts as $post)
    <div>
        <h3>{{ $post->title }}</h3>
        <p>By: {{ $post->user->name }}</p>
        <p>Comments: {{ $post->comments->count() }}</p>
    </div>
@endforeach`,
        explanation: 'Eager loading reduces database queries from N+1 to just 2 queries, significantly improving performance.',
        benefits: ['Reduced database queries', 'Faster page load', 'Better scalability']
      },
      {
        id: '6',
        category: 'security',
        title: 'Implement proper input validation',
        description: 'Add comprehensive validation and sanitization',
        impact: 'high',
        effort: 'medium',
        beforeCode: `public function store(Request $request)
{
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password)
    ]);
    
    return redirect()->route('users.index');
}`,
        afterCode: `public function store(StoreUserRequest $request)
{
    $validated = $request->validated();
    
    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password'])
    ]);
    
    return redirect()->route('users.index')
        ->with('success', 'User created successfully');
}

// StoreUserRequest
public function rules()
{
    return [
        'name' => 'required|string|max:255|alpha_spaces',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/'
    ];
}`,
        explanation: 'Proper validation prevents security vulnerabilities and ensures data integrity.',
        benefits: ['Improved security', 'Data validation', 'Better error handling']
      }
    ];

    return framework === 'laravel' ? laravelSuggestions : reactSuggestions;
  };

  const applySuggestion = (suggestion: OptimizationSuggestion) => {
    // Simulate applying the optimization
    let newCode = optimizedCode;
    newCode = newCode.replace(suggestion.beforeCode, suggestion.afterCode);
    setOptimizedCode(newCode);

    toast({
      title: "Optimization applied",
      description: suggestion.title
    });
  };

  const applyAllSuggestions = () => {
    let newCode = optimizedCode;
    suggestions.forEach(suggestion => {
      newCode = newCode.replace(suggestion.beforeCode, suggestion.afterCode);
    });
    setOptimizedCode(newCode);
    if (onCodeOptimized) {
      onCodeOptimized(newCode);
    }

    toast({
      title: "All optimizations applied",
      description: `Applied ${suggestions.length} optimizations`
    });
  };

  const getCategoryIcon = (category: OptimizationSuggestion['category']) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'cleanup': return <Code className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'accessibility': return <Smartphone className="h-4 w-4" />;
      case 'best-practices': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: OptimizationSuggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEffortColor = (effort: OptimizationSuggestion['effort']) => {
    switch (effort) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Code Optimizer
            </CardTitle>
            <Button 
              onClick={analyzeCodePerformance}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing && (
            <div className="space-y-2 mb-6">
              <Progress value={analysisProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Analyzing your code for optimization opportunities...
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="mb-4">
              <Button onClick={applyAllSuggestions} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply All Optimizations ({suggestions.length})
              </Button>
            </div>
          )}

          <Tabs defaultValue="suggestions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="optimized">Optimized Code</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-4">
              {suggestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isAnalyzing ? 'Analyzing your code...' : 'Run analysis to get optimization suggestions'}
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(suggestion.category)}
                            <h4 className="font-medium">{suggestion.title}</h4>
                            <Badge className={getImpactColor(suggestion.impact)}>
                              {suggestion.impact} impact
                            </Badge>
                            <Badge className={getEffortColor(suggestion.effort)}>
                              {suggestion.effort}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {suggestion.description}
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm">{suggestion.explanation}</p>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.benefits.map((benefit, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Apply
                        </Button>
                      </div>

                      {selectedSuggestion?.id === suggestion.id && (
                        <div className="space-y-3 border-t pt-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs font-medium text-red-600">Before</Label>
                              <div className="bg-red-50 rounded-md p-3 mt-1">
                                <pre className="text-xs overflow-auto">
                                  <code>{suggestion.beforeCode}</code>
                                </pre>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-green-600">After</Label>
                              <div className="bg-green-50 rounded-md p-3 mt-1">
                                <pre className="text-xs overflow-auto">
                                  <code>{suggestion.afterCode}</code>
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSuggestion(
                          selectedSuggestion?.id === suggestion.id ? null : suggestion
                        )}
                      >
                        {selectedSuggestion?.id === suggestion.id ? 'Hide' : 'Show'} Code Diff
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="optimized">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Optimized Code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCodeOptimized(optimizedCode)}
                  >
                    Apply Changes
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
                  <pre className="text-sm">
                    <code>{optimizedCode}</code>
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