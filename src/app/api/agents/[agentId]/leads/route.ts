import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Lead from '@/models/Lead';
import { getCurrentUser } from '@/actions/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { agentId } = await params;
    await connectDB();

    const leads = await Lead.find({ agentId, ownerId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: leads });
  } catch (error: any) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
