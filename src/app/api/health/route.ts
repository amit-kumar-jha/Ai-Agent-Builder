import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';

// GET /api/health - Health check
export async function GET() {
  let mongoStatus = 'disconnected';
  try {
    await connectDB();
    mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch {
    mongoStatus = 'error';
  }

  return NextResponse.json({
    status: 'ok',
    service: 'NexAgeAI',
    timestamp: new Date().toISOString(),
    mongoStatus,
    environment: process.env.NODE_ENV || 'development',
  });
}
