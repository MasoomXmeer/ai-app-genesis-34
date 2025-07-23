
import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { ProjectService, Project } from '@/services/supabase/ProjectService';
import { ChatService, ChatConversation } from '@/services/supabase/ChatService';
import { Plus, FolderOpen, MessageSquare, Calendar, Code, TrendingUp, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const projectService = new ProjectService();
  const chatService = new ChatService();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [projectsData, conversationsData] = await Promise.all([
        projectService.getUserProjects(),
        chatService.getUserConversations()
      ]);
      
      setProjects(projectsData || []);
      setConversations(conversationsData || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const recentProjects = projects.slice(0, 5);
  const recentConversations = conversations.slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI projects and conversations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <UserProfile />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Projects</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{projects.length}</p>
                    </div>
                    <FolderOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Projects</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activeProjects.length}</p>
                    </div>
                    <Code className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Conversations</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{conversations.length}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">This Week</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        {projects.filter(p => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(p.created_at) > weekAgo;
                        }).length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with AI-powered development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/ai-builder">
                    <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Zap className="h-6 w-6" />
                      <span>AI Builder</span>
                    </Button>
                  </Link>
                  <Link to="/ai-builder-chat">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <MessageSquare className="h-6 w-6" />
                      <span>AI Chat</span>
                    </Button>
                  </Link>
                  <Link to="/multi-file-generator">
                    <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                      <Code className="h-6 w-6" />
                      <span>Multi-File Generator</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Projects</CardTitle>
                  <Link to="/ai-builder">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Your latest AI-generated projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Link to="/ai-builder">
                      <Button>Create Your First Project</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary">{project.framework}</Badge>
                            <Badge variant="outline">{project.project_type}</Badge>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                              {project.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Conversations</CardTitle>
                  <Link to="/ai-builder-chat">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Chat
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Your latest AI conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentConversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No conversations yet</p>
                    <Link to="/ai-builder-chat">
                      <Button>Start Your First Chat</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentConversations.map((conversation) => (
                      <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{conversation.title}</h4>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(conversation.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">Continue</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
