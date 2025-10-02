'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Badge } from '@workspace/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  User,
  Mail,
  Shield,
  Building,
  Calendar,
  Activity,
  Save,
  ArrowLeft
} from 'lucide-react';
import { UserRole } from '@workspace/database';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  badge?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  reports?: any[];
  assignedReports?: any[];
  cases?: any[];
  notifications?: any[];
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    badge: '',
    department: ''
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user');

      const data = await response.json();
      setUserData(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        role: data.role || '',
        badge: data.badge || '',
        department: data.department || ''
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update user');

      toast.success('User updated successfully');
      setEditing(false);
      fetchUser();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleToggleStatus = async () => {
    if (!userData) return;

    try {
      const endpoint = userData.isActive ? `/api/users/${userId}` : `/api/users/${userId}/activate`;
      const method = userData.isActive ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`User ${userData.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUser();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Activity className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-gray-400" />
        <p className="text-gray-500 mt-4">User not found</p>
        <Button onClick={() => router.push('/dashboard/users')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/users')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600 mt-1">{userData.email}</p>
          </div>
          <Badge variant={userData.isActive ? 'default' : 'destructive'}>
            {userData.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleToggleStatus}>
                {userData.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reports">Reports ({userData.reports?.length || 0})</TabsTrigger>
          <TabsTrigger value="cases">Cases ({userData.cases?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Manage user profile and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {editing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    ) : (
                      <span>{userData.name}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {editing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <span>{userData.email}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    {editing ? (
                      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[9999]">
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.OFFICER}>Officer</SelectItem>
                          <SelectItem value={UserRole.ANALYST}>Analyst</SelectItem>
                          <SelectItem value={UserRole.PROSECUTOR}>Prosecutor</SelectItem>
                          <SelectItem value={UserRole.CITIZEN}>Citizen</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge>{userData.role}</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge">Badge Number</Label>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    {editing ? (
                      <Input
                        id="badge"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      />
                    ) : (
                      <span>{userData.badge || 'N/A'}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    {editing ? (
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                    ) : (
                      <span>{userData.department || 'N/A'}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {userData.lastLogin
                        ? new Date(userData.lastLogin).toLocaleString()
                        : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <Badge variant={userData.isActive ? 'default' : 'destructive'}>
                      {userData.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User activity and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Activity tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Reports created or assigned to this user</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.reports && userData.reports.length > 0 ? (
                <div className="space-y-2">
                  {userData.reports.map((report: any) => (
                    <div
                      key={report.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                    >
                      <p className="font-medium">{report.title}</p>
                      <p className="text-sm text-gray-500">{report.reportNumber}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reports found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>Cases</CardTitle>
              <CardDescription>Cases owned or assigned to this user</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.cases && userData.cases.length > 0 ? (
                <div className="space-y-2">
                  {userData.cases.map((caseItem: any) => (
                    <div
                      key={caseItem.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
                    >
                      <p className="font-medium">{caseItem.title}</p>
                      <p className="text-sm text-gray-500">{caseItem.caseNumber}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No cases found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
