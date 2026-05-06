import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';
import { getAuthUser } from '@/lib/auth';
import { AgentEngine } from '@/lib/engine/services/AgentEngine';

const engine = new AgentEngine();

// POST /api/agents/[agentId]/test - Test agent execution
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

    const body = await req.json();
    const result = await engine.executeAgent(agentId, body, {
      userId: user._id,
      source: 'ui_test',
      ip: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      executionId: result.executionId,
      output: result.output,
      trace: result.trace,
      cost: result.totalCost,
      latency: result.totalLatency,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
