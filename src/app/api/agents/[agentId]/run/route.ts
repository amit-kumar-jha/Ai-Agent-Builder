import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';
import { AgentEngine } from '@/lib/engine/services/AgentEngine';

const engine = new AgentEngine();

// POST /api/agents/[agentId]/run - Execute agent (production, API key auth)
export async function POST(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    await connectDB();
    const { agentId } = await params;

    const agent = await AgentModel.findById(agentId);
    if (!agent) {
      return NextResponse.json({ success: false, error: { message: 'Agent not found' } }, { status: 404 });
    }

    const apiKey = req.headers.get('x-api-key');
    if (agent.apiKey !== apiKey) {
      return NextResponse.json({ success: false, error: { message: 'Invalid API key' } }, { status: 401 });
    }

    if (agent.status !== 'published') {
      return NextResponse.json({ success: false, error: { message: 'Agent not published' } }, { status: 400 });
    }

    const body = await req.json();
    const result = await engine.executeAgent(agentId, body, {
      userId: agent.userId || agent.user,
      source: 'api',
      ip: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || '',
    });

    return NextResponse.json({
      success: true,
      executionId: result.executionId,
      output: result.output,
      cost: result.totalCost,
      latency: result.totalLatency,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
