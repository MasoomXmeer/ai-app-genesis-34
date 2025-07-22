
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Code, Zap, Settings, MessageSquare, FileCode, Bug, Gauge, Eye, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MessageSquare,
      title: "AI Builder Chat",
      description: "Interactive chat-based code generation with real-time feedback",
      href: "/ai-builder-chat",
      color: "text-blue-600"
    },
    {
      icon: FileCode,
      title: "Multi-File Generator",
      description: "Generate complete project structures with multiple files",
      href: "/multi-file-generator",
      color: "text-green-600"
    },
    {
      icon: Bug,
      title: "Smart Debugger",
      description: "AI-powered debugging and error resolution",
      href: "/smart-debugger",
      color: "text-red-600"
    },
    {
      icon: Gauge,
      title: "Code Optimizer",
      description: "Optimize and improve your code performance",
      href: "/code-optimizer",
      color: "text-orange-600"
    },
    {
      icon: Eye,
      title: "Visual to Code",
      description: "Convert designs and mockups to working code",
      href: "/visual-to-code",
      color: "text-purple-600"
    },
    {
      icon: Workflow,
      title: "Workflow Builder",
      description: "Create automated development workflows",
      href: "/workflow-builder",
      color: "text-indigo-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to AI Builder
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Build applications faster with AI-powered code generation, debugging, and optimization tools.
              Your personal AI development assistant.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/ai-builder">
                <Button size="lg" className="text-lg px-8">
                  <Brain className="mr-2 h-5 w-5" />
                  Start Building
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  <Settings className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Welcome Message */}
          {user && (
            <div className="mb-12">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Welcome back!</h3>
                      <p className="text-muted-foreground">
                        Ready to build something amazing? Choose a tool below to get started.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Try Now
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Multiple Frameworks</h3>
                <p className="text-muted-foreground">React, Laravel, Vue, and more</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Generate code in seconds</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">Advanced AI models at your service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
