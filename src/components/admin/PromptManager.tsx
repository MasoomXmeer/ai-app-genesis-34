import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Globe, 
  Smartphone, 
  Code, 
  Palette,
  Edit,
  Save,
  RotateCcw,
  Copy,
  Check,
  Server,
  Database
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  type: 'webapp' | 'website' | 'mobile' | 'wordpress-plugin' | 'wordpress-theme' | 'laravel';
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
  lastModified: string;
}

const PromptManager = () => {
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  
  const [prompts, setPrompts] = useState<PromptTemplate[]>([
    {
      id: '1',
      type: 'webapp',
      name: 'Web Application Generator',
      description: 'Generates React-based web applications with modern UI components',
      systemPrompt: 'You are an expert React developer. Create a modern, responsive web application using React, TypeScript, and Tailwind CSS. Follow best practices for component structure, state management, and user experience.',
      userPromptTemplate: 'Create a {app_type} web application with the following features: {features}. The application should be {style_preference} and include {additional_requirements}.',
      variables: ['app_type', 'features', 'style_preference', 'additional_requirements'],
      lastModified: '2024-01-15 14:30'
    },
    {
      id: '2',
      type: 'website',
      name: 'Static Website Generator',
      description: 'Creates static websites with HTML, CSS, and JavaScript',
      systemPrompt: 'You are a web developer specializing in static websites. Create clean, semantic HTML with modern CSS and vanilla JavaScript. Ensure the website is responsive and accessible.',
      userPromptTemplate: 'Build a {website_type} website for {business_type}. Include sections for {sections} with a {design_style} design approach. The target audience is {target_audience}.',
      variables: ['website_type', 'business_type', 'sections', 'design_style', 'target_audience'],
      lastModified: '2024-01-15 12:15'
    },
    {
      id: '3',
      type: 'mobile',
      name: 'Mobile App Generator',
      description: 'Generates React Native mobile applications',
      systemPrompt: 'You are a React Native expert. Create cross-platform mobile applications that work seamlessly on both iOS and Android. Focus on native performance and mobile-first UX patterns.',
      userPromptTemplate: 'Develop a {app_category} mobile app with {core_features}. The app should support {platforms} and have a {ui_style} interface. Include {integrations} integrations.',
      variables: ['app_category', 'core_features', 'platforms', 'ui_style', 'integrations'],
      lastModified: '2024-01-14 16:45'
    },
    {
      id: '4',
      type: 'wordpress-plugin',
      name: 'WordPress Plugin Generator',
      description: 'Creates custom WordPress plugins with PHP',
      systemPrompt: 'You are a WordPress plugin developer. Create secure, efficient plugins following WordPress coding standards. Ensure proper sanitization, validation, and hooks usage.',
      userPromptTemplate: 'Create a WordPress plugin for {plugin_purpose}. The plugin should have {functionality} features and integrate with {wordpress_features}. Include {admin_features} in the admin area.',
      variables: ['plugin_purpose', 'functionality', 'wordpress_features', 'admin_features'],
      lastModified: '2024-01-13 10:20'
    },
    {
      id: '5',
      type: 'wordpress-theme',
      name: 'WordPress Theme Generator',
      description: 'Builds custom WordPress themes with modern design',
      systemPrompt: 'You are a WordPress theme developer. Create responsive, SEO-optimized themes that follow WordPress theme development standards. Use modern CSS and JavaScript while maintaining compatibility.',
      userPromptTemplate: 'Design a WordPress theme for {site_type} with a {design_aesthetic} style. Include {page_templates} templates and support for {wordpress_features}. The theme should be {responsive_approach}.',
      variables: ['site_type', 'design_aesthetic', 'page_templates', 'wordpress_features', 'responsive_approach'],
      lastModified: '2024-01-12 09:10'
    },
    {
      id: '6',
      type: 'laravel',
      name: 'Laravel Application Generator',
      description: 'Creates enterprise-grade Laravel applications with modern PHP practices',
      systemPrompt: 'You are a Laravel expert developer. Create robust, scalable Laravel applications using Laravel 10+ with PHP 8.2+. Follow Laravel best practices, implement proper architecture patterns, use Eloquent ORM efficiently, and ensure security, performance, and maintainability. Include comprehensive error handling, validation, testing, and documentation.',
      userPromptTemplate: 'Build a {application_type} Laravel application for {business_domain}. Core features: {core_features}. Include {authentication_type} authentication, {database_features} database features, {api_requirements} API endpoints, and {integrations} integrations. The application should support {user_roles} user roles and include {admin_features} admin functionality.',
      variables: ['application_type', 'business_domain', 'core_features', 'authentication_type', 'database_features', 'api_requirements', 'integrations', 'user_roles', 'admin_features'],
      lastModified: '2024-01-21 15:45'
    },
    {
      id: '7',
      type: 'laravel',
      name: 'Laravel API Generator',
      description: 'Builds RESTful APIs with Laravel Sanctum/Passport authentication',
      systemPrompt: 'You are a Laravel API specialist. Create comprehensive RESTful APIs using Laravel with proper authentication (Sanctum/Passport), rate limiting, validation, error handling, and documentation. Implement API versioning, resource transformers, and follow RESTful conventions.',
      userPromptTemplate: 'Create a {api_type} REST API for {service_domain}. Endpoints needed: {endpoints}. Authentication: {auth_method}. Include {data_relationships} data relationships, {validation_rules} validation, {rate_limiting} rate limiting, and {documentation_type} API documentation.',
      variables: ['api_type', 'service_domain', 'endpoints', 'auth_method', 'data_relationships', 'validation_rules', 'rate_limiting', 'documentation_type'],
      lastModified: '2024-01-21 14:20'
    },
    {
      id: '8',
      type: 'laravel',
      name: 'Laravel E-commerce Platform',
      description: 'Generates complete e-commerce solutions with Laravel',
      systemPrompt: 'You are a Laravel e-commerce specialist. Create comprehensive e-commerce platforms with product management, order processing, payment integration, inventory management, and customer features. Include proper security, performance optimization, and scalable architecture.',
      userPromptTemplate: 'Build a {ecommerce_type} e-commerce platform for {market_segment}. Features: {product_features}, {order_management}, {payment_gateways}. Include {inventory_system} inventory management, {user_features} customer features, and {admin_capabilities} admin panel capabilities.',
      variables: ['ecommerce_type', 'market_segment', 'product_features', 'order_management', 'payment_gateways', 'inventory_system', 'user_features', 'admin_capabilities'],
      lastModified: '2024-01-21 13:15'
    }
  ]);

  const getTypeIcon = (type: PromptTemplate['type']) => {
    switch (type) {
      case 'webapp': return <Smartphone className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'wordpress-plugin': return <Code className="h-4 w-4" />;
      case 'wordpress-theme': return <Palette className="h-4 w-4" />;
      case 'laravel': return <Server className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: PromptTemplate['type']) => {
    switch (type) {
      case 'webapp': return 'Web Application';
      case 'website': return 'Static Website';
      case 'mobile': return 'Mobile App';
      case 'wordpress-plugin': return 'WordPress Plugin';
      case 'wordpress-theme': return 'WordPress Theme';
      case 'laravel': return 'Laravel Application';
    }
  };

  const getTypeColor = (type: PromptTemplate['type']) => {
    switch (type) {
      case 'webapp': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'website': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'mobile': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'wordpress-plugin': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'wordpress-theme': return 'bg-pink-500/10 text-pink-700 border-pink-200';
      case 'laravel': return 'bg-red-500/10 text-red-700 border-red-200';
    }
  };

  const handleCopyPrompt = async (promptId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPrompt(promptId);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleSavePrompt = (promptId: string, field: 'systemPrompt' | 'userPromptTemplate', value: string) => {
    setPrompts(prev => prev.map(prompt => 
      prompt.id === promptId 
        ? { 
            ...prompt, 
            [field]: value,
            lastModified: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }
        : prompt
    ));
    setEditingPrompt(null);
  };

  const filteredPrompts = (type: PromptTemplate['type']) => 
    prompts.filter(prompt => prompt.type === type);

  const renderPromptCard = (prompt: PromptTemplate) => (
    <Card key={prompt.id} className="bg-muted/30 border-primary/10 hover:border-primary/20 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              {getTypeIcon(prompt.type)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{prompt.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{prompt.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Last modified: {prompt.lastModified}
              </p>
            </div>
          </div>
          <Badge className={getTypeColor(prompt.type)}>
            {getTypeName(prompt.type)}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* System Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">System Prompt</label>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyPrompt(`${prompt.id}-system`, prompt.systemPrompt)}
                  className="hover:bg-primary/10"
                >
                  {copiedPrompt === `${prompt.id}-system` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPrompt(`${prompt.id}-system`)}
                  className="hover:bg-primary/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {editingPrompt === `${prompt.id}-system` ? (
              <div className="space-y-2">
                <Textarea
                  defaultValue={prompt.systemPrompt}
                  className="bg-background/50 min-h-20"
                  id={`system-${prompt.id}`}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const textarea = document.getElementById(`system-${prompt.id}`) as HTMLTextAreaElement;
                      handleSavePrompt(prompt.id, 'systemPrompt', textarea.value);
                    }}
                    className="gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPrompt(null)}
                    className="hover:bg-muted"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                <p className="text-sm text-foreground">{prompt.systemPrompt}</p>
              </div>
            )}
          </div>

          {/* User Prompt Template */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">User Prompt Template</label>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyPrompt(`${prompt.id}-user`, prompt.userPromptTemplate)}
                  className="hover:bg-primary/10"
                >
                  {copiedPrompt === `${prompt.id}-user` ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingPrompt(`${prompt.id}-user`)}
                  className="hover:bg-primary/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {editingPrompt === `${prompt.id}-user` ? (
              <div className="space-y-2">
                <Textarea
                  defaultValue={prompt.userPromptTemplate}
                  className="bg-background/50 min-h-16"
                  id={`user-${prompt.id}`}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const textarea = document.getElementById(`user-${prompt.id}`) as HTMLTextAreaElement;
                      handleSavePrompt(prompt.id, 'userPromptTemplate', textarea.value);
                    }}
                    className="gradient-primary text-primary-foreground hover:opacity-90"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPrompt(null)}
                    className="hover:bg-muted"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                <p className="text-sm text-foreground">{prompt.userPromptTemplate}</p>
              </div>
            )}
          </div>

          {/* Variables */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Template Variables</label>
            <div className="flex flex-wrap gap-2">
              {prompt.variables.map((variable, index) => (
                <Badge key={index} variant="outline" className="border-primary/20 text-xs">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Generation Prompts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="webapp" className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full bg-muted/50">
            <TabsTrigger value="webapp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              Web Apps
            </TabsTrigger>
            <TabsTrigger value="laravel" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              Laravel
            </TabsTrigger>
            <TabsTrigger value="website" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              Websites
            </TabsTrigger>
            <TabsTrigger value="mobile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              Mobile
            </TabsTrigger>
            <TabsTrigger value="wordpress-plugin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              WP Plugins
            </TabsTrigger>
            <TabsTrigger value="wordpress-theme" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
              WP Themes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webapp" className="space-y-4">
            {filteredPrompts('webapp').map(renderPromptCard)}
          </TabsContent>

          <TabsContent value="laravel" className="space-y-4">
            {filteredPrompts('laravel').map(renderPromptCard)}
          </TabsContent>

          <TabsContent value="website" className="space-y-4">
            {filteredPrompts('website').map(renderPromptCard)}
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            {filteredPrompts('mobile').map(renderPromptCard)}
          </TabsContent>

          <TabsContent value="wordpress-plugin" className="space-y-4">
            {filteredPrompts('wordpress-plugin').map(renderPromptCard)}
          </TabsContent>

          <TabsContent value="wordpress-theme" className="space-y-4">
            {filteredPrompts('wordpress-theme').map(renderPromptCard)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PromptManager;
