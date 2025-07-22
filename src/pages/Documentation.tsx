
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Book, 
  Search, 
  Code, 
  Zap, 
  Globe, 
  Smartphone,
  Database,
  Shield,
  Rocket,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const Documentation = () => {
  const docSections = [
    {
      title: "Getting Started",
      icon: <Rocket className="h-6 w-6" />,
      description: "Quick start guide and basic concepts",
      articles: [
        "Introduction to AI Builder Pro",
        "Creating Your First Project",
        "Understanding the Interface",
        "Basic AI Commands"
      ]
    },
    {
      title: "AI Features",
      icon: <Zap className="h-6 w-6" />,
      description: "Learn how to leverage AI for development",
      articles: [
        "Natural Language to Code",
        "AI-Powered Design Generation",
        "Smart Code Completion",
        "Automated Testing"
      ]
    },
    {
      title: "Web Development",
      icon: <Globe className="h-6 w-6" />,
      description: "Building responsive web applications",
      articles: [
        "React Component Generation",
        "Responsive Design Patterns",
        "State Management",
        "API Integration"
      ]
    },
    {
      title: "Mobile Development",
      icon: <Smartphone className="h-6 w-6" />,
      description: "Creating native mobile applications",
      articles: [
        "React Native Setup",
        "Cross-Platform Components",
        "Device Features Access",
        "App Store Deployment"
      ]
    },
    {
      title: "Database & Backend",
      icon: <Database className="h-6 w-6" />,
      description: "Backend services and data management",
      articles: [
        "Database Schema Design",
        "Authentication Setup",
        "API Endpoints",
        "Real-time Data"
      ]
    },
    {
      title: "Security",
      icon: <Shield className="h-6 w-6" />,
      description: "Security best practices and implementation",
      articles: [
        "Authentication & Authorization",
        "Data Encryption",
        "Security Audits",
        "Compliance Guidelines"
      ]
    }
  ];

  const quickLinks = [
    { title: "API Reference", url: "#", icon: <Code className="h-4 w-4" /> },
    { title: "Video Tutorials", url: "#", icon: <ExternalLink className="h-4 w-4" /> },
    { title: "Community Forum", url: "#", icon: <ExternalLink className="h-4 w-4" /> },
    { title: "GitHub Repository", url: "#", icon: <ExternalLink className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Everything you need to know to build amazing applications with AI Builder Pro. 
            From getting started to advanced features.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search documentation..."
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Documentation Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {docSections.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg text-white">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="text-sm text-gray-600">{section.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.articles.map((article, idx) => (
                        <li key={idx}>
                          <a href="#" className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors">
                            <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Popular Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "How to Build a Full-Stack App in 10 Minutes",
                    "AI-Powered Code Generation Best Practices",
                    "Deploying Your App to Production",
                    "Setting Up Authentication with Social Providers",
                    "Creating Responsive Mobile Apps"
                  ].map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="text-gray-700">{article}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {link.icon}
                      <span className="ml-2">{link.title}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Discord
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
              </CardContent>
            </Card>

            {/* Latest Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Latest Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">v2.1.0 Released</div>
                    <div className="text-gray-600">New AI models and improved performance</div>
                    <div className="text-xs text-gray-500 mt-1">2 days ago</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mobile SDK Update</div>
                    <div className="text-gray-600">Enhanced React Native support</div>
                    <div className="text-xs text-gray-500 mt-1">1 week ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
