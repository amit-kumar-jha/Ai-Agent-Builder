import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';
import ExecutionModel from '@/models/ExecutionModel';
import { getAuthUser } from '@/lib/auth';
import { validateWorkflow } from '@/lib/engine/utils/validators';
import { AgentEngine } from '@/lib/engine/services/AgentEngine';

const engine = new AgentEngine();

// GET /api/agents/[agentId] - Get single agent
export async function GET(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    await connectDB();
    const { agentId } = await params;

    // Support demo agents
    if (agentId.startsWith('demo_')) {
      return NextResponse.json({
        success: true,
        data: {
          _id: agentId,
          name: 'Demo Agent',
          description: 'This is a demo agent.',
          model: 'llama3.2',
          systemPrompt: 'You are a helpful demo assistant.',
          temperature: 0.7,
          tools: { webSearch: true, customApi: false },
          memory: true,
          status: 'draft',
          icon: '🤖',
          color: '#8B5CF6',
          stats: { totalExecutions: 0, successCount: 0, errorCount: 0, avgLatency: 0, costToDate: 0 },
          workflow: { nodes: [], connections: [] },
        },
      });
    }

    const agent = await AgentModel.findById(agentId).populate('user', 'whiteLabelEnabled');
    if (!agent) {
      return NextResponse.json({ success: false, error: { message: 'Agent not found' } }, { status: 404 });
    }

    // Transform to include whiteLabelEnabled at top level if needed, or just let client handle it
    const data = agent.toObject();
    const whiteLabelEnabled = agent.user?.whiteLabelEnabled || false;

    return NextResponse.json({ success: true, data: { ...data, whiteLabelEnabled } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

// PATCH /api/agents/[agentId] - Update agent
export async function PATCH(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
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

    const data = await req.json();
    const { name, description, workflow, settings, status, tags, icon, color, model, systemPrompt, temperature } = data;

    if (name) agent.name = name;
    if (description !== undefined) agent.description = description;
    if (workflow) { validateWorkflow(workflow); agent.workflow = workflow; }
    if (settings) agent.settings = { ...agent.settings, ...settings };
    if (status) agent.status = status;
    if (tags) agent.tags = tags;
    if (icon) agent.icon = icon;
    if (color) agent.color = color;
    if (model) agent.model = model;
    if (systemPrompt !== undefined) agent.systemPrompt = systemPrompt;
    if (temperature !== undefined) agent.temperature = temperature;

    agent.updatedAt = new Date();
    await agent.save();

    return NextResponse.json({ success: true, data: agent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

// POST /api/agents/[agentId] - Save agent (upsert, for backward compatibility)
export async function POST(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    const { agentId } = await params;
    const data = await req.json();

    if (agentId.startsWith('demo_')) {
      return NextResponse.json({ success: true, agent: data });
    }

    const agent = await AgentModel.findByIdAndUpdate(
      agentId,
      { ...data, user: user?._id, userId: user?._id },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: agent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

// DELETE /api/agents/[agentId] - Archive agent (soft delete)
export async function DELETE(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
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

    agent.deletedAt = new Date();
    await agent.save();

    return NextResponse.json({ success: true, message: 'Agent archived' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
