import Link from 'next/link';
import type { Metadata } from 'next';
import { FeatureCards } from '@/components/FeatureCards';

export const metadata: Metadata = {
  title: 'AgentLab — Dashboard',
};

const endpoints = [
  { method: 'GET', path: '/api/tasks', desc: 'Listar todas las tareas' },
  { method: 'POST', path: '/api/tasks', desc: 'Crear nueva tarea' },
  { method: 'PUT', path: '/api/tasks/:id', desc: 'Actualizar tarea' },
  { method: 'DELETE', path: '/api/tasks/:id', desc: 'Eliminar tarea' },
  { method: 'GET', path: '/api/notes', desc: 'Listar todas las notas' },
  { method: 'POST', path: '/api/notes', desc: 'Crear nueva nota' },
  { method: 'GET', path: '/api/stats', desc: 'Estadísticas globales' },
  { method: 'GET', path: '/api/health', desc: 'Estado del sistema' },
];

const methodColor: Record<string, string> = {
  GET: 'badge-cyan', POST: 'badge-green', PUT: 'badge-orange', DELETE: 'badge-red',
};

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--grad-hero)', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        top: '-100px', right: '-100px', pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        bottom: '-50px', left: '-50px', pointerEvents: 'none',
        animation: 'float 10s ease-in-out infinite reverse',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem' }}>
        {/* Hero */}
        <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '1.5rem',
            fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            Agente Antigravity · v1.0.0 · Activo
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
            <span className="gradient-text">AgentLab</span>
            <br />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.55em' }}>Plataforma de Pruebas</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Demo interactiva del agente <strong style={{ color: 'var(--text-primary)' }}>Antigravity</strong>.
            Explora CRUD completo, API REST, notas Markdown y galería de assets generados con IA.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demos/tasks" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              ⬡ Explorar Demos
            </Link>
            <a href="/api/health" target="_blank" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
              ⟡ Estado del Sistema
            </a>
          </div>
        </div>

        {/* Feature Cards (Client Component for hover effects) */}
        <FeatureCards />

        {/* API Reference */}
        <div className="glass animate-fade-in" style={{ padding: '2rem', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>⟡ API Reference</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            8 endpoints REST disponibles. Haz clic en los GET para verlos en vivo.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.6rem' }}>
            {endpoints.map((ep, i) => (
              <a
                key={i}
                href={ep.method === 'GET' ? ep.path.replace(':id', '1') : undefined}
                target={ep.method === 'GET' ? '_blank' : undefined}
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                <span className={`badge ${methodColor[ep.method]}`} style={{ minWidth: 52, justifyContent: 'center' }}>
                  {ep.method}
                </span>
                <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-primary)', flex: 1 }}>
                  {ep.path}
                </code>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ep.desc}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <p>Construido con <strong style={{ color: 'var(--text-secondary)' }}>Next.js 14</strong> · <strong style={{ color: 'var(--text-secondary)' }}>TypeScript</strong> · <strong style={{ color: 'var(--text-secondary)' }}>Vercel</strong> · generado por <span className="gradient-text" style={{ fontWeight: 700 }}>Antigravity Agent</span></p>
        </div>
      </div>
    </div>
  );
}
