import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const start = Date.now();
  const store = getStore();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const notes = store.getNotes(category);
  store.recordApiCall('GET', '/api/notes', 200, Date.now() - start);
  return NextResponse.json({ success: true, data: notes, total: notes.length });
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const store = getStore();
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    const note = store.createNote({
      title: body.title.trim(),
      content: body.content || '',
      category: body.category || 'general',
      pinned: body.pinned || false,
    });
    store.recordApiCall('POST', '/api/notes', 201, Date.now() - start);
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch {
    store.recordApiCall('POST', '/api/notes', 400, Date.now() - start);
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}
