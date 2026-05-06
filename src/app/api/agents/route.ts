import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';
import { getAuthUser } from '@/lib/auth';
import { generateApiKey } from '@/lib/engine/utils/helpers';

function defaultWorkflow() {
  return {
    nodes: [
      { id: 'node_input', type: 'input', label: 'Input', position: { x: 250, y: 50 }, config: { schema: { text: { type: 'string', description: 'Input text' } } } },
      { id: 'node_llm', type: 'llm', label: 'Process with LLM', position: { x: 250, y: 200 }, config: { model: 'gpt-4', prompt: 'Process this input:\n\n{{text}}', systemPrompt: 'You are a helpful assistant.', temperature: 0.7, maxTokens: 1000 } },
      { id: 'node_output', type: 'output', label: 'Output', position: { x: 250, y: 350 }, config: { outputSchema: { result: '{{node_llm.outputs}}' } } },
    ],
    connections: [
      { from: 'node_input', to: 'node_llm' },
      { from: 'node_llm', to: 'node_output' },
    ],
  };
}

// GET /api/agents - List agents
export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');

    const query: any = {
      $or: [{ userId: user._id }, { user: user._id }],
      deletedAt: null,
    };
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const agents = await AgentModel.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AgentModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: agents,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}

// POST /api/agents - Create agent
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, workflow, template } = data;

    if (!name || name.length < 1) {
      return NextResponse.json({ success: false, error: { message: 'Name is required' } }, { status: 400 });
    }

    const agent = new AgentModel({
      userId: user._id,
      user: user._id,
      name,
      description: description || '',
      workflow: workflow || defaultWorkflow(),
      status: 'draft',
      version: '0.1.0',
      activeVersion: '0.1.0',
      versions: [{
        version: '0.1.0',
        createdAt: new Date(),
        createdBy: user._id,
        workflow: workflow || defaultWorkflow(),
        changelog: 'Initial version',
      }],
      apiKey: generateApiKey('agent'),
      icon: data.icon || '🤖',
      color: data.color || '#8B5CF6',
      tags: data.tags || [],
      model: data.model || 'gpt-4',
      systemPrompt: data.systemPrompt || 'You are a helpful assistant.',
      temperature: data.temperature ?? 0.7,
    });

    await agent.save();
    return NextResponse.json({ success: true, data: agent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }
}
