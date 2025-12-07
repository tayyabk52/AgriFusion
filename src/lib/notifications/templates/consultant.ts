import { NotificationTemplate } from '@/types/notifications';

export const consultantTemplates: Record<string, NotificationTemplate> = {
  farmer_linked: {
    type: 'farmer_linked',
    category: 'relationship',
    priority: 'normal',
    generateTitle: () => 'New Farmer Added',
    generateMessage: (ctx: { farmerName: string }) =>
      `${ctx.farmerName} has been successfully added to your network`,
    generateActionUrl: () => '/dashboard/consultant/farmers',
    generateMetadata: (ctx) => ({ farmer_id: ctx.farmerId }),
  },

  farmer_created: {
    type: 'farmer_created',
    category: 'relationship',
    priority: 'normal',
    generateTitle: () => 'Farmer Account Created',
    generateMessage: (ctx: { farmerName: string }) =>
      `New farmer account for ${ctx.farmerName} has been created successfully`,
    generateActionUrl: () => '/dashboard/consultant/farmers',
    generateMetadata: (ctx) => ({ farmer_id: ctx.farmerId }),
  },

  farmer_removed: {
    type: 'farmer_removed',
    category: 'relationship',
    priority: 'normal',
    generateTitle: () => 'Farmer Removed',
    generateMessage: (ctx: { farmerName: string }) =>
      `${ctx.farmerName} has been removed from your network`,
    generateActionUrl: () => '/dashboard/consultant/farmers',
    generateMetadata: (ctx) => ({ farmer_id: ctx.farmerId }),
  },

  settings_updated: {
    type: 'settings_updated',
    category: 'profile',
    priority: 'normal',
    generateTitle: () => 'Settings Saved',
    generateMessage: () =>
      'Your profile and professional settings have been updated successfully',
    generateActionUrl: () => '/dashboard/consultant/settings',
  },

  approval_success: {
    type: 'approval_success',
    category: 'status',
    priority: 'high',
    generateTitle: () => 'Account Approved!',
    generateMessage: () =>
      'Congratulations! Your consultant account has been approved. You can now access all features.',
    generateActionUrl: () => '/dashboard/consultant',
  },

  approval_rejected: {
    type: 'approval_rejected',
    category: 'status',
    priority: 'high',
    generateTitle: () => 'Application Update',
    generateMessage: (ctx: { reason?: string }) =>
      ctx.reason
        ? `Your consultant application requires additional review. Reason: ${ctx.reason}`
        : 'Your consultant application requires additional review. Our team will contact you shortly.',
    generateActionUrl: () => '/dashboard/consultant',
    generateMetadata: (ctx) => ({ rejection_reason: ctx.reason }),
  },

  account_suspended: {
    type: 'account_suspended',
    category: 'status',
    priority: 'urgent',
    generateTitle: () => 'Account Suspended',
    generateMessage: () =>
      'Your account has been temporarily suspended. Please contact support for more information.',
    generateActionUrl: () => '/dashboard/consultant',
  },
};
