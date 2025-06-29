'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { User, Unit, Bill, MaintenanceRequest } from '@/types';
import { 
  demoUsers, 
  demoUnits, 
  demoBills, 
  demoMaintenanceRequests 
} from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

interface ResidentWithDetails extends User {
  unit?: Unit;
  bills: Bill[];
  maintenanceRequests: MaintenanceRequest[];
  totalBills: number;
  overdueBills: number;
  pendingMaintenance: number;
}

export default function AdminResidents() {
  const [user, setUser] = useState<User | null>(null);
  const [residents, setResidents] = useState<ResidentWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
      const residentsData = demoUsers
        .filter(u => u.role === 'resident')
        .map(resident => {
          const unit = demoUnits.find(u => u.id === resident.unitId);
          const bills = demoBills.filter(b => b.residentId === resident.id);
          const maintenanceRequests = demoMaintenanceRequests.filter(mr => mr.residentId === resident.id);
          
          return {
            ...resident,
            unit,
            bills,
            maintenanceRequests,
            totalBills: bills.length,
            overdueBills: bills.filter(b => b.status === 'overdue').length,
            pendingMaintenance: maintenanceRequests.filter(mr => mr.status === 'pending').length,
          };
        });
      
      setResidents(residentsData);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.unit?.number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'with-bills' && resident.overdueBills > 0) ||
                         (filterStatus === 'with-maintenance' && resident.pendingMaintenance > 0);
    
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      name: 'Total Residents',
      value: residents.length,
      icon: Users,
    },
    {
      name: 'Occupied Units',
      value: residents.filter(r => r.unit?.status === 'occupied').length,
      icon: Building2,
    },
    {
      name: 'Residents with Overdue Bills',
      value: residents.filter(r => r.overdueBills > 0).length,
      icon: Calendar,
    },
    {
      name: 'Pending Maintenance',
      value: residents.filter(r => r.pendingMaintenance > 0).length,
      icon: Building2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-900 text-green-300';
      case 'vacant':
        return 'bg-gray-900 text-gray-300';
      case 'maintenance':
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

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Residents</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage all residents and their information
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Resident</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-blue-400" />
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
                    placeholder="Search residents by name, email, or unit..."
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
                  <option value="all">All Residents</option>
                  <option value="with-bills">With Overdue Bills</option>
                  <option value="with-maintenance">With Pending Maintenance</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residents List */}
        <div className="space-y-4">
          {filteredResidents.map((resident) => (
            <Card key={resident.id}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#e5e7eb]">{resident.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{resident.email}</span>
                        </div>
                        {resident.unit && (
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4" />
                            <span>Unit {resident.unit.number}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resident.unit.status)}`}>
                              {resident.unit.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-[#e5e7eb] font-medium">{resident.totalBills}</div>
                        <div className="text-gray-400">Bills</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${resident.overdueBills > 0 ? 'text-red-400' : 'text-[#e5e7eb]'}`}>
                          {resident.overdueBills}
                        </div>
                        <div className="text-gray-400">Overdue</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${resident.pendingMaintenance > 0 ? 'text-yellow-400' : 'text-[#e5e7eb]'}`}>
                          {resident.pendingMaintenance}
                        </div>
                        <div className="text-gray-400">Maintenance</div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#22304a] rounded-lg transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#22304a] rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#22304a] rounded-lg transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {resident.unit && (
                  <div className="mt-4 pt-4 border-t border-[#22304a]">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Building:</span>
                        <span className="ml-2 text-[#e5e7eb]">{resident.unit.building}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Floor:</span>
                        <span className="ml-2 text-[#e5e7eb]">{resident.unit.floor}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Bedrooms:</span>
                        <span className="ml-2 text-[#e5e7eb]">{resident.unit.bedrooms}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rent:</span>
                        <span className="ml-2 text-[#e5e7eb]">${resident.unit.rent}/month</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {(resident.bills.length > 0 || resident.maintenanceRequests.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-[#22304a]">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {resident.bills.slice(0, 2).map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between text-sm">
                          <span className="text-[#e5e7eb]">{bill.description}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">${bill.amount}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              bill.status === 'paid' ? 'bg-green-900 text-green-300' :
                              bill.status === 'overdue' ? 'bg-red-900 text-red-300' :
                              'bg-yellow-900 text-yellow-300'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {resident.maintenanceRequests.slice(0, 2).map((request) => (
                        <div key={request.id} className="flex items-center justify-between text-sm">
                          <span className="text-[#e5e7eb]">{request.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'completed' ? 'bg-green-900 text-green-300' :
                              request.status === 'in-progress' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-red-900 text-red-300'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResidents.length === 0 && (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-400">No residents found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first resident.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
} 