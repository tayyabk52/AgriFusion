import { NotificationTemplate, NotificationType } from '@/types/notifications';
import { consultantTemplates } from './consultant';
import { farmerTemplates } from './farmer';
import { securityTemplates } from './security';
import { systemTemplates } from './system';

export const notificationTemplates: Record<NotificationType, NotificationTemplate> = {
  // Merge all template modules
  ...consultantTemplates,
  ...farmerTemplates,
  ...securityTemplates,
  ...systemTemplates,
} as Record<NotificationType, NotificationTemplate>;
