import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Lead from '@/models/Lead';
import Agent from '@/models/AgentModel';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId, name, email, company } = body;

    if (!agentId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Find agent to get ownerId
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const ownerId = agent.userId || agent.user;
    if (!ownerId) {
      return NextResponse.json({ error: 'Agent owner not found' }, { status: 404 });
    }

    // Create or update lead
    const lead = await Lead.findOneAndUpdate(
      { agentId, email },
      { 
        agentId, 
        ownerId, 
        name, 
        email, 
        company,
        source: 'chat_gate'
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    console.error('Lead capture error:', error);
    // If it's a duplicate key error (though findOneAndUpdate with upsert should handle it), just return success
    if (error.code === 11000) {
      return NextResponse.json({ success: true, message: 'Already captured' });
    }
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 });
  }
}
