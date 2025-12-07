import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/lib/supabaseClient';
import { NotificationService } from '@/lib/notifications/NotificationService';

export function useNotifications() {
  const { profile, notifications, refreshNotifications } = useProfile();
  const service = new NotificationService(supabase);

  const markAsRead = async (notificationId: string) => {
    try {
      await service.markAsRead(notificationId);
      await refreshNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!profile) return;
    try {
      await service.markAllAsRead(profile.id);
      await refreshNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await service.delete(notificationId);
      await refreshNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: refreshNotifications,
  };
}
