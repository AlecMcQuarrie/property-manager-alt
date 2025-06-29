'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { User, Bill } from '@/types';
import { getBillsByUser } from '@/lib/data';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

export default function ResidentBillsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userBills, setUserBills] = useState<Bill[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'resident') {
        setUser(parsedUser);
        const bills = getBillsByUser(parsedUser.id);
        setUserBills(bills);
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
  
  const totalOwed = pendingBills.reduce((sum, bill) => sum + bill.amount, 0) + 
                   overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  const getBillStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getBillStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handlePayBill = (billId: string) => {
    // In a real app, this would integrate with a payment processor
    alert('Payment processing would be integrated here. For demo purposes, this bill is now marked as paid.');
    
    // Update the bill status locally for demo
    setUserBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId ? { ...bill, status: 'paid' as const } : bill
      )
    );
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e5e7eb]">Bills & Payments</h1>
          <p className="text-gray-400">View and manage your bills and payments</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Total Owed</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">${totalOwed}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Pending Bills</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{pendingBills.length}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Overdue Bills</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">{overdueBills.length}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Bills */}
        {overdueBills.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <h3 className="ml-2 text-lg font-medium text-red-800">Overdue Bills</h3>
            </div>
            <p className="mt-2 text-sm text-red-700">
              You have {overdueBills.length} overdue bill{overdueBills.length > 1 ? 's' : ''}. Please pay these as soon as possible to avoid additional fees.
            </p>
            <div className="mt-4 space-y-3">
              {overdueBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{bill.description}</p>
                      <p className="text-sm text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">${bill.amount}</span>
                    <button
                      onClick={() => handlePayBill(bill.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Bills */}
        {pendingBills.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-blue-400">Pending Bills</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      {getBillStatusIcon(bill.status)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                        <p className="text-sm text-gray-400">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-[#e5e7eb]">${bill.amount}</span>
                      <Button
                        onClick={() => handlePayBill(bill.id)}
                        variant="primary"
                        size="sm"
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Bills */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">All Bills</h3>
          </CardHeader>
          <CardContent>
            {userBills.length > 0 ? (
              <div className="space-y-4">
                {userBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                        <p className="text-sm text-gray-400">
                          Due: {new Date(bill.dueDate).toLocaleDateString()} • {bill.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-[#e5e7eb]">${bill.amount}</span>
                      <Badge variant={getBillStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {bill.status !== 'paid' && (
                          <Button variant="primary" size="sm">
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No bills found.</p>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Payment History</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBills
                .filter(bill => bill.status === 'paid')
                .slice(0, 5)
                .map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-green-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-[#e5e7eb]">{bill.description}</p>
                        <p className="text-sm text-gray-400">
                          Paid: {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-[#e5e7eb]">${bill.amount}</span>
                      <Badge variant="success">Paid</Badge>
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