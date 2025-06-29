'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Wrench, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { User, MaintenanceRequest } from '@/types';
import { getMaintenanceRequestsByUser } from '@/lib/data';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

export default function ResidentMaintenancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userMaintenance, setUserMaintenance] = useState<MaintenanceRequest[]>([]);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'emergency'
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'resident') {
        setUser(parsedUser);
        const maintenance = getMaintenanceRequestsByUser(parsedUser.id);
        setUserMaintenance(maintenance);
      } else {
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const pendingRequests = userMaintenance.filter(mr => mr.status === 'pending');
  const inProgressRequests = userMaintenance.filter(mr => mr.status === 'in-progress');
  const completedRequests = userMaintenance.filter(mr => mr.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleSubmitNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.title || !newRequest.description) {
      alert('Please fill in all required fields.');
      return;
    }

    const newMaintenanceRequest: MaintenanceRequest = {
      id: `mr-${Date.now()}`,
      unitId: user.unitId || '',
      residentId: user.id,
      title: newRequest.title,
      description: newRequest.description,
      priority: newRequest.priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setUserMaintenance(prev => [newMaintenanceRequest, ...prev]);
    setNewRequest({ title: '', description: '', priority: 'medium' });
    setShowNewRequestForm(false);
    
    alert('Maintenance request submitted successfully!');
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Maintenance Requests</h1>
            <p className="text-gray-400">Submit and track maintenance requests for your unit</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{pendingRequests.length}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wrench className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{inProgressRequests.length}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{completedRequests.length}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Active Requests</h3>
          </CardHeader>
          <CardContent>
            {userMaintenance.filter(request => request.status !== 'completed').length > 0 ? (
              <div className="space-y-4">
                {userMaintenance
                  .filter(request => request.status !== 'completed')
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                      <div className="flex items-center">
                        <Wrench className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-[#e5e7eb]">{request.title}</p>
                          <p className="text-sm text-gray-400">{request.description}</p>
                          <p className="text-sm text-gray-400">
                            Created: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No active maintenance requests.</p>
            )}
          </CardContent>
        </Card>

        {/* Completed Requests */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Completed Requests</h3>
          </CardHeader>
          <CardContent>
            {completedRequests.length > 0 ? (
              <div className="space-y-4">
                {completedRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{request.title}</p>
                        <p className="text-sm text-gray-400">
                          Completed: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="success">Completed</Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No completed maintenance requests.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Quick Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="secondary" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Submit New Request
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Emergency Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 