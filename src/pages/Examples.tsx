
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Globe, Smartphone, ShoppingCart, Calendar, MessageSquare, BarChart3 } from 'lucide-react';

const Examples = () => {
  const examples = [
    {
      id: 1,
      title: "E-commerce Store",
      description: "Modern online store with shopping cart, payment integration, and admin dashboard",
      image: "photo-1556742049-0cfed4f6a45d",
      category: "E-commerce",
      tech: ["React", "Stripe", "Tailwind"],
      icon: <ShoppingCart className="h-6 w-6" />,
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates and team features",
      image: "photo-1611224923853-80b023f02d71",
      category: "Productivity",
      tech: ["React", "WebSocket", "MongoDB"],
      icon: <Calendar className="h-6 w-6" />,
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 3,
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media management with data visualization",
      image: "photo-1460925895917-afdab827c52f",
      category: "Analytics",
      tech: ["React", "Chart.js", "API"],
      icon: <BarChart3 className="h-6 w-6" />,
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 4,
      title: "Real Estate Platform",
      description: "Property listing website with search, filters, and virtual tours",
      image: "photo-1560518883-ce09059eeffa",
      category: "Real Estate",
      tech: ["React", "Maps API", "Search"],
      icon: <Globe className="h-6 w-6" />,
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 5,
      title: "Chat Application",
      description: "Real-time messaging app with group chats, file sharing, and notifications",
      image: "photo-1577563908411-5077b6dc7624",
      category: "Communication",
      tech: ["React", "Socket.io", "Firebase"],
      icon: <MessageSquare className="h-6 w-6" />,
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 6,
      title: "Mobile Banking App",
      description: "Secure mobile banking interface with transactions and account management",
      image: "photo-1563013544-824ae1b704d3",
      category: "Finance",
      tech: ["React Native", "Security", "API"],
      icon: <Smartphone className="h-6 w-6" />,
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  const categories = ["All", "E-commerce", "Productivity", "Analytics", "Real Estate", "Communication", "Finance"];
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const filteredExamples = selectedCategory === "All" 
    ? examples 
    : examples.filter(example => example.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Inspiring
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Examples</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore real applications built with AI Builder Pro. See what's possible 
            and get inspired for your next project.
          </p>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-gradient-to-r from-blue-600 to-purple-600" : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExamples.map((example) => (
              <Card key={example.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${example.image}?auto=format&fit=crop&w=600&q=80`}
                    alt={example.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {example.category}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg text-white">
                      {example.icon}
                    </div>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                  </div>
                  <p className="text-gray-600 text-sm">{example.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {example.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Globe className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Own?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start creating amazing applications like these with AI Builder Pro today.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <ExternalLink className="h-5 w-5 mr-2" />
            Start Building Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Examples;
