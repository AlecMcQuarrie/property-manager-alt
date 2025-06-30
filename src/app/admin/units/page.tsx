'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Building2, 
  Users, 
  Wrench, 
  Plus,
  Eye,
  Edit,
  Home,
  Search,
  Filter,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { User, Unit } from '@/types';
import { demoUnits, demoUsers } from '@/lib/data';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

export default function AdminUnitsPage() {
  const [user, setUser] = useState<User | null>(null);
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

  if (!user) {
    return <div>Loading...</div>;
  }

  const getResidentName = (unitId: string) => {
    const unit = demoUnits.find(u => u.id === unitId);
    if (unit?.residentId) {
      const resident = demoUsers.find(u => u.id === unit.residentId);
      return resident?.name || 'Unknown';
    }
    return 'No resident';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-900 text-green-300';
      case 'vacant':
        return 'bg-yellow-900 text-yellow-300';
      case 'maintenance':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const filteredUnits = demoUnits.filter(unit => {
    const matchesSearch = unit.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.zipCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getResidentName(unit.id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || unit.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      name: 'Total Units',
      value: demoUnits.length,
      icon: Building2,
    },
    {
      name: 'Occupied',
      value: demoUnits.filter(u => u.status === 'occupied').length,
      icon: Users,
      color: 'text-green-400',
    },
    {
      name: 'Vacant',
      value: demoUnits.filter(u => u.status === 'vacant').length,
      icon: Home,
      color: 'text-yellow-400',
    },
    {
      name: 'Maintenance',
      value: demoUnits.filter(u => u.status === 'maintenance').length,
      icon: Wrench,
      color: 'text-red-400',
    },
  ];

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Units</h1>
            <p className="text-gray-400">Manage all property units and their status</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Unit
          </Button>
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

        {/* Search and Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search units by address, city, state, or resident..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-[#22304a] border border-[#22304a] text-[#e5e7eb] placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                  <option value="occupied">Occupied</option>
                  <option value="vacant">Vacant</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#22304a]">
                <thead className="bg-[#181c23]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#181c23] divide-y divide-[#22304a]">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-[#22304a] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-blue-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-[#e5e7eb]">
                              {unit.address}
                            </div>
                            <div className="text-sm text-gray-400">
                              {unit.city}, {unit.state} {unit.zipCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {unit.city}, {unit.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {unit.bedrooms}BR / {unit.bathrooms}BA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        ${unit.rent}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                          {unit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {unit.residentId ? getResidentName(unit.id) : 'No resident'}
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

            {filteredUnits.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-400">No units found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first unit.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 