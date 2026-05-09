import { NextResponse } from 'next/server';
import { getApiUser } from '@/lib/api-auth';
import connectDB from '@/lib/mongoose';
import Agent from '@/models/Agent';

export async function POST(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await getApiUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized — please log in first' }, { status: 401 });
    }

    const { agentId } = await params;

    let formData;
    try {
      formData = await req.formData();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string;

    let textContent = '';
    let fileName = '';
    let fileSize = 0;

    if (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch URL');
        const html = await response.text();
        
        // Simple HTML to text extraction
        textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
          
        fileName = new URL(url).hostname + new URL(url).pathname;
        if (fileName.endsWith('/')) fileName = fileName.slice(0, -1);
        fileName = 'web_scrape_' + fileName.replace(/[^a-z0-9]/gi, '_') + '.txt';
        fileSize = textContent.length;
      } catch (e) {
        return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 400 });
      }
    } else if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = ['.txt', '.md', '.csv', '.json', '.log', '.xml', '.html', '.pdf'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!allowedTypes.includes(ext)) {
        return NextResponse.json({ error: `Unsupported file type: ${ext}. Allowed: ${allowedTypes.join(', ')}` }, { status: 400 });
      }

      try {
        if (ext === '.pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const pdfParse = require('pdf-parse');
          const pdfData = await pdfParse(buffer);
          textContent = pdfData.text;
        } else {
          textContent = await file.text();
        }
      } catch (e) {
        return NextResponse.json({ error: 'Could not read file content. Make sure the file is valid.' }, { status: 400 });
      }
      
      fileName = file.name;
      fileSize = file.size;
    } else {
      return NextResponse.json({ error: 'No file or url provided.' }, { status: 400 });
    }

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json({ error: 'Content is empty.' }, { status: 400 });
    }

    await connectDB();
    const agent = await Agent.findOne({ _id: agentId, $or: [{ user: user.id }, { userId: user.id }] });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found or you do not have access' }, { status: 404 });
    }

    // Initialize knowledge array if it doesn't exist (for agents created before this feature)
    if (!agent.knowledge) {
      agent.knowledge = [];
    }

    // Check for duplicate filename
    const existingIndex = agent.knowledge.findIndex((k: any) => k.fileName === fileName);
    if (existingIndex >= 0) {
      // Replace existing document
      agent.knowledge[existingIndex] = {
        fileName: fileName,
        content: textContent,
        size: fileSize,
        uploadedAt: new Date(),
      };
    } else {
      // Add new document
      agent.knowledge.push({
        fileName: fileName,
        content: textContent,
        size: fileSize,
        uploadedAt: new Date(),
      });
    }

    await agent.save();

    const savedDoc = agent.knowledge.find((k: any) => k.fileName === fileName);

    return NextResponse.json({
      success: true,
      document: {
        fileName: fileName,
        size: fileSize,
        uploadedAt: savedDoc?.uploadedAt || new Date(),
      },
      totalDocuments: agent.knowledge.length,
    });
  } catch (error: any) {
    console.error('Knowledge upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload document' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await getApiUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { agentId } = await params;

    await connectDB();
    const agent = await Agent.findOne({ _id: agentId, $or: [{ user: user.id }, { userId: user.id }] }).select('knowledge');

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // Return documents without the full content (just metadata)
    const documents = (agent.knowledge || []).map((k: any) => ({
      fileName: k.fileName,
      size: k.size,
      uploadedAt: k.uploadedAt,
    }));

    return NextResponse.json({ success: true, documents });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list documents' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ agentId: string }> }) {
  try {
    const user = await getApiUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { agentId } = await params;

    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) return NextResponse.json({ error: 'fileName query param required' }, { status: 400 });

    await connectDB();
    const result = await Agent.findOneAndUpdate(
      { _id: agentId, $or: [{ user: user.id }, { userId: user.id }] },
      { $pull: { knowledge: { fileName } } },
      { new: true }
    );

    if (!result) {
      console.log('DELETE failed: Agent not found', { agentId, userId: user.id });
      return NextResponse.json({ error: 'Agent not found or you do not have permission' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      totalDocuments: result.knowledge.length,
    });
  } catch (error) {
    console.error('DELETE Knowledge error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
