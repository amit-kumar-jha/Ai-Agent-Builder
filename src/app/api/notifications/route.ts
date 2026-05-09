import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { getCurrentUser } from '@/actions/auth';

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
