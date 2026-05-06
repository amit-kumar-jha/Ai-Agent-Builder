import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';
import { getAuthUser } from '@/lib/auth';

// POST /api/agents/[agentId]/publish - Publish agent
export async function POST(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { agentId } = await params;
    const agent = await AgentModel.findById(agentId);
    if (!agent) {
      return NextResponse.json({ success: false, error: { message: 'Agent not found' } }, { status: 404 });
    }

    agent.status = 'published';
    agent.updatedAt = new Date();
    await agent.save();

    return NextResponse.json({ success: true, data: agent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
