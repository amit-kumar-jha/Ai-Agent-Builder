import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import AgentModel from '@/models/AgentModel';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all public agents that are published
    const agents = await AgentModel.find({ 
      public: true, 
      status: 'published',
      deletedAt: null 
    }).sort({ 'stats.totalExecutions': -1 });

    return NextResponse.json({ success: true, data: agents });
  } catch (error: any) {
    console.error('Marketplace fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch marketplace agents' }, { status: 500 });
  }
}
