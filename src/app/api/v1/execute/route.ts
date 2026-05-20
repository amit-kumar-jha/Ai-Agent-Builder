import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Agent from '@/models/Agent';
import User from '@/models/User';
import { LLMClient } from '@/lib/engine/services/LLMClient';
import { deductCredit } from '@/actions/credits';

const llm = new LLMClient();

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid API Key' }, { status: 401 });
    }

    const apiKey = authHeader.split(' ')[1];
    await connectDB();

    // Authenticate user by API key
    const user = await User.findOne({ apiKey });
    if (!user) {
      return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 });
    }

    const { agentId, input, stream = false } = await req.json();
    if (!agentId || !input) {
      return NextResponse.json({ error: 'agentId and input are required' }, { status: 400 });
    }

    // Load agent
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Verify ownership or public status
    if (agent.userId.toString() !== user._id.toString() && !agent.public) {
      return NextResponse.json({ error: 'Unauthorized access to this agent' }, { status: 403 });
    }

    // Deduct credits
    const creditResult = await deductCredit(user._id.toString());
    if (!creditResult.allowed) {
      return NextResponse.json({ error: 'Insufficient credits', code: 'NO_CREDITS' }, { status: 402 });
    }

    // Execute agent (Simple mode for now)
    const result = await llm.chat({
      model: agent.model || 'gpt-4o',
      messages: [
        { role: 'system', content: agent.systemPrompt },
        { role: 'user', content: input }
      ],
      temperature: agent.temperature || 0.7
    });

    return NextResponse.json({
      success: true,
      output: result.text,
      usage: result.usage,
      agentId
    });

  } catch (error: any) {
    console.error('API Execute Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
