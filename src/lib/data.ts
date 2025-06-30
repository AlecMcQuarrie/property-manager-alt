import { User, Unit, Bill, MaintenanceRequest, Lease } from '@/types';

export const demoUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Property Manager',
    role: 'admin',
  },
  {
    id: 'resident-1',
    email: 'john.doe@demo.com',
    name: 'John Doe',
    role: 'resident',
    unitId: 'unit-1',
  },
  {
    id: 'resident-2',
    email: 'jane.smith@demo.com',
    name: 'Jane Smith',
    role: 'resident',
    unitId: 'unit-2',
  },
];

export const demoUnits: Unit[] = [
  {
    id: 'unit-1',
    address: '123 Main Street',
    city: 'Downtown',
    state: 'CA',
    zipCode: '90210',
    bedrooms: 2,
    bathrooms: 1,
    rent: 1800,
    status: 'occupied',
    residentId: 'resident-1',
  },
  {
    id: 'unit-2',
    address: '456 Oak Avenue',
    city: 'Midtown',
    state: 'CA',
    zipCode: '90211',
    bedrooms: 1,
    bathrooms: 1,
    rent: 1500,
    status: 'occupied',
    residentId: 'resident-2',
  },
  {
    id: 'unit-3',
    address: '789 Pine Street',
    city: 'Uptown',
    state: 'CA',
    zipCode: '90212',
    bedrooms: 3,
    bathrooms: 2,
    rent: 2200,
    status: 'vacant',
  },
  {
    id: 'unit-4',
    address: '321 Elm Drive',
    city: 'Downtown',
    state: 'CA',
    zipCode: '90210',
    bedrooms: 2,
    bathrooms: 1,
    rent: 1700,
    status: 'maintenance',
  },
];

export const demoBills: Bill[] = [
  {
    id: 'bill-1',
    unitId: 'unit-1',
    residentId: 'resident-1',
    type: 'rent',
    amount: 1800,
    dueDate: '2024-01-01',
    status: 'paid',
    description: 'January 2024 Rent',
    createdAt: '2023-12-15',
  },
  {
    id: 'bill-2',
    unitId: 'unit-1',
    residentId: 'resident-1',
    type: 'utilities',
    amount: 150,
    dueDate: '2024-01-15',
    status: 'pending',
    description: 'Electricity and Water',
    createdAt: '2024-01-01',
  },
  {
    id: 'bill-3',
    unitId: 'unit-2',
    residentId: 'resident-2',
    type: 'rent',
    amount: 1500,
    dueDate: '2024-01-01',
    status: 'overdue',
    description: 'January 2024 Rent',
    createdAt: '2023-12-15',
  },
];

export const demoMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr-1',
    unitId: 'unit-1',
    residentId: 'resident-1',
    title: 'Leaky Faucet',
    description: 'The kitchen faucet is dripping constantly and needs repair.',
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2024-01-05',
    assignedTo: 'maintenance-team',
  },
  {
    id: 'mr-2',
    unitId: 'unit-2',
    residentId: 'resident-2',
    title: 'Broken Window',
    description: 'Window in the living room won\'t close properly.',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-10',
  },
  {
    id: 'mr-3',
    unitId: 'unit-1',
    residentId: 'resident-1',
    title: 'HVAC Not Working',
    description: 'Air conditioning stopped working completely.',
    priority: 'emergency',
    status: 'completed',
    createdAt: '2023-12-20',
    completedAt: '2023-12-22',
    assignedTo: 'maintenance-team',
  },
];

export const demoLeases: Lease[] = [
  {
    id: 'lease-1',
    unitId: 'unit-1',
    residentId: 'resident-1',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    rent: 1800,
    deposit: 1800,
    terms: [
      'No pets allowed',
      'No smoking',
      'Quiet hours 10 PM - 8 AM',
      'Parking space included',
      'Utilities not included',
    ],
    status: 'active',
  },
  {
    id: 'lease-2',
    unitId: 'unit-2',
    residentId: 'resident-2',
    startDate: '2023-08-01',
    endDate: '2024-07-31',
    rent: 1500,
    deposit: 1500,
    terms: [
      'Small pets allowed with deposit',
      'No smoking',
      'Quiet hours 10 PM - 8 AM',
      'Parking space included',
      'Utilities not included',
    ],
    status: 'active',
  },
];

export const getDemoUser = (email: string): User | undefined => {
  return demoUsers.find(user => user.email === email);
};

export const getUnitsByUser = (userId: string): Unit[] => {
  const user = demoUsers.find(u => u.id === userId);
  if (user?.role === 'admin') {
    return demoUnits;
  }
  return demoUnits.filter(unit => unit.residentId === userId);
};

export const getBillsByUser = (userId: string): Bill[] => {
  const user = demoUsers.find(u => u.id === userId);
  if (user?.role === 'admin') {
    return demoBills;
  }
  return demoBills.filter(bill => bill.residentId === userId);
};

export const getMaintenanceRequestsByUser = (userId: string): MaintenanceRequest[] => {
  const user = demoUsers.find(u => u.id === userId);
  if (user?.role === 'admin') {
    return demoMaintenanceRequests;
  }
  return demoMaintenanceRequests.filter(mr => mr.residentId === userId);
};

export const getLeaseByUser = (userId: string): Lease | undefined => {
  const user = demoUsers.find(u => u.id === userId);
  if (user?.role === 'admin') {
    return undefined;
  }
  return demoLeases.find(lease => lease.residentId === userId);
};

export const getMonthlyRentData = () => {
  const now = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  
  // Get all paid rent bills
  const rentBills = demoBills.filter(bill => bill.type === 'rent');
  
  // Group by month (YYYY-MM)
  const monthlyTotals: Record<string, number> = {};
  rentBills.forEach(bill => {
    const month = bill.dueDate.slice(0, 7); // 'YYYY-MM'
    if (!monthlyTotals[month]) monthlyTotals[month] = 0;
    if (bill.status === 'paid') monthlyTotals[month] += bill.amount;
  });
  
  // Fill in each month with real or mock data
  return months.map(month => ({
    month,
    revenue: month in monthlyTotals ? monthlyTotals[month] : Math.floor(2000 + Math.random() * 2000)
  }));
}; 