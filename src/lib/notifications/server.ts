import { createClient } from '@supabase/supabase-js';
import { NotificationService } from './NotificationService';
import { BaseNotification } from '@/types/notifications';

// Server-side Supabase client with service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const notificationService = new NotificationService(supabaseAdmin);

/**
 * Helper: Notify farmer of consultant assignment
 */
export async function notifyConsultantAssigned(
  farmerId: string,
  consultantName: string,
  consultantId: string
) {
  await notificationService.createFromTemplate(
    'consultant_assigned',
    farmerId,
    { consultantName, consultantId }
  );
}

/**
 * Helper: Notify consultant of new farmer link
 */
export async function notifyFarmerLinked(
  consultantId: string,
  farmerName: string,
  farmerId: string
) {
  await notificationService.createFromTemplate(
    'farmer_linked',
    consultantId,
    { farmerName, farmerId }
  );
}

/**
 * Helper: Notify both parties on farmer-consultant link
 */
export async function notifyFarmerConsultantLink(
  farmerId: string,
  farmerName: string,
  consultantId: string,
  consultantName: string
) {
  const notifications: BaseNotification[] = [
    {
      recipient_id: farmerId,
      type: 'consultant_assigned',
      category: 'relationship',
      priority: 'high',
      title: 'Consultant Assigned',
      message: `${consultantName} is now your agricultural consultant`,
      action_url: '/dashboard/farmer/consultant',
      metadata: { consultant_id: consultantId },
    },
    {
      recipient_id: consultantId,
      type: 'farmer_linked',
      category: 'relationship',
      priority: 'normal',
      title: 'New Farmer Added',
      message: `${farmerName} has been added to your network`,
      action_url: '/dashboard/consultant/farmers',
      metadata: { farmer_id: farmerId },
    },
  ];

  await notificationService.createMany(notifications);
}

/**
 * Helper: Notify farmer of consultant removal
 */
export async function notifyConsultantRemoved(
  farmerId: string,
  consultantName: string,
  consultantId: string,
  reason?: string
) {
  await notificationService.createFromTemplate(
    'consultant_removed',
    farmerId,
    { consultantName, consultantId, reason }
  );
}

/**
 * Helper: Notify consultant of farmer creation
 */
export async function notifyFarmerCreated(
  consultantId: string,
  farmerName: string,
  farmerId: string
) {
  await notificationService.createFromTemplate(
    'farmer_created',
    consultantId,
    { farmerName, farmerId }
  );
}

/**
 * Helper: Notify farmer of account activation
 */
export async function notifyAccountActivated(farmerId: string) {
  await notificationService.createFromTemplate(
    'account_activated',
    farmerId,
    {}
  );
}

/**
 * Helper: Notify farmer of farm setup
 */
export async function notifyFarmSetup(
  farmerId: string,
  farmName: string,
  landSize: number,
  crops?: string[]
) {
  await notificationService.createFromTemplate(
    'farm_setup',
    farmerId,
    { farmName, landSize, crops }
  );
}

/**
 * Helper: Notify user of profile update
 */
export async function notifyProfileUpdate(
  recipientId: string,
  updatedBy?: string
) {
  await notificationService.createFromTemplate(
    'profile_update',
    recipientId,
    { updatedBy }
  );
}

/**
 * Helper: Notify user of security alert
 */
export async function notifySecurityAlert(
  recipientId: string,
  alertType: string,
  message: string,
  actionUrl?: string,
  metadata?: Record<string, any>
) {
  await notificationService.createFromTemplate(
    'security_alert',
    recipientId,
    { alertType, message, actionUrl, metadata }
  );
}

/**
 * Helper: Notify consultant of approval status change
 */
export async function notifyApprovalStatus(
  consultantId: string,
  status: 'approved' | 'rejected',
  reason?: string
) {
  const type = status === 'approved' ? 'approval_success' : 'approval_rejected';
  await notificationService.createFromTemplate(
    type,
    consultantId,
    { reason }
  );
}

/**
 * Helper: Notify user of avatar update
 */
export async function notifyAvatarUpdated(recipientId: string) {
  await notificationService.createFromTemplate(
    'avatar_updated',
    recipientId,
    {}
  );
}

/**
 * Helper: Notify consultant of settings update
 */
export async function notifySettingsUpdated(consultantId: string) {
  await notificationService.createFromTemplate(
    'settings_updated',
    consultantId,
    {}
  );
}
