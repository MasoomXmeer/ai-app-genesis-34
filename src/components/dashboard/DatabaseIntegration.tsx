import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Plus, 
  Settings, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  TestTube,
  Link,
  Trash2,
  Copy,
  RefreshCw
} from 'lucide-react';

interface DatabaseConfig {
  id: string;
  name: string;
  type: 'supabase' | 'mongodb' | 'firebase' | 'postgresql' | 'mysql';
  status: 'connected' | 'disconnected' | 'error';
  url?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  database?: string;
  lastConnected?: string;
  projects: number;
}

const DatabaseIntegration = () => {
  const { toast } = useToast();
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({});
  const [databases, setDatabases] = useState<DatabaseConfig[]>([
    {
      id: '1',
      name: 'Main Supabase',
      type: 'supabase',
      status: 'connected',
      url: 'https://abc123.supabase.co',
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      lastConnected: '2 minutes ago',
      projects: 12
    },
    {
      id: '2',
      name: 'MongoDB Atlas',
      type: 'mongodb',
      status: 'disconnected',
      url: 'mongodb+srv://cluster0.abc123.mongodb.net',
      username: 'admin',
      database: 'production',
      lastConnected: '1 day ago',
      projects: 5
    }
  ]);

  const [newDatabase, setNewDatabase] = useState<{
    name: string;
    type: 'supabase' | 'mongodb' | 'firebase' | 'postgresql' | 'mysql';
    url: string;
    apiKey: string;
    username: string;
    password: string;
    database: string;
  }>({
    name: '',
    type: 'supabase',
    url: '',
    apiKey: '',
    username: '',
    password: '',
    database: ''
  });

  const databaseTypes = [
    { id: 'supabase', name: 'Supabase', icon: '🟢', description: 'Real-time PostgreSQL database' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL document database' },
    { id: 'firebase', name: 'Firebase', icon: '🔥', description: 'Google\'s mobile platform' },
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', description: 'Open source relational database' },
    { id: 'mysql', name: 'MySQL', icon: '🐬', description: 'Popular relational database' }
  ];

  const handleAddDatabase = () => {
    if (!newDatabase.name || !newDatabase.url) {
      toast({
        title: "Error",
        description: "Please fill in the required fields",
        variant: "destructive"
      });
      return;
    }

    const database: DatabaseConfig = {
      id: Date.now().toString(),
      name: newDatabase.name,
      type: newDatabase.type,
      status: 'disconnected',
      url: newDatabase.url,
      apiKey: newDatabase.apiKey || undefined,
      username: newDatabase.username || undefined,
      password: newDatabase.password || undefined,
      database: newDatabase.database || undefined,
      projects: 0
    };

    setDatabases(prev => [...prev, database]);
    setNewDatabase({
      name: '',
      type: 'supabase',
      url: '',
      apiKey: '',
      username: '',
      password: '',
      database: ''
    });

    toast({
      title: "Database Added",
      description: "Database configuration has been saved successfully"
    });
  };

  const handleTestConnection = async (id: string) => {
    const database = databases.find(db => db.id === id);
    if (!database) return;

    // Simulate connection test
    setDatabases(prev => prev.map(db => 
      db.id === id ? { ...db, status: 'connected' as const, lastConnected: 'just now' } : db
    ));

    toast({
      title: "Connection Successful",
      description: `Successfully connected to ${database.name}`
    });
  };

  const handleDeleteDatabase = (id: string) => {
    setDatabases(prev => prev.filter(db => db.id !== id));
    toast({
      title: "Database Removed",
      description: "Database configuration has been deleted"
    });
  };

  const toggleCredentialVisibility = (id: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Disconnected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Integration</h2>
          <p className="text-gray-600">Connect and manage database integrations for your users</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Database
        </Button>
      </div>

      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connected">Connected Databases</TabsTrigger>
          <TabsTrigger value="add-new">Add New Database</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Connected Databases */}
        <TabsContent value="connected">
          <div className="space-y-4">
            {databases.map((database) => (
              <Card key={database.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Database className="h-8 w-8 text-gray-600" />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(database.status)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{database.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{database.type} Database</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(database.status)}
                          {database.lastConnected && (
                            <span className="text-xs text-gray-500">Last connected: {database.lastConnected}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{database.projects} projects</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestConnection(database.id)}
                      >
                        <TestTube className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCredentialVisibility(database.id)}
                      >
                        {showCredentials[database.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDatabase(database.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {showCredentials[database.id] && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-gray-500">Connection URL</Label>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{database.url}</p>
                        </div>
                        {database.apiKey && (
                          <div>
                            <Label className="text-xs text-gray-500">API Key</Label>
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded truncate">{database.apiKey}</p>
                          </div>
                        )}
                        {database.username && (
                          <div>
                            <Label className="text-xs text-gray-500">Username</Label>
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{database.username}</p>
                          </div>
                        )}
                        {database.database && (
                          <div>
                            <Label className="text-xs text-gray-500">Database Name</Label>
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{database.database}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {databases.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No databases connected</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first database integration</p>
                  <Button>Add Database</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Add New Database */}
        <TabsContent value="add-new">
          <Card>
            <CardHeader>
              <CardTitle>Add New Database Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Database Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production Database"
                    value={newDatabase.name}
                    onChange={(e) => setNewDatabase(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Database Type *</Label>
                  <select
                    id="type"
                    className="w-full p-2 border rounded-md"
                    value={newDatabase.type}
                    onChange={(e) => setNewDatabase(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    {databaseTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="url">Connection URL *</Label>
                <Input
                  id="url"
                  placeholder="e.g., https://abc123.supabase.co or mongodb+srv://..."
                  value={newDatabase.url}
                  onChange={(e) => setNewDatabase(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              {(newDatabase.type === 'supabase' || newDatabase.type === 'firebase') && (
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your API key"
                    value={newDatabase.apiKey}
                    onChange={(e) => setNewDatabase(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>
              )}

              {(newDatabase.type === 'mongodb' || newDatabase.type === 'postgresql' || newDatabase.type === 'mysql') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Database username"
                      value={newDatabase.username}
                      onChange={(e) => setNewDatabase(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Database password"
                      value={newDatabase.password}
                      onChange={(e) => setNewDatabase(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="database">Database Name</Label>
                <Input
                  id="database"
                  placeholder="Default database name (optional)"
                  value={newDatabase.database}
                  onChange={(e) => setNewDatabase(prev => ({ ...prev, database: e.target.value }))}
                />
              </div>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Test Connection</Button>
                <Button onClick={handleAddDatabase}>Add Database</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {databaseTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">{type.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                    <Button variant="outline" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseIntegration;