import { BaseNotification, NotificationType, Notification } from '@/types/notifications';

export class NotificationService {
  private supabase: any;

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  /**
   * Create a notification using a registered template
   */
  async createFromTemplate(
    type: NotificationType,
    recipientId: string,
    context: any
  ): Promise<void> {
    // Import templates dynamically to avoid circular dependencies
    const { notificationTemplates } = await import('./templates');
    const template = notificationTemplates[type];

    if (!template) {
      console.error(`Unknown notification type: ${type}`);
      throw new Error(`Unknown notification type: ${type}`);
    }

    const notification: BaseNotification = {
      recipient_id: recipientId,
      type,
      category: template.category,
      priority: template.priority,
      title: template.generateTitle(context),
      message: template.generateMessage(context),
      action_url: template.generateActionUrl?.(context),
      metadata: template.generateMetadata?.(context),
    };

    await this.create(notification);
  }

  /**
   * Create a raw notification
   */
  async create(notification: BaseNotification): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .insert(notification);

    if (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Create multiple notifications (batch)
   */
  async createMany(notifications: BaseNotification[]): Promise<void> {
    if (notifications.length === 0) {
      return;
    }

    const { error } = await this.supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      console.error('Failed to create notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(recipientId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('recipient_id', recipientId)
      .eq('is_read', false);

    if (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async delete(notificationId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  /**
   * Get notifications for a recipient
   */
  async getForRecipient(
    recipientId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      category?: string;
    }
  ): Promise<Notification[]> {
    let query = this.supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('created_at', { ascending: false });

    if (options?.unreadOnly) {
      query = query.eq('is_read', false);
    }

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch notifications:', error);
      throw error;
    }

    return data || [];
  }
}
