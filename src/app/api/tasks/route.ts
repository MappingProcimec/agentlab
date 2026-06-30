import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET(req: NextRequest) {
  const start = Date.now();
  const store = getStore();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const priority = searchParams.get('priority') || undefined;
  const tasks = store.getTasks(status, priority);
  store.recordApiCall('GET', '/api/tasks', 200, Date.now() - start);
  return NextResponse.json({ success: true, data: tasks, total: tasks.length });
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  const store = getStore();
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }
    const task = store.createTask({
      title: body.title.trim(),
      description: body.description || '',
      priority: body.priority || 'medium',
      status: body.status || 'pending',
      tags: Array.isArray(body.tags) ? body.tags : [],
    });
    store.recordApiCall('POST', '/api/tasks', 201, Date.now() - start);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch {
    store.recordApiCall('POST', '/api/tasks', 400, Date.now() - start);
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}
