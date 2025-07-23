
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentGatewayConfig from '@/components/admin/PaymentGatewayConfig';
import GenerationManager from '@/components/admin/GenerationManager';
import PromptManager from '@/components/admin/PromptManager';
import SystemSettings from '@/components/admin/SystemSettings';
import FeatureToggleManager from '@/components/admin/FeatureToggleManager';
import EnvironmentVariables from '@/components/admin/EnvironmentVariables';
import DeploymentSettings from '@/components/admin/DeploymentSettings';
import { ContextCacheManager } from '@/components/admin/ContextCacheManager';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings, 
  Users, 
  CreditCard, 
  Key, 
  Database, 
  BarChart, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Brain,
  MessageSquare,
  Code
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  projects_count: number;
  conversations_count: number;
  status: 'active' | 'inactive';
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  framework: string;
  project_type: string;
  status: string;
  created_at: string;
  user_email: string;
}

interface StatsData {
  total_users: number;
  total_projects: number;
  total_conversations: number;
  active_users: number;
  total_api_keys: number;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    total_users: 0,
    total_projects: 0,
    total_conversations: 0,
    active_users: 0,
    total_api_keys: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at');

      if (usersError) throw usersError;

      // Load projects count per user
      const { data: projectCounts, error: projectCountError } = await supabase
        .from('projects')
        .select('user_id');

      if (projectCountError) throw projectCountError;

      // Load conversations count per user
      const { data: conversationCounts, error: conversationCountError } = await supabase
        .from('chat_conversations')
        .select('user_id');

      if (conversationCountError) throw conversationCountError;

      // Process user data with counts
      const transformedUsers: UserData[] = usersData?.map(user => {
        const userProjectCount = projectCounts?.filter(p => p.user_id === user.id).length || 0;
        const userConversationCount = conversationCounts?.filter(c => c.user_id === user.id).length || 0;
        
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name || user.email,
          created_at: user.created_at,
          projects_count: userProjectCount,
          conversations_count: userConversationCount,
          status: 'active' as const
        };
      }) || [];

      setUsers(transformedUsers);

      // Load projects with user info
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          description,
          framework,
          project_type,
          status,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const transformedProjects: ProjectData[] = projectsData?.map(project => {
        const projectUser = usersData?.find(u => u.id === project.user_id);
        return {
          id: project.id,
          name: project.name,
          description: project.description || '',
          framework: project.framework,
          project_type: project.project_type,
          status: project.status,
          created_at: project.created_at,
          user_email: projectUser?.email || 'Unknown'
        };
      }) || [];

      setProjects(transformedProjects);

      // Load statistics
      const [
        { count: totalUsers },
        { count: totalProjects },
        { count: totalConversations },
        { count: totalApiKeys }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('chat_conversations').select('*', { count: 'exact', head: true }),
        supabase.from('user_api_keys').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        total_users: totalUsers || 0,
        total_projects: totalProjects || 0,
        total_conversations: totalConversations || 0,
        active_users: transformedUsers.length,
        total_api_keys: totalApiKeys || 0
      });

    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      await loadAdminData();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      await loadAdminData();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-accent/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-accent/10 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your AI Builder platform</p>
          </div>
          <Button className="gradient-primary text-primary-foreground hover:opacity-90">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_users}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_projects}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Code className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversations</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_conversations}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Keys</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total_api_keys}</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Key className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.active_users}</p>
                </div>
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <Brain className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid grid-cols-12 w-full max-w-7xl bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Projects</TabsTrigger>
            <TabsTrigger value="context-cache" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Context</TabsTrigger>
            <TabsTrigger value="generation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Generation</TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Prompts</TabsTrigger>
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">API Keys</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Payments</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">System</TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Features</TabsTrigger>
            <TabsTrigger value="deployment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Deployment</TabsTrigger>
            <TabsTrigger value="environment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Environment</TabsTrigger>
          </TabsList>

          {/* Real Users Management */}
          <TabsContent value="users">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    User Management ({users.length} users)
                  </div>
                  <div className="flex space-x-2">
                    <Input placeholder="Search users..." className="w-64 bg-background/50" />
                    <Button onClick={loadAdminData} variant="outline">
                      Refresh
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{user.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {user.projects_count} projects
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.conversations_count} conversations
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real Projects Management */}
          <TabsContent value="projects">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-primary" />
                    Project Management ({projects.length} projects)
                  </div>
                  <Button onClick={loadAdminData} variant="outline">
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="border-primary/20">{project.framework}</Badge>
                          <Badge variant="secondary">{project.project_type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            by {project.user_email}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={project.status === "active" ? "default" : "secondary"} className={project.status === "active" ? "bg-primary text-primary-foreground" : ""}>
                          {project.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context-cache">
            <ContextCacheManager />
          </TabsContent>

          <TabsContent value="generation">
            <GenerationManager />
          </TabsContent>

          <TabsContent value="prompts">
            <PromptManager />
          </TabsContent>

          <TabsContent value="api-keys">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-primary" />
                    API Provider Management
                  </div>
                  <Button className="gradient-primary text-primary-foreground hover:opacity-90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Provider
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">API provider management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <PaymentGatewayConfig />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">System monitoring coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="features">
            <FeatureToggleManager />
          </TabsContent>

          <TabsContent value="deployment">
            <DeploymentSettings />
          </TabsContent>

          <TabsContent value="environment">
            <EnvironmentVariables />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
