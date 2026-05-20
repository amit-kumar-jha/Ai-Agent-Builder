import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
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

    // Fetch conversations for this agent.
    // Note: We might want to filter by ownerId if we add that to Conversation model,
    // but for now agentId is enough as it's unique to the owner's agent.
    const conversations = await Conversation.find({ agentId })
      .sort({ updatedAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: conversations });
  } catch (error: any) {
    console.error('Fetch conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
