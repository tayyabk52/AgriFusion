export interface BaseNotification {
  recipient_id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  category?: NotificationCategory;
  action_url?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

export type NotificationType =
  // Authentication & Security
  | 'email_verified'
  | 'password_reset'
  | 'security_alert'

  // Profile & Settings
  | 'profile_update'
  | 'avatar_updated'
  | 'settings_updated'

  // Farmer-Consultant Relationship
  | 'consultant_assigned'
  | 'consultant_removed'
  | 'farmer_linked'
  | 'farmer_created'
  | 'farmer_removed'

  // Account Status
  | 'account_activated'
  | 'account_suspended'
  | 'approval_pending'
  | 'approval_success'
  | 'approval_rejected'

  // Farm Management
  | 'farm_setup'
  | 'farm_update'

  // Admin & System (deferred)
  | 'consultant_pending_review'
  | 'farmer_status_change'

  // General
  | 'welcome'
  | 'system';

export type NotificationCategory =
  | 'authentication'
  | 'profile'
  | 'relationship'
  | 'status'
  | 'security'
  | 'system'
  | 'farm';

export interface NotificationTemplate {
  type: NotificationType;
  category: NotificationCategory;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  generateTitle: (context: any) => string;
  generateMessage: (context: any) => string;
  generateActionUrl?: (context: any) => string;
  generateMetadata?: (context: any) => Record<string, any>;
}

// Database notification interface (matches the actual DB schema)
export interface Notification {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  message: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  priority?: string | null;
  category?: string | null;
  action_url?: string | null;
  metadata?: Record<string, any> | null;
  expires_at?: string | null;
}
