'use server';

import connectDB from '@/lib/mongoose';
import Agent from '@/models/Agent';
import { getCurrentUser } from './auth';
import { createNotification } from '@/lib/notifications';

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

    // Upsert the agent using explicit $set to avoid overwriting arrays like knowledge
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { $set: { ...data, user: user.id } },
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

    // Plan Limits
    const plan = user.plan || 'free';
    const limits: Record<string, number> = {
      free: 3,
      pro: 20,
      enterprise: 999999
    };

    const currentAgentCount = await Agent.countDocuments({ user: user.id });
    if (currentAgentCount >= limits[plan]) {
      return { 
        error: 'LIMIT_REACHED', 
        message: `You have reached the limit of ${limits[plan]} agents for your ${plan} plan.`,
        plan 
      };
    }

    const agent = await Agent.create({
      name: 'New Agent',
      user: user.id
    });

    await createNotification({
      userId: user.id,
      title: 'Agent Created',
      message: `Your new agent "${agent.name}" is ready for configuration.`,
      type: 'success',
      link: `/dashboard/agents/${agent._id}/builder`
    });
    
    return { success: true, agentId: agent._id.toString() };
  } catch (error: any) {
    return { error: 'Failed to create agent' };
  }
}

export async function deleteAgentAction(agentId: string) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const agent = await Agent.findOneAndDelete({ _id: agentId, user: user.id });
    if (!agent) return { error: 'Agent not found' };

    await createNotification({
      userId: user.id,
      title: 'Agent Deleted',
      message: `Agent "${agent.name}" has been permanently removed.`,
      type: 'warning'
    });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete agent' };
  }
}

export async function getDashboardStats() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return { error: 'Unauthorized' };

    const agents = await Agent.find({ user: user.id });

    // Aggregate real stats from agents
    let totalExecutions = 0;
    let totalSuccesses = 0;
    let totalErrors = 0;
    let totalCost = 0;
    let publishedCount = 0;
    let draftCount = 0;

    agents.forEach((a: any) => {
      const stats = a.stats || {};
      totalExecutions += stats.totalExecutions || 0;
      totalSuccesses += stats.successCount || 0;
      totalErrors += stats.errorCount || 0;
      totalCost += stats.costToDate || 0;
      if (a.status === 'published') publishedCount++;
      else draftCount++;
    });

    const successRate = totalExecutions > 0
      ? ((totalSuccesses / totalExecutions) * 100).toFixed(1)
      : '0';

    return {
      success: true,
      data: {
        totalAgents: agents.length,
        publishedCount,
        draftCount,
        totalExecutions,
        totalSuccesses,
        totalErrors,
        totalCost: parseFloat(totalCost.toFixed(4)),
        successRate: parseFloat(successRate),
      },
    };
  } catch (error) {
    return { error: 'Failed to load stats' };
  }
}
