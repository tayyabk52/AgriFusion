import { NotificationTemplate } from '@/types/notifications';

export const systemTemplates: Record<string, NotificationTemplate> = {
  welcome: {
    type: 'welcome',
    category: 'system',
    priority: 'normal',
    generateTitle: () => 'Welcome to AgriFusion!',
    generateMessage: (ctx: { message?: string }) =>
      ctx.message ||
      'Thank you for joining AgriFusion. We are excited to have you on board!',
    generateActionUrl: (ctx) => ctx.actionUrl || '/dashboard',
    generateMetadata: (ctx) => ctx.metadata,
  },

  approval_pending: {
    type: 'approval_pending',
    category: 'status',
    priority: 'normal',
    generateTitle: () => 'Application Submitted',
    generateMessage: () =>
      'Your application has been submitted. Our team will review your credentials within 2-3 business days.',
    generateActionUrl: () => '/dashboard',
  },

  system: {
    type: 'system',
    category: 'system',
    priority: 'normal',
    generateTitle: (ctx: { title: string }) => ctx.title,
    generateMessage: (ctx: { message: string }) => ctx.message,
    generateActionUrl: (ctx) => ctx.actionUrl,
    generateMetadata: (ctx) => ctx.metadata,
  },

  // Admin/System notifications (deferred but included for completeness)
  consultant_pending_review: {
    type: 'consultant_pending_review',
    category: 'system',
    priority: 'normal',
    generateTitle: () => 'New Consultant Registration',
    generateMessage: (ctx: { consultantName: string }) =>
      `${ctx.consultantName} has submitted their registration for approval`,
    generateActionUrl: () => '/admin/approvals',
    generateMetadata: (ctx) => ({
      consultant_id: ctx.consultantId,
      submitted_at: ctx.submittedAt
    }),
  },

  farmer_status_change: {
    type: 'farmer_status_change',
    category: 'system',
    priority: 'normal',
    generateTitle: () => 'Farmer Status Changed',
    generateMessage: (ctx: { farmerName: string; newStatus: string }) =>
      `${ctx.farmerName} status changed to ${ctx.newStatus}`,
    generateActionUrl: () => '/admin/farmers',
    generateMetadata: (ctx) => ({
      farmer_id: ctx.farmerId,
      old_status: ctx.oldStatus,
      new_status: ctx.newStatus
    }),
  },
};
