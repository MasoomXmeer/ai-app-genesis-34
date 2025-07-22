
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, Plus, Settings, Mail, Crown, Shield, Eye } from 'lucide-react';

const TeamCollaboration = () => {
  const teamMembers = [
    { 
      name: "John Doe", 
      email: "john@company.com", 
      role: "Owner", 
      avatar: "", 
      status: "Active",
      lastActive: "2 hours ago"
    },
    { 
      name: "Jane Smith", 
      email: "jane@company.com", 
      role: "Admin", 
      avatar: "", 
      status: "Active",
      lastActive: "5 minutes ago"
    },
    { 
      name: "Bob Johnson", 
      email: "bob@company.com", 
      role: "Developer", 
      avatar: "", 
      status: "Active",
      lastActive: "1 day ago"
    },
    { 
      name: "Alice Brown", 
      email: "alice@company.com", 
      role: "Viewer", 
      avatar: "", 
      status: "Pending",
      lastActive: "Never"
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'Admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'Developer':
        return <Settings className="h-4 w-4 text-green-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Owner':
        return 'default';
      case 'Admin':
        return 'secondary';
      case 'Developer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Team Members
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Invite Section */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Invite New Member</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter email address" 
              className="flex-1"
            />
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="viewer">Viewer</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
            <Button size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Send Invite
            </Button>
          </div>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500">Last active: {member.lastActive}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {getRoleIcon(member.role)}
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                </div>
                <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                  {member.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Role Permissions Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Owner</span>
              </div>
              <p className="text-gray-600">Full access including billing and team management</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Admin</span>
              </div>
              <p className="text-gray-600">Manage projects, invite members, configure settings</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Settings className="h-4 w-4 text-green-500" />
                <span className="font-medium">Developer</span>
              </div>
              <p className="text-gray-600">Create and edit projects, use AI features</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Eye className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Viewer</span>
              </div>
              <p className="text-gray-600">View projects and documentation only</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCollaboration;
