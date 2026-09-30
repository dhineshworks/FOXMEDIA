export type LinkStatus = 'ACTIVE' | 'USED' | 'EXPIRED' | 'DISABLED' | 'LIMIT_REACHED';
export type UsageType = 'SINGLE' | 'MULTIPLE';
export type UserRole = 'admin' | 'customer' | 'staff';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface RedemptionLink {
  id: string;
  product_id: string;
  custom_name: string;
  token: string;
  target_url?: string | null;
  usage_type: UsageType;
  max_uses: number;
  current_uses: number;
  expires_at: string | null;
  status: LinkStatus;
  created_at: string;
  used_at: string | null;
  created_by?: string | null;
  product?: Product;
}

export interface RedemptionRecord {
  id: string;
  redemption_link_id: string;
  redemption_number: number;
  redeemed_at: string;
  ip_hash?: string | null;
  created_at?: string;
  custom_name?: string;
  product_name?: string;
}

export interface Settings {
  id: string;
  business_name: string;
  whatsapp_number: string;
  support_hours: string;
  website_url: string;
  adobe_target_url?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface ValidationResponse {
  valid: boolean;
  status: LinkStatus | 'INVALID';
  error?: string;
  product_name?: string;
  product_slug?: string;
  product_duration?: string;
  product_description?: string;
  product_features?: string[];
  usage_type?: UsageType;
  expires_at?: string | null;
  custom_name?: string;
  used_at?: string | null;
}

export interface RedeemResponse {
  success: boolean;
  status: LinkStatus | 'SUCCESS' | 'INVALID';
  message?: string;
  error?: string;
  target_url?: string;
  product_name?: string;
  duration?: string;
  redeemed_at?: string;
  redemption_number?: number;
}

export interface CreateLinkParams {
  productId: string;
  prefix: string;
  targetUrl?: string;
  expiration: string; // 'none' | '1h' | '6h' | '12h' | '1d' | '3d' | '7d' | custom ISO string
  usageType: UsageType;
  maxUses?: number;
  quantity: number;
}

