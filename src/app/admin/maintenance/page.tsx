'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Wrench, 
  AlertTriangle, 
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  Building2,
  Calendar
} from 'lucide-react';
import { User as UserType, Unit, MaintenanceRequest } from '@/types';
import { 
  demoUsers, 
  demoUnits, 
  demoMaintenanceRequests 
} from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

interface MaintenanceWithDetails extends MaintenanceRequest {
  unit?: Unit;
  resident?: UserType;
}

export default function AdminMaintenance() {
  const [user, setUser] = useState<UserType | null>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'admin') {
        setUser(parsedUser);
      } else {
        router.push('/auth');
      }
    } else {
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      const maintenanceData = demoMaintenanceRequests.map(request => {
        const unit = demoUnits.find(u => u.id === request.unitId);
        const resident = demoUsers.find(u => u.id === request.residentId);
        
        return {
          ...request,
          unit,
          resident,
        };
      });
      
      setMaintenanceRequests(maintenanceData);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.resident?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.unit?.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriorityFilter = filterPriority === 'all' || request.priority === filterPriority;
    
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  const stats = [
    {
      name: 'Total Requests',
      value: maintenanceRequests.length,
      icon: Wrench,
    },
    {
      name: 'Pending',
      value: maintenanceRequests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400',
    },
    {
      name: 'In Progress',
      value: maintenanceRequests.filter(r => r.status === 'in-progress').length,
      icon: AlertTriangle,
      color: 'text-orange-400',
    },
    {
      name: 'Completed',
      value: maintenanceRequests.filter(r => r.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-400',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'in-progress':
        return 'bg-orange-900 text-orange-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-900 text-red-300';
      case 'high':
        return 'bg-orange-900 text-orange-300';
      case 'medium':
        return 'bg-yellow-900 text-yellow-300';
      case 'low':
        return 'bg-green-900 text-green-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Maintenance</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage all maintenance requests and repairs
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Create Request</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className={`h-6 w-6 ${stat.color || 'text-blue-400'}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">{stat.name}</dt>
                      <dd className="text-lg font-medium text-[#e5e7eb]">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests by title, description, resident, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#22304a] border border-[#22304a] rounded-lg text-[#e5e7eb] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#22304a] border border-[#22304a] rounded-lg px-3 py-2 text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-[#22304a] border border-[#22304a] rounded-lg px-3 py-2 text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="emergency">Emergency</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#22304a]">
                <thead className="bg-[#181c23]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Request Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#181c23] divide-y divide-[#22304a]">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-[#22304a] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Wrench className="h-5 w-5 text-blue-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-[#e5e7eb]">
                              {request.title}
                            </div>
                            <div className="text-sm text-gray-400 max-w-xs truncate">
                              {request.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {request.resident?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {request.unit?.address || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getPriorityIcon(request.priority)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-400">No maintenance requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first maintenance request.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Recent Maintenance Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{request.title}</p>
                        <p className="text-sm text-gray-400">
                          {request.resident?.name} • {request.unit?.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="bg-[#22304a] hover:bg-[#2a3744] p-4 rounded-lg border border-[#22304a] hover:border-blue-400 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-[#e5e7eb]">Emergency Requests</h3>
                <p className="text-xs text-gray-400">View urgent issues</p>
              </div>
            </div>
          </button>
          
          <button className="bg-[#22304a] hover:bg-[#2a3744] p-4 rounded-lg border border-[#22304a] hover:border-blue-400 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-yellow-400" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-[#e5e7eb]">Pending Requests</h3>
                <p className="text-xs text-gray-400">Review pending items</p>
              </div>
            </div>
          </button>
          
          <button className="bg-[#22304a] hover:bg-[#2a3744] p-4 rounded-lg border border-[#22304a] hover:border-blue-400 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-[#e5e7eb]">Completed Work</h3>
                <p className="text-xs text-gray-400">View finished repairs</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
} 