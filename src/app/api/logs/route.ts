import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const store = getStore();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit') || 20), 100);
  return NextResponse.json({ success: true, data: store.getLogs(limit) });
}
