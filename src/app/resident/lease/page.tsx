'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { 
  FileText, 
  Calendar,
  DollarSign,
  Home,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { User, Lease, Unit } from '@/types';
import { getLeaseByUser, getUnitsByUser } from '@/lib/data';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { themeClasses } from '@/lib/theme';

export default function ResidentLeasePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userLease, setUserLease] = useState<Lease | null>(null);
  const [userUnit, setUserUnit] = useState<Unit | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'resident') {
        setUser(parsedUser);
        
        // Get user's lease
        const lease = getLeaseByUser(parsedUser.id);
        setUserLease(lease || null);
        
        // Get user's unit
        const units = getUnitsByUser(parsedUser.id);
        if (units.length > 0) {
          setUserUnit(units[0]);
        }
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

  if (!userLease) {
    return (
      <Layout user={user}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">Lease Information</h1>
            <p className="text-gray-400">View your lease agreement and important documents</p>
          </div>
          
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#e5e7eb] mb-2">No Lease Found</h3>
                <p className="text-gray-400">No active lease agreement found for your account.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isLeaseActive = userLease.status === 'active';
  const isLeaseExpired = new Date(userLease.endDate) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(userLease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getLeaseStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getLeaseStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'terminated':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e5e7eb]">Lease Information</h1>
          <p className="text-gray-400">View your lease agreement and important documents</p>
        </div>

        {/* Lease Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Lease Term</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">
                      {new Date(userLease.startDate).toLocaleDateString()} - {new Date(userLease.endDate).toLocaleDateString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Monthly Rent</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">${userLease.rent}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Home className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">Security Deposit</dt>
                    <dd className="text-lg font-medium text-[#e5e7eb]">${userLease.deposit}</dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lease Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-blue-400">Lease Details</h3>
              <Badge variant={getLeaseStatusColor(userLease.status)}>
                {userLease.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Lease ID</dt>
                  <dd className="text-sm text-[#e5e7eb]">{userLease.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Start Date</dt>
                  <dd className="text-sm text-[#e5e7eb]">{new Date(userLease.startDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">End Date</dt>
                  <dd className="text-sm text-[#e5e7eb]">{new Date(userLease.endDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Days Remaining</dt>
                  <dd className="text-sm text-[#e5e7eb]">{daysUntilExpiry > 0 ? daysUntilExpiry : 'Expired'}</dd>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Monthly Rent</dt>
                  <dd className="text-sm text-[#e5e7eb]">${userLease.rent}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Security Deposit</dt>
                  <dd className="text-sm text-[#e5e7eb]">${userLease.deposit}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Late Fee</dt>
                  <dd className="text-sm text-[#e5e7eb]">$50 (after 5 days)</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">Pet Policy</dt>
                  <dd className="text-sm text-[#e5e7eb]">Allowed with deposit</dd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Documents</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#e5e7eb]">Lease Agreement</p>
                    <p className="text-sm text-gray-400">Original signed lease document</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#e5e7eb]">Move-in Checklist</p>
                    <p className="text-sm text-gray-400">Property condition report</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-[#22304a] rounded-lg bg-[#22304a]">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#e5e7eb]">House Rules</p>
                    <p className="text-sm text-gray-400">Community guidelines and policies</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renewal Information */}
        {daysUntilExpiry > 0 && daysUntilExpiry < 90 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-blue-400">Lease Renewal</h3>
            </CardHeader>
            <CardContent>
              <div className="bg-[#22304a] border border-[#22304a] rounded-lg p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-[#e5e7eb]">Lease Expiring Soon</p>
                    <p className="text-sm text-gray-400">
                      Your lease expires in {daysUntilExpiry} days. Contact management to discuss renewal options.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="primary" size="sm">
                    Request Renewal
                  </Button>
                  <Button variant="secondary" size="sm">
                    Contact Management
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
} 