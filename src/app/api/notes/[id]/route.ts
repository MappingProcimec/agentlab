import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const store = getStore();
  const { id } = await params;
  const note = store.getNote(Number(id));
  if (!note) return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: note });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const start = Date.now();
  const store = getStore();
  const { id } = await params;
  try {
    const body = await req.json();
    const note = store.updateNote(Number(id), body);
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    store.recordApiCall('PUT', `/api/notes/${id}`, 200, Date.now() - start);
    return NextResponse.json({ success: true, data: note });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const start = Date.now();
  const store = getStore();
  const { id } = await params;
  const deleted = store.deleteNote(Number(id));
  store.recordApiCall('DELETE', `/api/notes/${id}`, deleted ? 200 : 404, Date.now() - start);
  if (!deleted) return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Note deleted' });
}
