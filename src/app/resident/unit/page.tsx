'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { 
  Home, 
  MapPin, 
  Calendar,
  Wifi,
  Car,
  Snowflake,
  Droplets,
  Zap,
  Shield,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { User, Unit } from '@/types';
import { getUnitsByUser } from '@/lib/data';

export default function MyUnitPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userUnit, setUserUnit] = useState<Unit | null>(null);
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

  if (!userUnit) {
    return (
      <Layout user={user}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#e5e7eb]">My Unit</h1>
            <p className="text-gray-400">Unit information and details</p>
          </div>
          
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#e5e7eb] mb-2">No Unit Assigned</h3>
                <p className="text-gray-400">No unit information found for your account.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const amenities = [
    { name: 'High-Speed WiFi', icon: Wifi, included: true },
    { name: 'Parking Space', icon: Car, included: true },
    { name: 'Air Conditioning', icon: Snowflake, included: true },
    { name: 'In-Unit Laundry', icon: Droplets, included: false },
    { name: 'Dishwasher', icon: Zap, included: true },
    { name: 'Security System', icon: Shield, included: true },
  ];

  const getAmenityColor = (included: boolean) => {
    return included ? 'text-green-400' : 'text-gray-500';
  };

  return (
    <Layout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e5e7eb]">My Unit</h1>
          <p className="text-gray-400">Unit {userUnit.number} • {userUnit.building}</p>
        </div>

        {/* Unit Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-blue-400">Unit Overview</h3>
              <Badge variant={userUnit.status === 'occupied' ? 'success' : 'warning'}>
                {userUnit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Unit Number</dt>
                    <dd className="text-sm text-[#e5e7eb]">{userUnit.number}</dd>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Building</dt>
                    <dd className="text-sm text-[#e5e7eb]">{userUnit.building}</dd>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Floor</dt>
                    <dd className="text-sm text-[#e5e7eb]">{userUnit.floor}</dd>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Bedrooms</dt>
                    <dd className="text-sm text-[#e5e7eb]">{userUnit.bedrooms}</dd>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Bathrooms</dt>
                    <dd className="text-sm text-[#e5e7eb]">{userUnit.bathrooms}</dd>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Square Footage</dt>
                    <dd className="text-sm text-[#e5e7eb]">1,200 sq ft</dd>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Amenities</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {amenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <div key={amenity.name} className="flex items-center p-3 border border-[#22304a] rounded-lg bg-[#22304a]">
                    <Icon className={`h-5 w-5 mr-3 ${getAmenityColor(amenity.included)}`} />
                    <div>
                      <p className="text-sm font-medium text-[#e5e7eb]">{amenity.name}</p>
                      <p className="text-xs text-gray-400">
                        {amenity.included ? 'Included' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Unit Policies */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Unit Policies</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-[#e5e7eb]">Quiet Hours</h4>
                  <p className="text-sm text-gray-400">10:00 PM - 8:00 AM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-[#e5e7eb]">Security</h4>
                  <p className="text-sm text-gray-400">24/7 building access with key fob</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Car className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-[#e5e7eb]">Parking</h4>
                  <p className="text-sm text-gray-400">One assigned parking space included</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Home className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-[#e5e7eb]">Pets</h4>
                  <p className="text-sm text-gray-400">Allowed with additional deposit and monthly fee</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-blue-400">Property Management Contact</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Emergency Phone</dt>
                    <dd className="text-sm text-[#e5e7eb]">(555) 123-4567</dd>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Email</dt>
                    <dd className="text-sm text-[#e5e7eb]">management@suiteprop.com</dd>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Office Hours</dt>
                    <dd className="text-sm text-[#e5e7eb]">Mon-Fri: 9 AM - 5 PM</dd>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Office Location</dt>
                    <dd className="text-sm text-[#e5e7eb]">Building A, Ground Floor</dd>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="secondary" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact Management
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Maintenance
          </Button>
        </div>
      </div>
    </Layout>
  );
} 