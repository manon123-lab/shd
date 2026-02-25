// Legacy types kept for compatibility
export type UserRole = 'donor' | 'requester' | 'admin';
export type DonationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  organization: string;
  address: string;
  lat: number;
  lng: number;
  avatar?: string;
  joinedAt: string;
  user_id?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorOrg: string;
  foodType: string;
  quantity: string;
  description: string;
  pickupTime: string;
  address: string;
  lat: number;
  lng: number;
  status: DonationStatus;
  createdAt: string;
  acceptedBy?: string;
  acceptedByName?: string;
  category: 'cooked' | 'raw' | 'packaged' | 'bakery' | 'dairy' | 'fruits';
  expiresIn: string;
}

export interface FoodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterOrg: string;
  foodType: string;
  quantity: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  address: string;
  lat: number;
  lng: number;
  status: DonationStatus;
  createdAt: string;
  fulfilledBy?: string;
  fulfilledByName?: string;
  beneficiaries: number;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  currentStock: number;
  manager: string;
  phone: string;
  type: 'cold' | 'dry' | 'mixed';
  status: 'active' | 'full' | 'maintenance';
}

// Helper to convert DB row to app types
export function dbProfileToUser(p: any): User {
  try {
    return {
      id: p?.id || '',
      name: p?.name || 'Unknown User',
      email: p?.email || '',
      role: (p?.role || 'donor') as UserRole,
      phone: p?.phone || '',
      organization: p?.organization || '',
      address: p?.address || '',
      lat: p?.lat || 11.0,
      lng: p?.lng || 78.0,
      avatar: p?.avatar,
      joinedAt: p?.created_at ? p.created_at.split('T')[0] : '',
      user_id: p?.user_id,
    };
  } catch (error) {
    console.error('Error converting profile to user:', error);
    return {
      id: '',
      name: 'Unknown User',
      email: '',
      role: 'donor',
      phone: '',
      organization: '',
      address: '',
      lat: 11.0,
      lng: 78.0,
      joinedAt: '',
    };
  }
}

export function dbDonationToApp(d: any): Donation {
  try {
    return {
      id: d?.id || '',
      donorId: d?.donor_id || '',
      donorName: d?.donor_name || 'Anonymous',
      donorOrg: d?.donor_org || '',
      foodType: d?.food_type || '',
      quantity: d?.quantity || '',
      description: d?.description || '',
      pickupTime: d?.pickup_time || '',
      address: d?.address || '',
      lat: d?.lat || 0,
      lng: d?.lng || 0,
      status: (d?.status || 'pending') as DonationStatus,
      createdAt: d?.created_at || '',
      acceptedBy: d?.accepted_by,
      acceptedByName: d?.accepted_by_name,
      category: (d?.category || 'raw') as Donation['category'],
      expiresIn: d?.expires_in || '',
    };
  } catch (error) {
    console.error('Error converting donation:', error);
    return {
      id: '',
      donorId: '',
      donorName: 'Unknown',
      donorOrg: '',
      foodType: '',
      quantity: '',
      description: '',
      pickupTime: '',
      address: '',
      lat: 0,
      lng: 0,
      status: 'pending',
      createdAt: '',
      category: 'raw',
      expiresIn: '',
    };
  }
}

export function dbRequestToApp(r: any): FoodRequest {
  try {
    return {
      id: r?.id || '',
      requesterId: r?.requester_id || '',
      requesterName: r?.requester_name || 'Anonymous',
      requesterOrg: r?.requester_org || '',
      foodType: r?.food_type || '',
      quantity: r?.quantity || '',
      description: r?.description || '',
      urgency: (r?.urgency || 'medium') as FoodRequest['urgency'],
      address: r?.address || '',
      lat: r?.lat || 0,
      lng: r?.lng || 0,
      status: (r?.status || 'pending') as DonationStatus,
      createdAt: r?.created_at || '',
      fulfilledBy: r?.fulfilled_by,
      fulfilledByName: r?.fulfilled_by_name,
      beneficiaries: r?.beneficiaries || 0,
    };
  } catch (error) {
    console.error('Error converting request:', error);
    return {
      id: '',
      requesterId: '',
      requesterName: 'Unknown',
      requesterOrg: '',
      foodType: '',
      quantity: '',
      description: '',
      urgency: 'medium',
      address: '',
      lat: 0,
      lng: 0,
      status: 'pending',
      createdAt: '',
      beneficiaries: 0,
    };
  }
}

export function dbWarehouseToApp(w: any): Warehouse {
  try {
    return {
      id: w?.id || '',
      name: w?.name || 'Unknown Warehouse',
      address: w?.address || '',
      lat: w?.lat || 0,
      lng: w?.lng || 0,
      capacity: w?.capacity || 0,
      currentStock: w?.current_stock || 0,
      manager: w?.manager || '',
      phone: w?.phone || '',
      type: (w?.type || 'general') as Warehouse['type'],
      status: (w?.status || 'active') as Warehouse['status'],
    };
  } catch (error) {
    console.error('Error converting warehouse:', error);
    return {
      id: '',
      name: 'Unknown Warehouse',
      address: '',
      lat: 0,
      lng: 0,
      capacity: 0,
      currentStock: 0,
      manager: '',
      phone: '',
      type: 'general',
      status: 'active',
    };
  }
}
