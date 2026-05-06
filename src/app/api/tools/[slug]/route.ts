import { NextResponse } from 'next/server';
import { ToolExecutor } from '@/lib/engine/services/ToolExecutor';

const toolExecutor = new ToolExecutor();

// GET /api/tools/[slug] - Get tool details
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolExecutor.getTool(slug);
  if (!tool) {
    return NextResponse.json({ success: false, error: { message: 'Tool not found' } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: tool });
}
