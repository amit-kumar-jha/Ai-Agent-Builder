import connectDB from './mongoose';
import Notification from '@/models/Notification';

export async function createNotification({
  userId,
  title,
  message,
  type = 'info',
  link
}: {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}) {
  try {
    await connectDB();
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link
    });
    return { success: true, data: notification };
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return { success: false, error: error.message };
  }
}
