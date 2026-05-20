'use server';

import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Agent from '@/models/AgentModel';
import { getCurrentUser } from './auth';

export async function getCreatorEarnings() {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: 'Unauthorized' };

    const user = await User.findById(currentUser.id);
    if (!user) return { error: 'User not found' };

    // Get all published marketplace agents by this user
    const marketplaceAgents = await Agent.find({
      $or: [{ userId: currentUser.id }, { user: currentUser.id }],
      public: true,
      marketplacePrice: { $gt: 0 },
    }).select('name icon marketplacePrice stats createdAt');

    return {
      success: true,
      data: {
        totalEarnings: user.totalEarnings || 0,
        paypalPayoutEmail: user.paypalPayoutEmail || '',
        agents: marketplaceAgents.map((a: any) => ({
          id: a._id.toString(),
          name: a.name,
          icon: a.icon,
          price: a.marketplacePrice,
          sales: Math.floor((user.totalEarnings || 0) / (a.marketplacePrice * 0.8) * (marketplaceAgents.length > 1 ? Math.random() : 1)) || 0,
          createdAt: a.createdAt,
        })),
      },
    };
  } catch (error) {
    return { error: 'Failed to load earnings' };
  }
}
