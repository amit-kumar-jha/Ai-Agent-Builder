import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'agentos-super-secret-key-for-dev';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '30d',
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
