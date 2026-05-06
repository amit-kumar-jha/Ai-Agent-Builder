import { NextResponse } from 'next/server';
import { ToolExecutor } from '@/lib/engine/services/ToolExecutor';

const toolExecutor = new ToolExecutor();

// GET /api/tools - List all built-in tools
export async function GET() {
  const tools = toolExecutor.listTools();
  return NextResponse.json({
    success: true,
    count: tools.length,
    data: tools,
  });
}
