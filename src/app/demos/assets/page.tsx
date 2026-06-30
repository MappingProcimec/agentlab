'use client';

const ASSETS = [
  {
    id: 'logo',
    title: 'AgentLab Logo',
    desc: 'Logo hexagonal con neon cyan y circuitos. Generado por el agente con IA.',
    tags: ['branding', 'logo', 'ai-generated'],
    url: '/assets/agentlab_logo.png',
    type: 'Logo',
  },
  {
    id: 'hero',
    title: 'Hero Background',
    desc: 'Fondo abstracto futurista dark con partículas de neón violeta y cyan.',
    tags: ['background', 'hero', 'ai-generated'],
    url: '/assets/agentlab_hero_bg.png',
    type: 'Background',
  },
];

const typeBadge: Record<string, string> = {
  Logo: 'badge-cyan',
  Background: 'badge-violet',
  Icon: 'badge-green',
  UI: 'badge-orange',
};

export default function AssetsPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>◉ Galería de Assets</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Imágenes generadas por el agente Antigravity con IA</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-green">✓ {ASSETS.length} assets</span>
          <span className="badge badge-violet">AI Generated</span>
        </div>
      </div>

      <div className="page-content">
        <div className="glass animate-fade-in" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            ✨ Todos los assets fueron generados automáticamente por el <strong style={{ color: 'var(--text-primary)' }}>agente Antigravity</strong> usando generación de imágenes con IA durante la construcción del proyecto.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {ASSETS.map((asset, i) => (
            <div
              key={asset.id}
              className="glass animate-slide-up"
              style={{
                overflow: 'hidden',
                animationDelay: `${i * 80}ms`,
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              {/* Image Preview */}
              <div style={{
                height: '200px',
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                borderBottom: '1px solid var(--border)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => {
                    const t = e.currentTarget;
                    t.style.display = 'none';
                    if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = 'flex';
                  }}
                />
                <div style={{
                  display: 'none', position: 'absolute', inset: 0,
                  alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem',
                }}>
                  <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>◉</span>
                  <span>Asset no disponible en dev</span>
                  <span style={{ fontSize: '0.7rem' }}>Disponible en producción</span>
                </div>
                <div style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem',
                }}>
                  <span className={`badge ${typeBadge[asset.type] || 'badge-gray'}`}>{asset.type}</span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.95rem' }}>{asset.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>{asset.desc}</p>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {asset.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={asset.url}
                    download
                    className="btn btn-ghost btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                    id={`download-${asset.id}`}
                  >
                    ↓ Descargar
                  </a>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-sm btn-icon"
                    id={`view-${asset.id}`}
                  >
                    ↗
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Generate CTA */}
          <div className="glass animate-slide-up" style={{
            padding: '2rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', gap: '1rem',
            border: '1px dashed rgba(139,92,246,0.3)',
            animationDelay: `${ASSETS.length * 80}ms`,
            minHeight: '300px',
          }}>
            <div style={{ fontSize: '3rem', opacity: 0.4 }}>✦</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Generar más assets
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              El agente puede generar nuevas imágenes con IA bajo demanda. Pídele al agente que genere assets adicionales.
            </p>
            <span className="badge badge-violet">Powered by Antigravity</span>
          </div>
        </div>

        {/* Info panel */}
        <div className="glass animate-fade-in" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            ✦ Cómo funciona la generación de assets
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { step: '1', title: 'Prompt de diseño', desc: 'El agente describe el asset con parámetros de estilo, colores y composición.' },
              { step: '2', title: 'Generación con IA', desc: 'La herramienta generate_image crea la imagen usando modelos de difusión.' },
              { step: '3', title: 'Guardado automático', desc: 'El asset se guarda en /public/assets/ y queda disponible en la web.' },
              { step: '4', title: 'Integración', desc: 'Se usa directamente en el código como cualquier imagen estática.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--grad-primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
