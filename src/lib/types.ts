export type UserRole = 'USER' | 'BUILDING_ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  buildingId?: string; // only for BUILDING_ADMIN
  faceHash: string;
  lastVoteDate: string | null;
  createdAt: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  adminId?: string; // BUILDING_ADMIN user id
  adminEmail: string;
  type: string;
  createdAt: string;
  distance?: number;
}

export interface Employee {
  id: string;
  name: string;
  buildingId: string;
  designation: string;
  department: string;
  rating: number;
  totalRatings: number;
  avatar: string;
  createdBy?: string; // BUILDING_ADMIN user id
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  employeeId: string;
  buildingId: string;
  rating: number;
  comment: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  createdAt: string;
  userEmail: string;
  sentimentScore: number;
  faceHash?: string;
}

export interface AdminUser {
  email: string;
  password: string;
}
