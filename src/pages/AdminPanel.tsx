import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentGatewayConfig from '@/components/admin/PaymentGatewayConfig';
import GenerationManager from '@/components/admin/GenerationManager';
import PromptManager from '@/components/admin/PromptManager';
import SystemSettings from '@/components/admin/SystemSettings';
import FeatureToggleManager from '@/components/admin/FeatureToggleManager';
import EnvironmentVariables from '@/components/admin/EnvironmentVariables';
import DeploymentSettings from '@/components/admin/DeploymentSettings';
import { ContextCacheManager } from '@/components/admin/ContextCacheManager';
import { 
  Settings, 
  Users, 
  CreditCard, 
  Key, 
  Database, 
  BarChart, 
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Zap,
  FileText,
  Brain
} from 'lucide-react';

const AdminPanel = () => {
  const apiProviders = [
    { name: "OpenAI GPT-4", status: "Active", usage: "1,245 requests", cost: "$124.50" },
    { name: "Anthropic Claude", status: "Active", usage: "892 requests", cost: "$89.20" },
    { name: "Google Gemini", status: "Inactive", usage: "0 requests", cost: "$0.00" },
    { name: "Groq", status: "Active", usage: "567 requests", cost: "$28.35" },
    { name: "OpenRouter", status: "Active", usage: "234 requests", cost: "$23.40" }
  ];

  const users = [
    { name: "John Doe", email: "john@example.com", plan: "Pro", usage: "245/1000", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", plan: "Enterprise", usage: "1,234/10,000", status: "Active" },
    { name: "Bob Johnson", email: "bob@example.com", plan: "Free", usage: "45/100", status: "Active" },
    { name: "Alice Brown", email: "alice@example.com", plan: "Pro", usage: "0/1000", status: "Suspended" }
  ];

  const subscriptionPlans = [
    { name: "Free", price: "$0", features: "100 messages, 3 projects", users: 1250 },
    { name: "Pro", price: "$29", features: "1,000 messages, unlimited projects", users: 340 },
    { name: "Enterprise", price: "$99", features: "10,000 messages, white-label", users: 45 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your AI Builder Pro platform with advanced context management</p>
          </div>
          <Button className="gradient-primary text-primary-foreground hover:opacity-90">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">1,635</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-foreground">$23,450</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Requests</p>
                  <p className="text-2xl font-bold text-foreground">45,892</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <BarChart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">3,247</p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <Database className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Context Cache</p>
                  <p className="text-2xl font-bold text-foreground">98.5%</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="context-cache" className="space-y-6">
          <TabsList className="grid grid-cols-12 w-full max-w-7xl bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="context-cache" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Context</TabsTrigger>
            <TabsTrigger value="generation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Generation</TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Prompts</TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">API Keys</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Plans</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Payments</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">System</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Features</TabsTrigger>
            <TabsTrigger value="deployment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Deployment</TabsTrigger>
            <TabsTrigger value="environment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Environment</TabsTrigger>
          </TabsList>

          {/* Context Cache Management */}
          <TabsContent value="context-cache">
            <ContextCacheManager />
          </TabsContent>

          {/* Generation Management */}
          <TabsContent value="generation">
            <GenerationManager />
          </TabsContent>

          {/* Prompt Management */}
          <TabsContent value="prompts">
            <PromptManager />
          </TabsContent>

          {/* API Keys Management */}
          <TabsContent value="api-keys">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-primary" />
                    API Provider Management
                  </div>
                  <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Provider
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiProviders.map((provider, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.usage} • {provider.cost}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={provider.status === "Active" ? "default" : "secondary"} className={provider.status === "Active" ? "bg-primary text-primary-foreground" : ""}>
                          {provider.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    User Management
                  </div>
                  <div className="flex space-x-2">
                    <Input placeholder="Search users..." className="w-64 bg-background/50" />
                    <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-primary/20">{user.plan}</Badge>
                        <span className="text-sm text-muted-foreground">{user.usage}</span>
                        <Badge variant={user.status === "Active" ? "default" : "destructive"} className={user.status === "Active" ? "bg-primary text-primary-foreground" : ""}>
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Plans */}
          <TabsContent value="plans">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Subscription Plans
                  </div>
                  <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan, index) => (
                    <Card key={index} className="bg-muted/30 border-primary/10 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-foreground mb-2">{plan.name}</h3>
                        <p className="text-2xl font-bold text-primary mb-2">{plan.price}</p>
                        <p className="text-sm text-muted-foreground mb-4">{plan.features}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{plan.users} users</span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments">
            <PaymentGatewayConfig />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Revenue Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <BarChart className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>

          {/* Feature Toggle Manager */}
          <TabsContent value="features">
            <FeatureToggleManager />
          </TabsContent>

          {/* Deployment Settings */}
          <TabsContent value="deployment">
            <DeploymentSettings />
          </TabsContent>

          {/* Environment Variables */}
          <TabsContent value="environment">
            <EnvironmentVariables />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
