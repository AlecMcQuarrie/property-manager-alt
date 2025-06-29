export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'resident';
  unitId?: string;
}

export interface Unit {
  id: string;
  number: string;
  building: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  residentId?: string;
}

export interface Bill {
  id: string;
  unitId: string;
  residentId: string;
  type: 'rent' | 'utilities' | 'maintenance' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  residentId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt?: string;
  assignedTo?: string;
}

export interface Lease {
  id: string;
  unitId: string;
  residentId: string;
  startDate: string;
  endDate: string;
  rent: number;
  deposit: number;
  terms: string[];
  status: 'active' | 'expired' | 'terminated';
} 