'use server';

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

/**
 * Forgot Password — generates a reset token and returns a reset link.
 * In production, you would send this link via email (SendGrid, Resend, etc.)
 * For development, the link is returned directly to the UI.
 */
export async function forgotPasswordAction(formData: FormData) {
  try {
    await connectDB();
    const email = formData.get('email') as string;

    if (!email) {
      return { error: 'Please provide your email address' };
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists — always show success
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been generated.',
      };
    }

    // Generate a secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing (so DB compromise doesn't expose tokens)
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Store hashed token + 30 min expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    // Build reset URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    // In production: send email with resetUrl
    // For development: return the link directly
    console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`);

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been generated.',
      // DEV ONLY — remove in production
      resetUrl,
    };
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Reset Password — validates the token and updates the password.
 */
export async function resetPasswordAction(formData: FormData) {
  try {
    await connectDB();
    const token = formData.get('token') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!token || !email) {
      return { error: 'Invalid or expired reset link' };
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return { error: 'Invalid or expired reset link. Please request a new one.' };
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return {
      success: true,
      message: 'Your password has been reset successfully. You can now sign in.',
    };
  } catch (error: any) {
    console.error('Reset password error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
