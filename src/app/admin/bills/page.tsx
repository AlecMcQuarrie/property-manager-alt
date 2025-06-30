'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { User, Unit, Bill } from '@/types';
import { 
  demoUsers, 
  demoUnits, 
  demoBills 
} from '@/lib/data';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

interface BillWithDetails extends Bill {
  unit?: Unit;
  resident?: User;
}

export default function AdminBills() {
  const [user, setUser] = useState<User | null>(null);
  const [bills, setBills] = useState<BillWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
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
      const billsData = demoBills.map(bill => {
        const unit = demoUnits.find(u => u.id === bill.unitId);
        const resident = demoUsers.find(u => u.id === bill.residentId);
        
        return {
          ...bill,
          unit,
          resident,
        };
      });
      
      setBills(billsData);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.resident?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.unit?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.amount.toString().includes(searchTerm);
    
    const matchesStatusFilter = filterStatus === 'all' || bill.status === filterStatus;
    const matchesTypeFilter = filterType === 'all' || bill.type === filterType;
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  const stats = [
    {
      name: 'Total Bills',
      value: bills.length,
      icon: CreditCard,
    },
    {
      name: 'Total Amount',
      value: `$${bills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}`,
      icon: DollarSign,
    },
    {
      name: 'Pending Bills',
      value: bills.filter(b => b.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400',
    },
    {
      name: 'Overdue Bills',
      value: bills.filter(b => b.status === 'overdue').length,
      icon: AlertTriangle,
      color: 'text-red-400',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-900 text-green-300';
      case 'overdue':
        return 'bg-red-900 text-red-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rent':
        return 'bg-blue-900 text-blue-300';
      case 'utilities':
        return 'bg-purple-900 text-purple-300';
      case 'maintenance':
        return 'bg-orange-900 text-orange-300';
      case 'other':
        return 'bg-gray-900 text-gray-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
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
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Bills</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage all bills and payments
            </p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Create Bill</span>
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
                    placeholder="Search bills by description, resident, address, or amount..."
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
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[#22304a] border border-[#22304a] rounded-lg px-3 py-2 text-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="rent">Rent</option>
                  <option value="utilities">Utilities</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bills Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#22304a]">
                <thead className="bg-[#181c23]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Bill Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#181c23] divide-y divide-[#22304a]">
                  {filteredBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-[#22304a] transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-blue-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-[#e5e7eb]">
                              {bill.description}
                            </div>
                            <div className="text-sm text-gray-400">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(bill.type)}`}>
                                {bill.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {bill.resident?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {bill.unit?.address || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        ${bill.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#e5e7eb]">
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(bill.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            {bill.status}
                          </span>
                        </div>
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

            {filteredBills.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-400">No bills found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first bill.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Recent Bill Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bills
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(bill.status)}
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                        <p className="text-sm text-gray-400">
                          {bill.resident?.name} • {bill.unit?.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-[#e5e7eb]">${bill.amount}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                        {bill.status}
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