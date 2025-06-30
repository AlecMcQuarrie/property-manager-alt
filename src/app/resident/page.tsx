'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  Home, 
  CreditCard, 
  Wrench, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar
} from 'lucide-react';
import { User, Unit, Bill, MaintenanceRequest, Lease } from '@/types';
import { 
  getUnitsByUser, 
  getBillsByUser, 
  getMaintenanceRequestsByUser, 
  getLeaseByUser,
  demoUnits 
} from '@/lib/data';

export default function ResidentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userUnit, setUserUnit] = useState<Unit | null>(null);
  const [userBills, setUserBills] = useState<Bill[]>([]);
  const [userMaintenance, setUserMaintenance] = useState<MaintenanceRequest[]>([]);
  const [userLease, setUserLease] = useState<Lease | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'resident') {
        setUser(parsedUser);
        
        // Get user's unit
        const units = getUnitsByUser(parsedUser.id);
        if (units.length > 0) {
          setUserUnit(units[0]);
        }
        
        // Get user's bills
        const bills = getBillsByUser(parsedUser.id);
        setUserBills(bills);
        
        // Get user's maintenance requests
        const maintenance = getMaintenanceRequestsByUser(parsedUser.id);
        setUserMaintenance(maintenance);
        
        // Get user's lease
        const lease = getLeaseByUser(parsedUser.id);
        setUserLease(lease || null);
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

  const pendingBills = userBills.filter(bill => bill.status === 'pending');
  const overdueBills = userBills.filter(bill => bill.status === 'overdue');
  const paidBills = userBills.filter(bill => bill.status === 'paid');
  
  const pendingMaintenance = userMaintenance.filter(mr => mr.status === 'pending');
  const inProgressMaintenance = userMaintenance.filter(mr => mr.status === 'in-progress');
  const completedMaintenance = userMaintenance.filter(mr => mr.status === 'completed');

  const totalOwed = pendingBills.reduce((sum, bill) => sum + bill.amount, 0) + 
                   overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  const getBillStatusColor = (status: string) => {
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

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'in-progress':
        return 'bg-yellow-900 text-yellow-300';
      case 'pending':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#e5e7eb]">Welcome back, {user.name}!</h1>
          <p className="mt-1 text-sm text-gray-400">
            Here's what's happening with your unit and account.
          </p>
        </div>

        {/* Unit Information */}
        {userUnit && (
          <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-[#e5e7eb]">Your Property</h3>
                  <p className="text-sm text-gray-400">{userUnit.address} • {userUnit.city}, {userUnit.state}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Address</dt>
                  <dd className="mt-1 text-lg font-semibold text-[#e5e7eb]">{userUnit.address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Bedrooms</dt>
                  <dd className="mt-1 text-lg font-semibold text-[#e5e7eb]">{userUnit.bedrooms}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Bathrooms</dt>
                  <dd className="mt-1 text-lg font-semibold text-[#e5e7eb]">{userUnit.bathrooms}</dd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-[#181c23] overflow-hidden shadow rounded-lg border border-[#22304a]">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Owed</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">${totalOwed}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#181c23] overflow-hidden shadow rounded-lg border border-[#22304a]">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Overdue Bills</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{overdueBills.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#181c23] overflow-hidden shadow rounded-lg border border-[#22304a]">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Wrench className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Active Requests</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{pendingMaintenance.length + inProgressMaintenance.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Bills */}
        <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4">Pending Bills</h3>
            {pendingBills.length > 0 ? (
              <div className="space-y-4">
                {pendingBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                        <p className="text-sm text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-[#e5e7eb]">${bill.amount}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No pending bills found.</p>
            )}
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4">Recent Bills</h3>
            {userBills.length > 0 ? (
              <div className="space-y-4">
                {userBills.slice(0, 5).map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                        <p className="text-sm text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-[#e5e7eb]">${bill.amount}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No bills found.</p>
            )}
          </div>
        </div>

        {/* Recent Maintenance Requests */}
        <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-blue-400 mb-4">Recent Maintenance Requests</h3>
            {userMaintenance.length > 0 ? (
              <div className="space-y-4">
                {userMaintenance.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      <Wrench className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{request.title}</p>
                        <p className="text-sm text-gray-400">{request.priority} priority • {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No maintenance requests found.</p>
            )}
          </div>
        </div>

        {/* Lease Information */}
        {userLease && (
          <div className="bg-[#181c23] shadow rounded-lg border border-[#22304a]">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-400" />
                <h3 className="ml-2 text-lg font-medium text-[#e5e7eb]">Lease Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Lease Term</dt>
                  <dd className="mt-1 text-sm text-[#e5e7eb]">
                    {new Date(userLease.startDate).toLocaleDateString()} - {new Date(userLease.endDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Monthly Rent</dt>
                  <dd className="mt-1 text-sm text-[#e5e7eb]">${userLease.rent}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Security Deposit</dt>
                  <dd className="mt-1 text-sm text-[#e5e7eb]">${userLease.deposit}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userLease.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {userLease.status}
                    </span>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="relative group bg-[#22304a] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 rounded-lg border border-[#22304a] hover:border-blue-400">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-900 text-blue-400 ring-4 ring-[#181c23]">
                <CreditCard className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-[#e5e7eb]">
                <span className="absolute inset-0" aria-hidden="true" />
                Pay Bills
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                View and pay your outstanding bills online.
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
                Request Maintenance
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Submit a new maintenance request for your unit.
              </p>
            </div>
          </button>

          <button className="relative group bg-[#22304a] p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-400 rounded-lg border border-[#22304a] hover:border-blue-400">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-900 text-blue-400 ring-4 ring-[#181c23]">
                <FileText className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-[#e5e7eb]">
                <span className="absolute inset-0" aria-hidden="true" />
                View Lease
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Access your lease agreement and important documents.
              </p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
} 