import { NotificationTemplate } from '@/types/notifications';

export const securityTemplates: Record<string, NotificationTemplate> = {
  security_alert: {
    type: 'security_alert',
    category: 'security',
    priority: 'high',
    generateTitle: (ctx: { alertType: string }) =>
      ctx.alertType || 'Security Alert',
    generateMessage: (ctx: { message: string }) => ctx.message,
    generateActionUrl: (ctx) => ctx.actionUrl || '/dashboard/settings',
    generateMetadata: (ctx) => ctx.metadata,
  },

  password_reset: {
    type: 'password_reset',
    category: 'security',
    priority: 'high',
    generateTitle: () => 'Password Reset Requested',
    generateMessage: () =>
      'A password reset link has been sent to your email. If you did not request this, please contact support immediately.',
    generateActionUrl: () => '/dashboard/settings',
  },

  email_verified: {
    type: 'email_verified',
    category: 'authentication',
    priority: 'normal',
    generateTitle: () => 'Email Verified',
    generateMessage: () =>
      'Your email has been successfully verified. You now have full access to all features.',
    generateActionUrl: () => '/dashboard',
  },

  avatar_updated: {
    type: 'avatar_updated',
    category: 'profile',
    priority: 'low',
    generateTitle: () => 'Profile Photo Updated',
    generateMessage: () =>
      'Your profile photo has been updated successfully',
    generateActionUrl: () => '/dashboard/settings',
  },
};
