import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'agentos-super-secret-key-for-dev';

/**
 * Get the current user from the JWT cookie.
 * For use in API routes (not server actions).
 */
export async function getApiUser() {
  try {
    const token = (await cookies()).get('agentos_token')?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    await connectDB();

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return null;

    return {
      _id: user._id.toString(),
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan || 'free',
    };
  } catch {
    return null;
  }
}
