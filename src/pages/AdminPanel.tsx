import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useToast } from '@/hooks/use-toast';
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
  Code,
  RefreshCw,
  AlertCircle
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
  const { toast } = useToast();
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
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Users error:', usersError);
        throw new Error('Failed to load users');
      }

      // Load projects count per user
      const { data: projectCounts, error: projectCountError } = await supabase
        .from('projects')
        .select('user_id');

      if (projectCountError) {
        console.error('Project counts error:', projectCountError);
        throw new Error('Failed to load project counts');
      }

      // Load conversations count per user
      const { data: conversationCounts, error: conversationCountError } = await supabase
        .from('chat_conversations')
        .select('user_id');

      if (conversationCountError) {
        console.error('Conversation counts error:', conversationCountError);
        throw new Error('Failed to load conversation counts');
      }

      // Process user data with counts
      const transformedUsers: UserData[] = (usersData || []).map(user => {
        const userProjectCount = projectCounts?.filter(p => p.user_id === user.id).length || 0;
        const userConversationCount = conversationCounts?.filter(c => c.user_id === user.id).length || 0;
        
        return {
          id: user.id,
          email: user.email || 'No email',
          full_name: user.full_name || user.email || 'Unknown User',
          created_at: user.created_at,
          projects_count: userProjectCount,
          conversations_count: userConversationCount,
          status: 'active' as const
        };
      });

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

      if (projectsError) {
        console.error('Projects error:', projectsError);
        throw new Error('Failed to load projects');
      }

      const transformedProjects: ProjectData[] = (projectsData || []).map(project => {
        const projectUser = usersData?.find(u => u.id === project.user_id);
        return {
          id: project.id,
          name: project.name || 'Untitled Project',
          description: project.description || 'No description',
          framework: project.framework || 'react',
          project_type: project.project_type || 'webapp',
          status: project.status || 'active',
          created_at: project.created_at,
          user_email: projectUser?.email || 'Unknown User'
        };
      });

      setProjects(transformedProjects);

      // Load statistics
      const statsPromises = [
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('chat_conversations').select('*', { count: 'exact', head: true }),
        supabase.from('user_api_keys').select('*', { count: 'exact', head: true })
      ];

      const [
        { count: totalUsers },
        { count: totalProjects },
        { count: totalConversations },
        { count: totalApiKeys }
      ] = await Promise.all(statsPromises);

      setStats({
        total_users: totalUsers || 0,
        total_projects: totalProjects || 0,
        total_conversations: totalConversations || 0,
        active_users: transformedUsers.filter(u => u.status === 'active').length,
        total_api_keys: totalApiKeys || 0
      });

      toast({
        title: "Admin Data Loaded",
        description: "Successfully loaded all admin panel data",
      });

    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load admin data');
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
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
      
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted",
      });
      
      await loadAdminData();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast({
        title: "Project Deleted",
        description: "Project has been successfully deleted",
      });
      
      await loadAdminData();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading admin data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={loadAdminData} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your AI Builder Pro platform</p>
          </div>
          <Button onClick={loadAdminData} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
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

          <Card className="hover:shadow-md transition-shadow">
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

          <Card className="hover:shadow-md transition-shadow">
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

          <Card className="hover:shadow-md transition-shadow">
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

          <Card className="hover:shadow-md transition-shadow">
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
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="context-cache">Context</TabsTrigger>
            <TabsTrigger value="generation">Generation</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    User Management ({filteredUsers.length} users)
                  </div>
                  <Input 
                    placeholder="Search users..." 
                    className="w-full sm:w-64" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border hover:border-primary/20 transition-colors gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{user.full_name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
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
                        <Badge variant="default">
                          {user.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
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

          {/* Projects Management */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-primary" />
                    Project Management ({filteredProjects.length} projects)
                  </div>
                  <Input 
                    placeholder="Search projects..." 
                    className="w-full sm:w-64" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border hover:border-primary/20 transition-colors gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{project.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <Badge variant="outline">{project.framework}</Badge>
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
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-primary" />
                    API Provider Management
                  </div>
                  <Button>
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
              <Card>
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

              <Card>
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
