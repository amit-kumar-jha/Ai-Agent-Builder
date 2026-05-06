import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'agentos-super-secret-key-for-dev';

/**
 * Get authenticated user from cookies (for server actions) or Authorization header (for API routes).
 */
export async function getAuthUser(req?: Request) {
  await connectDB();

  // 1. Try Authorization header (API routes)
  if (req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id || decoded.userId);
        return user;
      } catch {
        return null;
      }
    }
  }

  // 2. Try HTTP-only cookie (server actions / SSR)
  try {
    const token = (await cookies()).get('agentos_token')?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id || decoded.userId).select('-password');
    return user;
  } catch {
    return null;
  }
}

/**
 * Generate JWT tokens
 */
export function generateTokens(userId: string) {
  const accessToken = jwt.sign({ id: userId, userId }, JWT_SECRET, { expiresIn: '30d' });
  const refreshToken = jwt.sign({ id: userId, userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '60d' });
  return { accessToken, refreshToken };
}

export { JWT_SECRET };
