
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamCollaboration from '@/components/dashboard/TeamCollaboration';
import APIKeyManagement from '@/components/dashboard/APIKeyManagement';
import DatabaseIntegration from '@/components/dashboard/DatabaseIntegration';
import DeploymentButton from '@/components/deployment/DeploymentButton';
import { 
  Plus, 
  Zap, 
  Globe, 
  Smartphone, 
  Code, 
  BarChart, 
  Clock, 
  Users,
  Settings,
  Key
} from 'lucide-react';

const Dashboard = () => {
  const recentProjects = [
    { name: "E-commerce Store", type: "Web App", status: "Building", progress: 75 },
    { name: "Portfolio Website", type: "Website", status: "Completed", progress: 100 },
    { name: "Task Manager", type: "Mobile App", status: "Building", progress: 45 },
    { name: "Blog Plugin", type: "WordPress", status: "Planning", progress: 15 }
  ];

  const quickStats = [
    { label: "Projects Created", value: "12", icon: <Code className="h-5 w-5" /> },
    { label: "Messages Used", value: "245/1000", icon: <Zap className="h-5 w-5" /> },
    { label: "Apps Deployed", value: "8", icon: <Globe className="h-5 w-5" /> },
    { label: "Team Members", value: "3", icon: <Users className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Let's build something amazing today.</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg text-white">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="databases">Databases</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recent Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.map((project, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <p className="text-sm text-gray-600">{project.type} • {project.status}</p>
                            <div className="mt-2">
                              <Progress value={project.progress} className="w-full h-2" />
                              <p className="text-xs text-gray-500 mt-1">{project.progress}% complete</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {project.status === "Completed" && (
                              <DeploymentButton 
                                projectData={{
                                  name: project.name,
                                  type: project.type,
                                  status: project.status,
                                  progress: project.progress
                                }}
                                variant="outline"
                                size="sm"
                              />
                            )}
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="h-4 w-4 mr-2" />
                      Build Website
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Create Mobile App
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="h-4 w-4 mr-2" />
                      WordPress Plugin
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart className="h-4 w-4 mr-2" />
                      Analytics Dashboard
                    </Button>
                  </CardContent>
                </Card>

                {/* Usage Stats */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Plan Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>AI Messages</span>
                          <span>245/1000</span>
                        </div>
                        <Progress value={24.5} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Storage</span>
                          <span>2.1GB/10GB</span>
                        </div>
                        <Progress value={21} />
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Upgrade Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <TeamCollaboration />
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <APIKeyManagement />
          </TabsContent>

          {/* Database Integration Tab */}
          <TabsContent value="databases">
            <DatabaseIntegration />
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Usage Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart className="h-12 w-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Period</span>
                      <span className="font-medium">Jan 1 - Jan 31</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>OpenAI GPT-4</span>
                          <span>1,245 requests</span>
                        </div>
                        <Progress value={62} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Claude</span>
                          <span>892 requests</span>
                        </div>
                        <Progress value={45} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Groq</span>
                          <span>567 requests</span>
                        </div>
                        <Progress value={28} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
