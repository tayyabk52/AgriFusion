import { NotificationTemplate } from '@/types/notifications';

export const farmerTemplates: Record<string, NotificationTemplate> = {
  consultant_assigned: {
    type: 'consultant_assigned',
    category: 'relationship',
    priority: 'high',
    generateTitle: () => 'Consultant Assigned',
    generateMessage: (ctx: { consultantName: string }) =>
      `${ctx.consultantName} has been assigned as your agricultural consultant`,
    generateActionUrl: () => '/dashboard/farmer/consultant',
    generateMetadata: (ctx) => ({ consultant_id: ctx.consultantId }),
  },

  consultant_removed: {
    type: 'consultant_removed',
    category: 'relationship',
    priority: 'high',
    generateTitle: () => 'Consultant Assignment Changed',
    generateMessage: (ctx: { consultantName: string }) =>
      `You have been unlinked from consultant ${ctx.consultantName}. A new consultant will be assigned soon.`,
    generateActionUrl: () => '/dashboard/farmer',
    generateMetadata: (ctx) => ({
      previous_consultant_id: ctx.consultantId,
      reason: ctx.reason
    }),
  },

  profile_update: {
    type: 'profile_update',
    category: 'profile',
    priority: 'normal',
    generateTitle: () => 'Profile Updated',
    generateMessage: (ctx: { updatedBy?: string }) =>
      ctx.updatedBy
        ? `Your profile was updated by ${ctx.updatedBy}`
        : 'Your profile has been updated successfully',
    generateActionUrl: () => '/dashboard/farmer/settings',
  },

  farm_setup: {
    type: 'farm_setup',
    category: 'farm',
    priority: 'normal',
    generateTitle: () => 'Farm Profile Configured',
    generateMessage: (ctx: { farmName: string; landSize: number }) =>
      `Your farm details have been set up: ${ctx.farmName} - ${ctx.landSize} acres`,
    generateActionUrl: () => '/dashboard/farmer/farm',
    generateMetadata: (ctx) => ({
      farm_name: ctx.farmName,
      land_size: ctx.landSize,
      crops: ctx.crops
    }),
  },

  farm_update: {
    type: 'farm_update',
    category: 'farm',
    priority: 'normal',
    generateTitle: () => 'Farm Details Updated',
    generateMessage: (ctx: { updateSummary: string }) =>
      `Your farm information has been updated: ${ctx.updateSummary}`,
    generateActionUrl: () => '/dashboard/farmer/farm',
    generateMetadata: (ctx) => ctx.metadata,
  },

  account_activated: {
    type: 'account_activated',
    category: 'status',
    priority: 'high',
    generateTitle: () => 'Account Activated',
    generateMessage: () =>
      'Your account is now active. You can log in and start using AgriFusion.',
    generateActionUrl: () => '/dashboard/farmer',
  },
};
