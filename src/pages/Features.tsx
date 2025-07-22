
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Code, 
  Palette, 
  Shield, 
  Globe, 
  Smartphone,
  Database,
  Layers,
  Workflow,
  Bot,
  Rocket,
  Star
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "Advanced AI Models",
      description: "Access to GPT-4, Claude, and other cutting-edge AI models for code generation, design, and content creation.",
      benefits: ["Natural language to code", "Intelligent debugging", "Automatic optimization"]
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Multi-Platform Development",
      description: "Build web applications, mobile apps, and WordPress plugins from a single unified interface.",
      benefits: ["React & Vue support", "Native mobile apps", "WordPress integration"]
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Design System Integration",
      description: "Beautiful, responsive designs with access to thousands of pre-built components and templates.",
      benefits: ["Tailwind CSS", "Component library", "Responsive by default"]
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Backend as a Service",
      description: "Integrated database, authentication, and API management without server configuration.",
      benefits: ["Real-time database", "User authentication", "API generation"]
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Version Control",
      description: "Built-in Git integration with branching, merging, and collaborative development features.",
      benefits: ["Git integration", "Branch management", "Team collaboration"]
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "One-Click Deployment",
      description: "Deploy to multiple platforms including Vercel, Netlify, and custom servers instantly.",
      benefits: ["Global CDN", "Custom domains", "SSL certificates"]
    }
  ];

  const additionalFeatures = [
    "Real-time collaborative editing",
    "Advanced debugging tools",
    "Performance monitoring",
    "SEO optimization",
    "Mobile-first design",
    "Accessibility compliance",
    "Security scanning",
    "Automatic backups",
    "API documentation",
    "Custom integrations"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Build Amazing Apps
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover all the powerful features that make AI Builder Pro the most advanced 
            platform for creating applications with artificial intelligence.
          </p>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">And Much More</h2>
            <p className="text-lg text-gray-600">
              We're constantly adding new features to help you build better applications faster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <Zap className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start building with AI Builder Pro today and see the difference.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Features;
