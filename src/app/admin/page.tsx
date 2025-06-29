'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Building2, 
  Users, 
  CreditCard, 
  Wrench, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar
} from 'lucide-react';
import { User } from '@/types';
import { 
  demoUnits, 
  demoBills, 
  demoMaintenanceRequests, 
  demoUsers,
  getMonthlyRentData
} from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

export default function AdminDashboard() {
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

  const totalUnits = demoUnits.length;
  const occupiedUnits = demoUnits.filter(unit => unit.status === 'occupied').length;
  const vacantUnits = demoUnits.filter(unit => unit.status === 'vacant').length;
  const maintenanceUnits = demoUnits.filter(unit => unit.status === 'maintenance').length;
  
  const totalResidents = demoUsers.filter(u => u.role === 'resident').length;
  const pendingBills = demoBills.filter(bill => bill.status === 'pending').length;
  const overdueBills = demoBills.filter(bill => bill.status === 'overdue').length;
  const pendingMaintenance = demoMaintenanceRequests.filter(mr => mr.status === 'pending').length;
  const inProgressMaintenance = demoMaintenanceRequests.filter(mr => mr.status === 'in-progress').length;

  const stats = [
    {
      name: 'Total Units',
      value: totalUnits,
      change: '+2',
      changeType: 'positive',
      icon: Building2,
    },
    {
      name: 'Occupied Units',
      value: occupiedUnits,
      change: '+1',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Vacant Units',
      value: vacantUnits,
      icon: Building2,
    },
    {
      name: 'Under Maintenance',
      value: maintenanceUnits,
      icon: Wrench,
    },
    {
      name: 'Total Residents',
      value: totalResidents,
      icon: Users,
    },
    {
      name: 'Pending Bills',
      value: pendingBills,
      icon: CreditCard,
    },
    {
      name: 'Overdue Bills',
      value: overdueBills,
      icon: AlertTriangle,
    },
    {
      name: 'Maintenance Requests',
      value: pendingMaintenance + inProgressMaintenance,
      icon: Wrench,
    },
    {
      name: 'Monthly Revenue',
      value: '$45,200',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
    },
  ];

  const recentMaintenance = demoMaintenanceRequests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentBills = demoBills
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const monthlyData = getMonthlyRentData();

  const recentActivity = [
    {
      id: 1,
      type: 'payment',
      message: 'Unit 101 rent payment received',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'New maintenance request: Unit 205',
      time: '4 hours ago',
      status: 'pending',
    },
    {
      id: 3,
      type: 'lease',
      message: 'Lease renewal: Unit 103',
      time: '1 day ago',
      status: 'pending',
    },
    {
      id: 4,
      type: 'payment',
      message: 'Unit 108 rent payment overdue',
      time: '2 days ago',
      status: 'overdue',
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'lease':
        return <Calendar className="h-4 w-4 text-blue-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'overdue':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#e5e7eb]">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">
            Welcome back! Here's an overview of your property management system.
          </p>
        </div>

        {/* Rent Payments Line Chart */}
        <div className="bg-[#181c23] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-blue-400 mb-4">Monthly Rent Payments</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#22304a" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip contentStyle={{ background: '#181c23', border: '1px solid #22304a', color: '#e5e7eb' }} labelStyle={{ color: '#e5e7eb' }} />
              <Line type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={3} dot={{ r: 5, fill: '#60a5fa' }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
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
                <div className="mt-4">
                  <div className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="font-medium">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Maintenance Requests */}
          <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-4">
                Recent Maintenance Requests
              </h3>
              <div className="space-y-4">
                {recentMaintenance.map((request) => (
                  <div key={request.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {request.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : request.status === 'in-progress' ? (
                        <Clock className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e5e7eb]">{request.title}</p>
                      <p className="text-sm text-gray-400">
                        Unit {demoUnits.find(u => u.id === request.unitId)?.number} • {request.priority} priority
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        request.status === 'completed' 
                          ? 'bg-green-900 text-green-300'
                          : request.status === 'in-progress'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bills */}
          <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-blue-400 mb-4">
                Recent Bills
              </h3>
              <div className="space-y-4">
                {recentBills.map((bill) => (
                  <div key={bill.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {bill.status === 'paid' ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : bill.status === 'overdue' ? (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                      <p className="text-sm text-gray-400">
                        Unit {demoUnits.find(u => u.id === bill.unitId)?.number} • ${bill.amount}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bill.status === 'paid' 
                          ? 'bg-green-900 text-green-300'
                          : bill.status === 'overdue'
                          ? 'bg-red-900 text-red-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="relative group bg-[#22304a] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 rounded-lg border border-[#22304a] hover:border-blue-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-900 text-blue-400 ring-4 ring-[#181c23]">
                    <Building2 className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-[#e5e7eb]">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Add New Unit
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Register a new unit to the property management system.
                  </p>
                </div>
              </button>

              <button className="relative group bg-[#22304a] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 rounded-lg border border-[#22304a] hover:border-blue-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-900 text-blue-400 ring-4 ring-[#181c23]">
                    <Users className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-[#e5e7eb]">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Add Resident
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Register a new resident and assign them to a unit.
                  </p>
                </div>
              </button>

              <button className="relative group bg-[#22304a] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 rounded-lg border border-[#22304a] hover:border-blue-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-900 text-blue-400 ring-4 ring-[#181c23]">
                    <CreditCard className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-[#e5e7eb]">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Create Bill
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Generate a new bill for rent, utilities, or other charges.
                  </p>
                </div>
              </button>

              <button className="relative group bg-[#22304a] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 rounded-lg border border-[#22304a] hover:border-blue-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-900 text-blue-400 ring-4 ring-[#181c23]">
                    <Wrench className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-[#e5e7eb]">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Schedule Maintenance
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Schedule maintenance work for units or common areas.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 border border-[#22304a] rounded-lg bg-[#22304a]">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#e5e7eb]">{activity.message}</p>
                    <p className="text-sm text-gray-400">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-sm font-medium ${getActivityStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 