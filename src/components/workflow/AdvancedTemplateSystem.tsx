
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers,
  Star,
  Download,
  Upload,
  Search,
  Filter,
  Code,
  Database,
  Globe,
  Smartphone,
  Server,
  Shield,
  Zap,
  TrendingUp,
  Brain,
  Rocket,
  Heart,
  Eye,
  Copy,
  CheckCircle
} from 'lucide-react';

export interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  features: string[];
  tags: string[];
  rating: number;
  downloads: number;
  preview: string;
  author: string;
  lastUpdated: string;
  dynamicFeatures: DynamicFeature[];
  customizationOptions: CustomizationOption[];
  codeSnippets: CodeSnippet[];
  learningData?: TemplateLearningData;
}

export interface DynamicFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  dependencies: string[];
  configOptions: Record<string, any>;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'color' | 'typography' | 'layout' | 'component' | 'behavior';
  value: any;
  options?: any[];
}

export interface CodeSnippet {
  id: string;
  name: string;
  language: string;
  code: string;
  description: string;
}

export interface TemplateLearningData {
  usageCount: number;
  successRate: number;
  commonModifications: string[];
  userFeedback: number;
  performanceMetrics: Record<string, number>;
}

const AdvancedTemplateSystem: React.FC = () => {
  const [templates, setTemplates] = useState<AdvancedTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AdvancedTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'recent' | 'complexity'>('popularity');
  const [customizationValues, setCustomizationValues] = useState<Record<string, any>>({});

  // Initialize templates with advanced features
  useEffect(() => {
    const advancedTemplates: AdvancedTemplate[] = [
      {
        id: 'fintech-trading-platform',
        name: 'FinTech Trading Platform',
        description: 'Professional trading platform with real-time data, advanced charting, and risk management',
        category: 'fintech',
        framework: 'react',
        complexity: 'expert',
        features: [
          'Real-time market data feeds',
          'Advanced charting with TradingView',
          'Portfolio management',
          'Risk analytics',
          'Order management system',
          'KYC/AML compliance',
          'Multi-currency support',
          'API integration'
        ],
        tags: ['trading', 'finance', 'real-time', 'charts', 'api'],
        rating: 4.9,
        downloads: 1247,
        preview: '/previews/fintech-trading.png',
        author: 'AI Builder Pro',
        lastUpdated: '2024-01-15',
        dynamicFeatures: [
          {
            id: 'real-time-data',
            name: 'Real-time Market Data',
            description: 'Live market data feeds with WebSocket connections',
            enabled: true,
            dependencies: ['websocket', 'chart-library'],
            configOptions: {
              updateInterval: 1000,
              maxSymbols: 100,
              dataProvider: 'alpha-vantage'
            }
          },
          {
            id: 'advanced-charts',
            name: 'Advanced Charting',
            description: 'Professional-grade charts with technical indicators',
            enabled: true,
            dependencies: ['tradingview-library'],
            configOptions: {
              indicators: ['RSI', 'MACD', 'Bollinger Bands'],
              timeframes: ['1m', '5m', '1h', '1d']
            }
          },
          {
            id: 'risk-management',
            name: 'Risk Management Engine',
            description: 'Automated risk assessment and management tools',
            enabled: false,
            dependencies: ['risk-engine'],
            configOptions: {
              maxRiskPerTrade: 2,
              stopLossEnabled: true,
              takeProfitEnabled: true
            }
          }
        ],
        customizationOptions: [
          {
            id: 'primary-color',
            name: 'Primary Color',
            type: 'color',
            value: '#2563eb',
            options: ['#2563eb', '#059669', '#dc2626', '#7c3aed']
          },
          {
            id: 'chart-theme',
            name: 'Chart Theme',
            type: 'component',
            value: 'dark',
            options: ['light', 'dark', 'professional']
          },
          {
            id: 'dashboard-layout',
            name: 'Dashboard Layout',
            type: 'layout',
            value: 'grid',
            options: ['grid', 'sidebar', 'tabs']
          }
        ],
        codeSnippets: [
          {
            id: 'websocket-connection',
            name: 'WebSocket Market Data',
            language: 'typescript',
            code: `const useMarketData = (symbol: string) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket(\`wss://api.example.com/\${symbol}\`);
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    return () => ws.close();
  }, [symbol]);
  
  return data;
};`,
            description: 'Real-time market data hook using WebSocket'
          }
        ],
        learningData: {
          usageCount: 1247,
          successRate: 94.2,
          commonModifications: [
            'Custom color scheme',
            'Additional chart indicators',
            'Enhanced risk management'
          ],
          userFeedback: 4.9,
          performanceMetrics: {
            buildTime: 45,
            bundleSize: 2.1,
            loadTime: 1.8
          }
        }
      },
      {
        id: 'laravel-erp-system',
        name: 'Laravel ERP System',
        description: 'Comprehensive enterprise resource planning system with modules for HR, Finance, and Inventory',
        category: 'enterprise',
        framework: 'laravel',
        complexity: 'expert',
        features: [
          'Multi-tenant architecture',
          'Role-based permissions',
          'HR management module',
          'Financial accounting',
          'Inventory management',
          'Report generation',
          'API endpoints',
          'Real-time notifications'
        ],
        tags: ['erp', 'enterprise', 'laravel', 'multi-tenant', 'hr'],
        rating: 4.8,
        downloads: 892,
        preview: '/previews/laravel-erp.png',
        author: 'AI Builder Pro',
        lastUpdated: '2024-01-12',
        dynamicFeatures: [
          {
            id: 'multi-tenant',
            name: 'Multi-tenant Architecture',
            description: 'Support multiple organizations in single installation',
            enabled: true,
            dependencies: ['laravel-tenant'],
            configOptions: {
              tenantIdentification: 'subdomain',
              sharedDatabase: false
            }
          },
          {
            id: 'hr-module',
            name: 'HR Management',
            description: 'Complete human resource management system',
            enabled: true,
            dependencies: ['hr-package'],
            configOptions: {
              payrollEnabled: true,
              performanceReviews: true,
              leaveManagement: true
            }
          }
        ],
        customizationOptions: [
          {
            id: 'admin-theme',
            name: 'Admin Theme',
            type: 'component',
            value: 'modern',
            options: ['modern', 'classic', 'minimal']
          },
          {
            id: 'database-driver',
            name: 'Database Driver',
            type: 'behavior',
            value: 'mysql',
            options: ['mysql', 'postgresql', 'sqlite']
          }
        ],
        codeSnippets: [
          {
            id: 'tenant-middleware',
            name: 'Tenant Middleware',
            language: 'php',
            code: `class TenantMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $tenant = Tenant::where('domain', $request->getHost())->first();
        if (!$tenant) {
            abort(404);
        }
        
        app()->instance('tenant', $tenant);
        config(['database.default' => $tenant->database]);
        
        return $next($request);
    }
}`,
            description: 'Middleware for tenant identification and database switching'
          }
        ],
        learningData: {
          usageCount: 892,
          successRate: 91.5,
          commonModifications: [
            'Custom modules',
            'Enhanced reporting',
            'Third-party integrations'
          ],
          userFeedback: 4.8,
          performanceMetrics: {
            buildTime: 120,
            bundleSize: 5.4,
            loadTime: 2.1
          }
        }
      }
    ];

    setTemplates(advancedTemplates);
  }, []);

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesFramework = selectedFramework === 'all' || template.framework === selectedFramework;
      
      return matchesSearch && matchesCategory && matchesFramework;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity': return b.downloads - a.downloads;
        case 'rating': return b.rating - a.rating;
        case 'recent': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'complexity': return a.complexity.localeCompare(b.complexity);
        default: return 0;
      }
    });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrameworkIcon = (framework: string) => {
    switch (framework) {
      case 'react': return <Code className="h-4 w-4" />;
      case 'laravel': return <Server className="h-4 w-4" />;
      case 'vue': return <Globe className="h-4 w-4" />;
      case 'angular': return <Shield className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Layers className="h-5 w-5 mr-2 text-primary" />
            Advanced Template Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              <option value="fintech">FinTech</option>
              <option value="enterprise">Enterprise</option>
              <option value="ecommerce">E-commerce</option>
              <option value="healthcare">Healthcare</option>
            </select>
            
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Frameworks</option>
              <option value="react">React</option>
              <option value="laravel">Laravel</option>
              <option value="vue">Vue.js</option>
              <option value="angular">Angular</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="recent">Most Recent</option>
              <option value="complexity">Complexity</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Template Grid */}
        <div className="xl:col-span-2 space-y-4">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      {getFrameworkIcon(template.framework)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                          {template.complexity}
                        </Badge>
                        <Badge variant="outline">
                          {getFrameworkIcon(template.framework)}
                          <span className="ml-1">{template.framework}</span>
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {template.rating}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Download className="h-3 w-3 mr-1" />
                          {template.downloads}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 5).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 5} more
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Success Rate:</span>
                    <div className="font-medium text-green-600">
                      {template.learningData?.successRate}%
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Build Time:</span>
                    <div className="font-medium">
                      ~{template.learningData?.performanceMetrics.buildTime}s
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bundle Size:</span>
                    <div className="font-medium">
                      {template.learningData?.performanceMetrics.bundleSize}MB
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Load Time:</span>
                    <div className="font-medium">
                      {template.learningData?.performanceMetrics.loadTime}s
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Details */}
        <div className="xl:col-span-1">
          {selectedTemplate ? (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedTemplate.name}</span>
                  <Button size="sm" className="gradient-primary">
                    <Rocket className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="features" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="customize">Customize</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Dynamic Features</h4>
                      <div className="space-y-2">
                        {selectedTemplate.dynamicFeatures.map((feature) => (
                          <div key={feature.id} className="flex items-center justify-between p-2 rounded border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{feature.name}</div>
                              <div className="text-xs text-muted-foreground">{feature.description}</div>
                            </div>
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={(checked) => {
                                // Handle feature toggle
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Included Features</h4>
                      <div className="space-y-1">
                        {selectedTemplate.features.map((feature) => (
                          <div key={feature} className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="customize" className="space-y-4">
                    {selectedTemplate.customizationOptions.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <Label className="text-sm font-medium">{option.name}</Label>
                        {option.type === 'color' ? (
                          <div className="flex space-x-2">
                            {option.options?.map((color) => (
                              <button
                                key={color}
                                className="w-8 h-8 rounded border-2 border-gray-200"
                                style={{ backgroundColor: color }}
                                onClick={() => setCustomizationValues(prev => ({
                                  ...prev,
                                  [option.id]: color
                                }))}
                              />
                            ))}
                          </div>
                        ) : (
                          <select
                            value={customizationValues[option.id] || option.value}
                            onChange={(e) => setCustomizationValues(prev => ({
                              ...prev,
                              [option.id]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          >
                            {option.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    {selectedTemplate.codeSnippets.map((snippet) => (
                      <div key={snippet.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{snippet.name}</h4>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{snippet.description}</p>
                        <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="sticky top-6">
              <CardContent className="p-8 text-center">
                <Layers className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Select a Template</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a template to view detailed features, customization options, and code examples
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedTemplateSystem;
