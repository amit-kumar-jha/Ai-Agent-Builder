'use server';

import connectDB from '@/lib/mongoose';
import Agent from '@/models/Agent';
import { getCurrentUser } from './auth';

export async function getAgent(agentId: string) {
  try {
    await connectDB();
    
    // Support legacy "demo_1" logic for the UI if needed
    if (agentId.startsWith('demo_')) {
      return {
        agentName: 'Demo Agent',
        description: 'This is a demo agent.',
        model: 'llama3.2',
        systemPrompt: 'You are a helpful demo assistant.',
        temperature: 0.7,
        tools: { webSearch: true, customApi: false },
        memory: true
      };
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return { error: 'Agent not found' };
    }

    // Convert Mongoose document to plain object so it can be passed to client components
    return JSON.parse(JSON.stringify(agent));
  } catch (error) {
    return { error: 'Server error' };
  }
}

export async function saveAgent(agentId: string, data: any) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    // Support demo agent saving without auth
    if (agentId.startsWith('demo_')) {
      return { success: true, agent: data };
    }

    if (!user) {
      return { error: 'Unauthorized' };
    }

    // Upsert the agent
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { ...data, user: user.id },
      { new: true, upsert: true, runValidators: true }
    );
    
    return { success: true, agent: JSON.parse(JSON.stringify(agent)) };
  } catch (error: any) {
    console.error('Agent save error:', error);
    return { error: 'Failed to save agent' };
  }
}

export async function getMyAgents() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const agents = await Agent.find({ user: user.id }).sort('-updatedAt');
    return { data: JSON.parse(JSON.stringify(agents)) };
  } catch (error) {
    return { error: 'Server error' };
  }
}

export async function createAgentAction() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: 'Unauthorized' };
    }

    const agent = await Agent.create({
      name: 'New Agent',
      user: user.id
    });
    
    return { success: true, agentId: agent._id.toString() };
  } catch (error: any) {
    return { error: 'Failed to create agent' };
  }
}
