import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function GET() {
  const store = getStore();
  const logs = store.getLogs(20);
  const apiCalls = store.getApiCalls(10);
  return NextResponse.json({
    success: true,
    status: 'healthy',
    store: 'in-memory',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    memory: process.memoryUsage ? process.memoryUsage() : {},
    data: {
      tasks: store.getTasks().length,
      notes: store.getNotes().length,
      logs: logs.length,
      apiCalls: apiCalls.length,
    },
    recent_logs: logs.slice(0, 5),
    timestamp: new Date().toISOString(),
  });
}
