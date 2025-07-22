
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/common/SearchBar';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Building Your First AI-Powered Application",
    excerpt: "Learn how to leverage AI Builder Pro to create intelligent applications that adapt to user needs.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Tutorial",
    tags: ["AI", "Getting Started", "Tutorial"]
  },
  {
    id: 2,
    title: "Advanced AI Model Integration Techniques",
    excerpt: "Explore advanced techniques for integrating multiple AI models into your applications for enhanced functionality.",
    author: "Mike Chen",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Advanced",
    tags: ["AI Models", "Integration", "Advanced"]
  },
  {
    id: 3,
    title: "Optimizing Performance in AI Applications",
    excerpt: "Best practices for ensuring your AI-powered applications run efficiently at scale.",
    author: "Emma Davis",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Performance",
    tags: ["Performance", "Optimization", "Best Practices"]
  },
  {
    id: 4,
    title: "Security Considerations for AI Applications",
    excerpt: "Essential security practices when building applications with AI Builder Pro.",
    author: "David Wilson",
    date: "2024-01-01",
    readTime: "7 min read",
    category: "Security",
    tags: ["Security", "Best Practices", "AI"]
  }
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tutorial', 'Advanced', 'Performance', 'Security'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            AI Builder Pro
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Blog & Resources
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Stay updated with the latest AI development trends, tutorials, and best practices.
          </p>
          
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search articles..."
            className="max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Blog Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="group/btn">
                      Read more
                      <ArrowRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
