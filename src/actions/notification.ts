'use client';
import { getCurrentUser } from './auth';

export async function getNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const response = await fetch('/api/notifications', {
      method: 'GET',
    });
    
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const response = await fetch('/api/notifications/read-all', {
      method: 'POST',
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to mark all as read' };
  }
}
