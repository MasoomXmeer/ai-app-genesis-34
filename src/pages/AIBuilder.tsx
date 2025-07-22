
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Code, 
  Globe, 
  Layers,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIBuilder = () => {
  const navigate = useNavigate();

  const generationTypes = [
    {
      type: 'app',
      icon: <Code className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Web Applications',
      description: 'Create modern React, Vue, or Angular applications with full functionality',
      features: ['Component-based architecture', 'State management', 'API integration', 'Responsive design'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'website',
      icon: <Globe className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'Websites',  
      description: 'Build professional websites, landing pages, and portfolios',
      features: ['SEO optimization', 'Mobile-first design', 'Contact forms', 'Performance optimized'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'wordpress',
      icon: <Layers className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: 'WordPress Solutions',
      description: 'Generate custom WordPress themes, plugins, and complete solutions',
      features: ['Custom post types', 'Admin integration', 'Security best practices', 'Plugin architecture'],
      color: 'from-purple-500 to-violet-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Builder Studio
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 px-4">
            Chat with AI to build complete applications, websites, and WordPress solutions. 
            Code optimization integrated directly into the conversation.
          </p>
          
          <Button 
            size="lg" 
            className="gradient-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto"
            onClick={() => navigate('/ai-builder-chat')}
          >
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Start Building with AI
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          </Button>
        </div>

        {/* Generation Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {generationTypes.map((type, index) => (
            <Card key={index} className="relative overflow-hidden border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5`} />
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-4`}>
                  {type.icon}
                </div>
                <CardTitle className="text-lg sm:text-xl">{type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs sm:text-sm">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Real-time AI Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Converse naturally with AI while it builds your project. Watch code generate 
                in real-time as you refine your requirements through conversation.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  <span>Live code streaming</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  <span>Interactive refinement</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                  <span>Integrated optimization</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                Built-in Code Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                Code optimization is seamlessly integrated into the chat experience. 
                Get performance improvements, bundle size reduction, and best practices automatically.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                  <span>Performance analysis</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                  <span>Bundle optimization</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2" />
                  <span>Security hardening</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Restrictions */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              Plan Features & API Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="bg-gray-500/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Free Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Basic AI models with platform API keys
                </p>
                <Badge variant="outline" className="text-xs">Platform APIs Only</Badge>
              </div>

              <div className="text-center">
                <div className="bg-blue-500/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Pro Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Advanced AI models with platform API keys
                </p>
                <Badge variant="outline" className="text-xs">Platform APIs Only</Badge>
              </div>

              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="bg-purple-500/10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Enterprise Plan</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  Full access with your own API keys
                </p>
                <Badge className="bg-purple-500 text-white text-xs">Custom API Keys</Badge>
              </div>
            </div>
            
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Only Enterprise plan users can configure their own OpenAI, Anthropic, or other AI provider API keys
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base px-4">
            Join thousands of developers using AI to accelerate their development workflow
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg"
              className="gradient-primary text-primary-foreground hover:opacity-90 w-full sm:w-auto"
              onClick={() => navigate('/ai-builder-chat')}
            >
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Start Chat Builder
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/pricing')} className="w-full sm:w-auto">
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBuilder;
