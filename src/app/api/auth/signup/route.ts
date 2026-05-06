import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'agentos-super-secret-key-for-dev';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Please provide all fields' }, { status: 400 });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create token
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
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
