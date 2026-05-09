import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Notification from '@/models/Notification';
import { getCurrentUser } from '@/actions/auth';

export async function POST(req: Request, { params }: { params: { notificationId: string } }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const notificationId = params.notificationId;
    await Notification.updateOne(
      { _id: notificationId, userId: user._id },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
