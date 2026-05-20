'use server';

import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getCurrentUser } from './auth';

export async function getWorkspaceSettings() {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { error: 'Unauthorized' };
    }

    const user = await User.findById(currentUser.id);
    return {
      success: true,
      data: {
        workspaceName: user.workspaceName,
        apiKey: user.apiKey,
        email: user.email,
        name: user.name,
        plan: user.plan,
        paypalPayoutEmail: user.paypalPayoutEmail,
      }
    };
  } catch (error) {
    return { error: 'Server error' };
  }
}

export async function updateWorkspace(data: { workspaceName: string; paypalPayoutEmail?: string }) {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    
    if (!currentUser) return { error: 'Unauthorized' };

    const updateData: any = { workspaceName: data.workspaceName };
    if (data.paypalPayoutEmail !== undefined) {
      updateData.paypalPayoutEmail = data.paypalPayoutEmail;
    }

    const user = await User.findByIdAndUpdate(
      currentUser.id,
      updateData,
      { new: true }
    );

    return { success: true, workspaceName: user.workspaceName };
  } catch (error) {
    return { error: 'Failed to update workspace' };
  }
}

export async function rollApiKey() {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: 'Unauthorized' };

    const newKey = 'sk-live-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const user = await User.findByIdAndUpdate(
      currentUser.id,
      { apiKey: newKey },
      { new: true }
    );

    return { success: true, apiKey: user.apiKey };
  } catch (error) {
    return { error: 'Failed to roll API Key' };
  }
}
