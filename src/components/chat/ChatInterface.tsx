
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Code, 
  Globe, 
  Layers,
  Sparkles,
  Copy,
  Download,
  Play,
  Settings,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  generationType?: 'app' | 'website' | 'wordpress';
  codeBlocks?: Array<{
    language: string;
    code: string;
    filename?: string;
  }>;
  isGenerating?: boolean;
  progress?: number;
}

interface ChatInterfaceProps {
  onCodeGenerated?: (code: string, type: string) => void;
  userPlan?: 'free' | 'pro' | 'enterprise';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCodeGenerated, userPlan = 'free' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: "👋 Welcome to AI Builder! I can help you create:\n\n🚀 **Web Applications** - React, Vue, Angular apps\n🌐 **Websites** - Landing pages, portfolios, business sites\n📝 **WordPress** - Themes, plugins, custom solutions\n\nWhat would you like to build today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'app' | 'website' | 'wordpress'>('app');
  const [framework, setFramework] = useState('react');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      generationType
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    // Add generating message
    const generatingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `Creating your ${generationType} with ${framework}...`,
      timestamp: new Date(),
      isGenerating: true,
      progress: 0
    };

    setMessages(prev => [...prev, generatingMessage]);

    // Simulate AI response with progress
    await simulateAIGeneration(userMessage, generatingMessage.id);
  };

  const simulateAIGeneration = async (userMessage: Message, generatingId: string) => {
    const stages = [
      { progress: 15, message: '🔍 Analyzing your requirements...' },
      { progress: 30, message: '🏗️ Planning project structure...' },
      { progress: 45, message: '⚙️ Generating core components...' },
      { progress: 60, message: '🎨 Creating user interface...' },
      { progress: 75, message: '🔧 Optimizing performance...' },
      { progress: 90, message: '✨ Adding final touches...' },
      { progress: 100, message: '✅ Generation complete!' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessages(prev => prev.map(msg => 
        msg.id === generatingId 
          ? { ...msg, content: stage.message, progress: stage.progress }
          : msg
      ));
    }

    // Generate final response
    const finalResponse = generateResponse(userMessage);
    
    setMessages(prev => prev.map(msg => 
      msg.id === generatingId 
        ? finalResponse
        : msg
    ));

    setIsGenerating(false);
  };

  const generateResponse = (userMessage: Message): Message => {
    const { generationType } = userMessage;
    
    let codeBlocks = [];
    let responseContent = '';

    if (generationType === 'app') {
      responseContent = `🚀 **React Application Generated!**

I've created a modern React application based on your requirements. Here's what I've built:

✅ **Components Created:**
- Main App component with routing
- Dashboard with interactive elements  
- User authentication system
- Responsive navigation

✅ **Features Included:**
- Modern UI with Tailwind CSS
- State management with React hooks
- Form validation and error handling
- Mobile-responsive design

✅ **Performance Optimizations:**  
- Code splitting implemented
- Lazy loading for components
- Optimized bundle size
- SEO-friendly structure`;

      codeBlocks = [
        {
          language: 'tsx',
          filename: 'App.tsx',
          code: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;`
        },
        {
          language: 'tsx',
          filename: 'components/Dashboard.tsx',
          code: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Dashboard = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Interactive Counter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setCount(count - 1)}>-</Button>
            <span className="text-2xl font-bold">{count}</span>
            <Button onClick={() => setCount(count + 1)}>+</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};`
        }
      ];
    } else if (generationType === 'website') {
      responseContent = `🌐 **Website Generated!**

I've created a professional website with modern design and functionality:

✅ **Pages Created:**
- Landing page with hero section
- About page with team info
- Services/Features showcase
- Contact form with validation

✅ **Design Features:**
- Responsive mobile-first design
- Smooth animations and transitions
- Professional color scheme
- Optimized images and content

✅ **SEO Optimizations:**
- Meta tags and descriptions
- Structured data markup
- Fast loading performance
- Accessibility compliance`;

      codeBlocks = [
        {
          language: 'tsx',
          filename: 'pages/Landing.tsx',
          code: `import React from 'react';
import { Button } from '@/components/ui/button';

export const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Transform your ideas into reality with our cutting-edge solutions.
          </p>
          <Button size="lg" variant="secondary">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Feature {item}</h3>
                <p className="text-muted-foreground">
                  Amazing feature description that explains the value.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};`
        }
      ];
    } else if (generationType === 'wordpress') {
      responseContent = `📝 **WordPress Theme Generated!**

I've created a custom WordPress theme with modern PHP and WordPress best practices:

✅ **Theme Structure:**
- Custom post types and fields
- Responsive theme design
- Admin panel integration
- Widget and menu support

✅ **Features Included:**
- Custom blocks for Gutenberg
- SEO optimization
- Performance enhancements
- Security best practices

✅ **PHP Code Quality:**
- WordPress coding standards
- Proper sanitization and validation
- Hooks and filters implementation
- Translation ready`;

      codeBlocks = [
        {
          language: 'php',
          filename: 'functions.php',
          code: `<?php
/**
 * Theme functions and definitions
 */

// Theme setup
function theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'textdomain'),
        'footer' => __('Footer Menu', 'textdomain'),
    ));
}
add_action('after_setup_theme', 'theme_setup');

// Enqueue scripts and styles
function theme_scripts() {
    wp_enqueue_style('theme-style', get_stylesheet_uri());
    wp_enqueue_script('theme-script', get_template_directory_uri() . '/js/main.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'theme_scripts');

// Custom post type
function create_custom_post_type() {
    register_post_type('portfolio',
        array(
            'labels' => array(
                'name' => __('Portfolio'),
                'singular_name' => __('Portfolio Item')
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'thumbnail')
        )
    );
}
add_action('init', 'create_custom_post_type');
?>`
        },
        {
          language: 'php',
          filename: 'index.php',
          code: `<?php get_header(); ?>

<main class="container mx-auto px-4 py-8">
    <?php if (have_posts()) : ?>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php while (have_posts()) : the_post(); ?>
                <article class="bg-white rounded-lg shadow-md overflow-hidden">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="aspect-video">
                            <?php the_post_thumbnail('medium', array('class' => 'w-full h-full object-cover')); ?>
                        </div>
                    <?php endif; ?>
                    
                    <div class="p-6">
                        <h2 class="text-xl font-bold mb-2">
                            <a href="<?php the_permalink(); ?>" class="hover:text-primary transition-colors">
                                <?php the_title(); ?>
                            </a>
                        </h2>
                        <div class="text-gray-600 mb-4">
                            <?php the_excerpt(); ?>
                        </div>
                        <a href="<?php the_permalink(); ?>" class="inline-flex items-center text-primary hover:underline">
                            Read More →
                        </a>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
        
        <?php the_posts_pagination(); ?>
    <?php else : ?>
        <p class="text-center text-gray-600">No posts found.</p>
    <?php endif; ?>
</main>

<?php get_footer(); ?>`
        }
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: responseContent,
      timestamp: new Date(),
      codeBlocks,
      isGenerating: false
    };
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getGenerationIcon = (type: string) => {
    switch (type) {
      case 'app': return <Code className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      case 'wordpress': return <Layers className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Generation Type Selector */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={generationType} onValueChange={(value: any) => setGenerationType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="app">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Web App
                  </div>
                </SelectItem>
                <SelectItem value="website">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </div>
                </SelectItem>
                <SelectItem value="wordpress">
                  <div className="flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    WordPress
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {(generationType === 'app' || generationType === 'website') && (
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="vanilla">Vanilla</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Badge variant="outline" className="flex items-center">
            {getGenerationIcon(generationType)}
            <span className="ml-1 capitalize">{generationType}</span>
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.type === 'system'
                      ? 'bg-muted'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <Card className={`${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <CardContent className="p-3">
                      {message.isGenerating ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>{message.content}</span>
                          </div>
                          {message.progress !== undefined && (
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${message.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                      
                      {message.codeBlocks && message.codeBlocks.map((block, index) => (
                        <div key={index} className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{block.filename || `${block.language} code`}</span>
                            <Button variant="ghost" size="sm" onClick={() => copyCode(block.code)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                <div className="text-xs text-muted-foreground mt-1 px-10">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Describe your ${generationType} idea...`}
            className="flex-1 min-h-[60px] resize-none"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputValue.trim() || isGenerating}
            size="lg"
            className="px-6"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {userPlan !== 'enterprise' && (
          <div className="text-xs text-muted-foreground mt-2 text-center">
            Custom API keys are available in Enterprise plan only
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
