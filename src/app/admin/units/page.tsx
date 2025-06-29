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
  Filter
} from 'lucide-react';
import { User, Unit } from '@/types';
import { demoUnits, demoUsers } from '@/lib/data';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

export default function AdminUnitsPage() {
  const [user, setUser] = useState<User | null>(null);
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

  const getUnitStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'success';
      case 'vacant':
        return 'warning';
      case 'maintenance':
        return 'error';
      default:
        return 'info';
    }
  };

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
        return 'success';
      case 'vacant':
        return 'warning';
      case 'maintenance':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
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

        {/* Search and Filters */}
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search units..."
                    className="pl-10 pr-4 py-2 w-full bg-[#22304a] border border-[#22304a] text-[#e5e7eb] placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoUnits.map((unit) => (
            <Card key={unit.id} className="hover:border-blue-400 transition-colors duration-200">
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Building2 className="h-6 w-6 text-blue-400 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-[#e5e7eb]">Unit {unit.number}</h3>
                      <p className="text-sm text-gray-400">{unit.building}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(unit.status)}>
                    {unit.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Floor</dt>
                    <dd className="text-sm text-[#e5e7eb]">{unit.floor}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Type</dt>
                    <dd className="text-sm text-[#e5e7eb]">{unit.bedrooms}BR / {unit.bathrooms}BA</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Rent</dt>
                    <dd className="text-sm text-[#e5e7eb]">${unit.rent}/month</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Size</dt>
                    <dd className="text-sm text-[#e5e7eb]">1,200 sq ft</dd>
                  </div>
                </div>

                {unit.residentId && (
                  <div className="border-t border-[#22304a] pt-4">
                    <dt className="text-sm font-medium text-gray-400 mb-1">Current Resident</dt>
                    <dd className="text-sm text-[#e5e7eb]">{getResidentName(unit.id)}</dd>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="secondary" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#e5e7eb]">
                  {demoUnits.length}
                </div>
                <div className="text-sm text-gray-400">Total Units</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {demoUnits.filter(u => u.status === 'occupied').length}
                </div>
                <div className="text-sm text-gray-400">Occupied</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {demoUnits.filter(u => u.status === 'vacant').length}
                </div>
                <div className="text-sm text-gray-400">Vacant</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {demoUnits.filter(u => u.status === 'maintenance').length}
                </div>
                <div className="text-sm text-gray-400">Maintenance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 