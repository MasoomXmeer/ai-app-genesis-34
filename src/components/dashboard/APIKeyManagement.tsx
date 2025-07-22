import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Key, Plus, Eye, EyeOff, Copy, Trash2, Settings } from 'lucide-react';

const APIKeyManagement = () => {
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [newKeyName, setNewKeyName] = useState('');

  const apiKeys = [
    {
      id: '1',
      name: 'Production Key',
      key: 'sk-proj-abc123...xyz789',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      usage: '1,245 requests',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'sk-proj-def456...uvw012',
      created: '2024-01-10',
      lastUsed: '5 minutes ago',
      usage: '892 requests',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Testing Key',
      key: 'sk-proj-ghi789...rst345',
      created: '2024-01-05',
      lastUsed: '1 day ago',
      usage: '234 requests',
      status: 'Limited'
    }
  ];

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '...' + key.substring(key.length - 6);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Create New API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New API Key
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                API Key Name
              </label>
              <Input 
                placeholder="e.g., Production Key, Development Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Description (Optional)
              </label>
              <Textarea 
                placeholder="Describe how this key will be used..."
                className="min-h-[80px]"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rate Limit
                </label>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="1000">1,000 requests/hour</option>
                  <option value="5000">5,000 requests/hour</option>
                  <option value="10000">10,000 requests/hour</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Expires
                </label>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
            <Button className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Your API Keys
            </div>
            <Badge variant="secondary">{apiKeys.length} keys</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{key.name}</h3>
                    <p className="text-sm text-gray-600">
                      Created {key.created} • Last used {key.lastUsed}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={key.status === 'Active' ? 'default' : 'secondary'}>
                      {key.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono flex-1">
                      {showKeys[key.id] ? key.key : maskKey(key.key)}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(key.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Usage: {key.usage}</span>
                  <Button variant="link" className="h-auto p-0 text-blue-600">
                    View Usage Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeyManagement;
