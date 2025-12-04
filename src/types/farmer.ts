export interface FarmerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'active';
}

export interface FarmerData {
  id: string;
  profile_id: string;
  consultant_id?: string;
  farm_name?: string;
  district?: string;
  state?: string;
  land_size_acres?: number;
  current_crops?: string[];
  created_at: string;
  updated_at: string;
}

export interface FarmerWithProfile extends FarmerData {
  profiles: FarmerProfile;
}

export interface FarmerStats {
  total: number;
  active: number;
  newThisMonth: number;
  pending: number;
}

export interface FilterState {
  status: 'all' | 'active' | 'inactive';
  state?: string;
  crop?: string;
}
