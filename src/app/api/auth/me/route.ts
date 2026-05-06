import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'agentos-super-secret-key-for-dev';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Get token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authorized, no token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return NextResponse.json({ error: 'Not authorized, user not found' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } catch (error) {
      return NextResponse.json({ error: 'Not authorized, token failed' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
