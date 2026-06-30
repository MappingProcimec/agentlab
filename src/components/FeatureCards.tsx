'use client';
import Link from 'next/link';

const features = [
  { href: '/demos/tasks', icon: '✓', title: 'Gestor de Tareas', desc: 'CRUD completo con prioridades, estados y etiquetas. Crea, edita y elimina tareas en tiempo real.', color: 'var(--cyan)', badge: 'CRUD', badgeClass: 'badge-cyan' },
  { href: '/demos/notes', icon: '◈', title: 'Editor de Notas', desc: 'Escribe notas con Markdown, organiza por categorías y fija las importantes.', color: 'var(--violet)', badge: 'Markdown', badgeClass: 'badge-violet' },
  { href: '/demos/api', icon: '⟡', title: 'API Explorer', desc: 'Interfaz tipo Postman para probar todos los endpoints REST del proyecto en vivo.', color: 'var(--pink)', badge: 'REST', badgeClass: 'badge-violet' },
  { href: '/demos/assets', icon: '◉', title: 'Galería de Assets', desc: 'Assets generados por el agente con IA. Explora las imágenes del proyecto.', color: 'var(--green)', badge: 'AI', badgeClass: 'badge-green' },
];

export function FeatureCards() {
  return (
    <div className="animate-slide-up stagger" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '4rem',
    }}>
      {features.map(f => (
        <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
          <div
            className="glass animate-slide-up"
            style={{ padding: '1.75rem', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', cursor: 'pointer', height: '100%' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${f.color}22`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', color: f.color,
              }}>
                {f.icon}
              </div>
              <span className={`badge ${f.badgeClass}`}>{f.badge}</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{f.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: f.color, fontWeight: 600 }}>Explorar →</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
