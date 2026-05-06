'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'agentos-super-secret-key-for-dev';

export async function signUpAction(formData: FormData) {
  try {
    await connectDB();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { error: 'Please provide all fields' };
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return { error: 'User already exists' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    (await cookies()).set('agentos_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return { success: true, user: { _id: user._id.toString(), id: user._id.toString(), name: user.name, email: user.email, plan: 'free', credits: 100 } };
  } catch (error: any) {
    return { error: error.message || 'Server error' };
  }
}

export async function signInAction(formData: FormData) {
  try {
    await connectDB();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Please provide email and password' };
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid credentials' };
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

    (await cookies()).set('agentos_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return { success: true, user: { _id: user._id.toString(), id: user._id.toString(), name: user.name, email: user.email, plan: 'free', credits: 100 } };
  } catch (error: any) {
    return { error: 'Server error' };
  }
}

export async function logoutAction() {
  (await cookies()).delete('agentos_token');
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const token = (await cookies()).get('agentos_token')?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, JWT_SECRET);
    await connectDB();
    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return null;

    return { _id: user._id.toString(), id: user._id.toString(), name: user.name, email: user.email, role: user.role, plan: 'free', credits: 100 };
  } catch {
    return null;
  }
}
