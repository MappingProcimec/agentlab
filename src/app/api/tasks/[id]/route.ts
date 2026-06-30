import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const store = getStore();
  const { id } = await params;
  const task = store.getTask(Number(id));
  if (!task) return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: task });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const start = Date.now();
  const store = getStore();
  const { id } = await params;
  try {
    const body = await req.json();
    const task = store.updateTask(Number(id), body);
    if (!task) {
      store.recordApiCall('PUT', `/api/tasks/${id}`, 404, Date.now() - start);
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    store.recordApiCall('PUT', `/api/tasks/${id}`, 200, Date.now() - start);
    return NextResponse.json({ success: true, data: task });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const start = Date.now();
  const store = getStore();
  const { id } = await params;
  const deleted = store.deleteTask(Number(id));
  store.recordApiCall('DELETE', `/api/tasks/${id}`, deleted ? 200 : 404, Date.now() - start);
  if (!deleted) return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Task deleted' });
}
