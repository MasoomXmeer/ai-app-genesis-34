import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw,
  Shield,
  Database,
  Globe,
  Bot,
  CreditCard,
  GitBranch,
  Mail,
  Server,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  description: string;
  category: 'ai' | 'database' | 'payment' | 'integration' | 'security' | 'general';
  environment: 'development' | 'staging' | 'production' | 'all';
  sensitive: boolean;
  required: boolean;
  lastModified: string;
}

const EnvironmentVariables = () => {
  const { toast } = useToast();
  const [variables, setVariables] = useState<EnvironmentVariable[]>([
    {
      id: '1',
      key: 'OPENAI_API_KEY',
      value: 'sk-proj-...',
      description: 'OpenAI API key for GPT models',
      category: 'ai',
      environment: 'all',
      sensitive: true,
      required: true,
      lastModified: '2024-01-15 14:30'
    },
    {
      id: '2',
      key: 'ANTHROPIC_API_KEY',
      value: '',
      description: 'Anthropic Claude API key',
      category: 'ai',
      environment: 'all',
      sensitive: true,
      required: false,
      lastModified: '2024-01-15 14:30'
    },
    {
      id: '3',
      key: 'GITHUB_APP_ID',
      value: '123456',
      description: 'GitHub App ID for repository integration',
      category: 'integration',
      environment: 'all',
      sensitive: false,
      required: false,
      lastModified: '2024-01-15 14:30'
    },
    {
      id: '4',
      key: 'STRIPE_SECRET_KEY',
      value: 'sk_live_...',
      description: 'Stripe secret key for payment processing',
      category: 'payment',
      environment: 'production',
      sensitive: true,
      required: false,
      lastModified: '2024-01-15 14:30'
    },
    {
      id: '5',
      key: 'DATABASE_URL',
      value: 'postgresql://user:pass@localhost:5432/db',
      description: 'PostgreSQL database connection URL',
      category: 'database',
      environment: 'all',
      sensitive: true,
      required: true,
      lastModified: '2024-01-15 14:30'
    }
  ]);

  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [editingVar, setEditingVar] = useState<EnvironmentVariable | null>(null);
  const [newVar, setNewVar] = useState<Partial<EnvironmentVariable>>({
    category: 'general',
    environment: 'all',
    sensitive: false,
    required: false
  });
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categoryIcons = {
    ai: Bot,
    database: Database,
    payment: CreditCard,
    integration: Globe,
    security: Shield,
    general: Server
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'database': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'payment': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'integration': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'security': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'general': return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'development': return 'bg-blue-500/10 text-blue-700';
      case 'staging': return 'bg-yellow-500/10 text-yellow-700';
      case 'production': return 'bg-red-500/10 text-red-700';
      case 'all': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const toggleShowValue = (id: string) => {
    setShowValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: "Copied",
        description: "Environment variable copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleAddVariable = () => {
    if (!newVar.key || !newVar.value) {
      toast({
        title: "Error",
        description: "Key and value are required",
        variant: "destructive",
      });
      return;
    }

    const variable: EnvironmentVariable = {
      id: Date.now().toString(),
      key: newVar.key,
      value: newVar.value,
      description: newVar.description || '',
      category: newVar.category as any,
      environment: newVar.environment as any,
      sensitive: newVar.sensitive || false,
      required: newVar.required || false,
      lastModified: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setVariables(prev => [...prev, variable]);
    setNewVar({
      category: 'general',
      environment: 'all',
      sensitive: false,
      required: false
    });

    toast({
      title: "Variable Added",
      description: "Environment variable has been added successfully",
    });
  };

  const handleUpdateVariable = () => {
    if (!editingVar) return;

    setVariables(prev => prev.map(v => 
      v.id === editingVar.id 
        ? { ...editingVar, lastModified: new Date().toISOString().slice(0, 16).replace('T', ' ') }
        : v
    ));
    setEditingVar(null);

    toast({
      title: "Variable Updated",
      description: "Environment variable has been updated successfully",
    });
  };

  const handleDeleteVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
    toast({
      title: "Variable Deleted",
      description: "Environment variable has been deleted",
    });
  };

  const saveAllVariables = () => {
    localStorage.setItem('environmentVariables', JSON.stringify(variables));
    toast({
      title: "Variables Saved",
      description: "All environment variables have been saved",
    });
  };

  const filteredVariables = variables.filter(v => 
    filter === 'all' || v.category === filter
  );

  const maskValue = (value: string) => {
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.slice(0, 4) + '*'.repeat(value.length - 8) + value.slice(-4);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Environment Variables</h2>
          <p className="text-muted-foreground">Manage API keys, secrets, and configuration variables</p>
        </div>
        <div className="flex space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-background/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="ai">AI Providers</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={saveAllVariables} className="gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      {/* Add New Variable */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2 text-primary" />
            Add New Variable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-key">Key *</Label>
              <Input 
                id="new-key"
                placeholder="EXAMPLE_API_KEY"
                value={newVar.key || ''}
                onChange={(e) => setNewVar({ ...newVar, key: e.target.value.toUpperCase() })}
                className="bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="new-value">Value *</Label>
              <Input 
                id="new-value"
                placeholder="Enter value"
                value={newVar.value || ''}
                onChange={(e) => setNewVar({ ...newVar, value: e.target.value })}
                className="bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="new-category">Category</Label>
              <Select value={newVar.category} onValueChange={(value) => setNewVar({ ...newVar, category: value as any })}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI Providers</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-environment">Environment</Label>
              <Select value={newVar.environment} onValueChange={(value) => setNewVar({ ...newVar, environment: value as any })}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Environments</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="new-description">Description</Label>
              <Input 
                id="new-description"
                placeholder="Brief description of this variable"
                value={newVar.description || ''}
                onChange={(e) => setNewVar({ ...newVar, description: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox"
                checked={newVar.sensitive || false}
                onChange={(e) => setNewVar({ ...newVar, sensitive: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Sensitive</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox"
                checked={newVar.required || false}
                onChange={(e) => setNewVar({ ...newVar, required: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Required</span>
            </label>
            <Button onClick={handleAddVariable} className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Variable
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Variables List */}
      <div className="space-y-4">
        {filteredVariables.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-12 text-center">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Variables Found</h3>
              <p className="text-muted-foreground">Add your first environment variable to get started</p>
            </CardContent>
          </Card>
        ) : (
          filteredVariables.map((variable) => {
            const IconComponent = categoryIcons[variable.category];
            const isVisible = showValues[variable.id];
            
            return (
              <Card key={variable.id} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-mono font-semibold text-foreground">{variable.key}</h3>
                          <Badge className={getCategoryColor(variable.category)}>
                            {variable.category}
                          </Badge>
                          <Badge className={getEnvironmentColor(variable.environment)}>
                            {variable.environment}
                          </Badge>
                          {variable.required && (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              Required
                            </Badge>
                          )}
                          {variable.sensitive && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <Lock className="h-3 w-3 mr-1" />
                              Sensitive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{variable.description}</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {variable.sensitive && !isVisible ? maskValue(variable.value) : variable.value}
                          </code>
                          {variable.sensitive && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => toggleShowValue(variable.id)}
                              className="hover:bg-primary/10"
                            >
                              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(variable.value, variable.id)}
                            className="hover:bg-primary/10"
                          >
                            {copiedId === variable.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last modified: {variable.lastModified}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingVar(variable)}
                        className="hover:bg-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteVariable(variable.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Variable Modal */}
      {editingVar && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-lg border border-primary/20 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Edit Variable</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-key">Key</Label>
                <Input 
                  id="edit-key"
                  value={editingVar.key}
                  onChange={(e) => setEditingVar({ ...editingVar, key: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-value">Value</Label>
                <Input 
                  id="edit-value"
                  value={editingVar.value}
                  onChange={(e) => setEditingVar({ ...editingVar, value: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description"
                  value={editingVar.description}
                  onChange={(e) => setEditingVar({ ...editingVar, description: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingVar.category} onValueChange={(value) => setEditingVar({ ...editingVar, category: value as any })}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai">AI Providers</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-environment">Environment</Label>
                  <Select value={editingVar.environment} onValueChange={(value) => setEditingVar({ ...editingVar, environment: value as any })}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Environments</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    checked={editingVar.sensitive}
                    onChange={(e) => setEditingVar({ ...editingVar, sensitive: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Sensitive</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    checked={editingVar.required}
                    onChange={(e) => setEditingVar({ ...editingVar, required: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Required</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditingVar(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateVariable} className="gradient-primary">
                Update
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnvironmentVariables;