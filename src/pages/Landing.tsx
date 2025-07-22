
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Code, Palette, Shield, Globe, Smartphone } from 'lucide-react';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';

const Landing = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Generation",
      description: "Transform ideas into fully functional applications using advanced AI models"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Multi-Platform Support",
      description: "Build web apps, mobile apps, and WordPress plugins from a single interface"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Beautiful UI Components",
      description: "Access thousands of pre-built, customizable components and templates"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Built-in security features and compliance with industry standards"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Deployment",
      description: "Deploy your applications worldwide with one-click deployment"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Responsive Design",
      description: "Automatically optimized for all devices and screen sizes"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Build Apps with
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
              AI Superpowers
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The most advanced AI-powered platform for building applications, websites, and WordPress plugins. 
            Transform your ideas into reality in minutes, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 text-lg px-8 py-4">
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/5">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to build amazing apps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From concept to deployment, our platform provides all the tools and AI assistance you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-card hover:bg-accent/5 group">
                <CardContent className="p-0">
                  <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">10K+</div>
              <div className="text-primary-foreground/80">Apps Built</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">50+</div>
              <div className="text-primary-foreground/80">AI Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">99.9%</div>
              <div className="text-primary-foreground/80">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">24/7</div>
              <div className="text-primary-foreground/80">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to build the next big thing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who are already building amazing applications with AI Builder Pro
          </p>
          <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 text-lg px-8 py-4">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
