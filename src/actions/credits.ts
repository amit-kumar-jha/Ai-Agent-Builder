'use server';

import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getCurrentUser } from './auth';
import { PLAN_CREDITS } from '@/lib/constants';

/**
 * Get the current user's credit balance and usage info.
 * Handles monthly reset automatically.
 */
export async function getUserCredits() {
  try {
    await connectDB();
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: 'Unauthorized' };

    const user = await User.findById(currentUser.id);
    if (!user) return { error: 'User not found' };

    // ─── Auto-reset monthly credits if past reset date ───
    const now = new Date();
    if (user.creditsResetAt && now >= user.creditsResetAt) {
      const plan = user.plan || 'free';
      const planCredits = PLAN_CREDITS[plan] || 100;

      user.credits = planCredits;
      user.creditsUsed = 0;
      // Set next reset to first of next month
      user.creditsResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await user.save();
    }

    const plan = user.plan || 'free';
    const planLimit = PLAN_CREDITS[plan] || 100;
    const totalAvailable = user.credits + (user.bonusCredits || 0);
    const percentUsed = planLimit > 0 ? Math.round((user.creditsUsed / planLimit) * 100) : 0;

    return {
      success: true,
      data: {
        plan,
        planLimit,
        credits: user.credits,
        bonusCredits: user.bonusCredits || 0,
        totalAvailable,
        creditsUsed: user.creditsUsed || 0,
        percentUsed: Math.min(percentUsed, 100),
        resetsAt: user.creditsResetAt?.toISOString(),
      },
    };
  } catch (error) {
    console.error('getUserCredits error:', error);
    return { error: 'Failed to load credits' };
  }
}

/**
 * Deduct 1 credit for a chat message.
 * Returns { allowed: true } if the user has credits, or { allowed: false } if depleted.
 * This is called from the /api/chat route.
 */
export async function deductCredit(userId: string) {
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) return { allowed: false, reason: 'User not found' };

    // Check monthly reset
    const now = new Date();
    if (user.creditsResetAt && now >= user.creditsResetAt) {
      const plan = user.plan || 'free';
      user.credits = PLAN_CREDITS[plan] || 100;
      user.creditsUsed = 0;
      user.creditsResetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await user.save();
    }

    const totalAvailable = user.credits + (user.bonusCredits || 0);
    if (totalAvailable <= 0) {
      return {
        allowed: false,
        reason: 'NO_CREDITS',
        message: `You've used all your credits for this month. Upgrade your plan or purchase a credit pack.`,
      };
    }

    // Deduct: use plan credits first, then bonus credits
    if (user.credits > 0) {
      user.credits -= 1;
    } else if (user.bonusCredits > 0) {
      user.bonusCredits -= 1;
    }
    user.creditsUsed = (user.creditsUsed || 0) + 1;
    await user.save();

    return {
      allowed: true,
      remaining: user.credits + (user.bonusCredits || 0),
    };
  } catch (error) {
    console.error('deductCredit error:', error);
    // Fail open — don't block the user if credit check fails
    return { allowed: true, remaining: -1 };
  }
}

/**
 * Add bonus credits after a credit pack purchase.
 */
export async function addBonusCredits(userId: string, amount: number, priceInCents: number, stripePaymentId?: string) {
  try {
    await connectDB();
    await User.findByIdAndUpdate(userId, {
      $inc: { bonusCredits: amount },
      $push: {
        creditPurchases: {
          amount,
          price: priceInCents,
          stripePaymentId: stripePaymentId || 'manual',
          purchasedAt: new Date(),
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error('addBonusCredits error:', error);
    return { error: 'Failed to add credits' };
  }
}

/**
 * Update plan credits when a user upgrades their plan.
 */
export async function upgradePlanCredits(userId: string, newPlan: string) {
  try {
    await connectDB();
    const planCredits = PLAN_CREDITS[newPlan] || 100;
    await User.findByIdAndUpdate(userId, {
      $set: {
        plan: newPlan,
        credits: planCredits,
        creditsUsed: 0,
        creditsResetAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    });
    return { success: true };
  } catch (error) {
    console.error('upgradePlanCredits error:', error);
    return { error: 'Failed to upgrade plan' };
  }
}
