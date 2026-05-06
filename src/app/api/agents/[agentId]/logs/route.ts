import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';
import ExecutionModel from '@/models/ExecutionModel';
import { getAuthUser } from '@/lib/auth';

// GET /api/agents/[agentId]/logs - Get execution logs
export async function GET(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
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

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const status = url.searchParams.get('status');

    const query: any = { agentId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const executions = await ExecutionModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await ExecutionModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: executions,
      pagination: { total, page, limit },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
