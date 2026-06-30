'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '⬡', label: 'Dashboard' },
  { href: '/demos/tasks', icon: '✓', label: 'Tareas' },
  { href: '/demos/notes', icon: '◈', label: 'Notas' },
  { href: '/demos/api', icon: '⟡', label: 'API Explorer' },
  { href: '/demos/assets', icon: '◉', label: 'Assets' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⬡</div>
        <span className="sidebar-logo-text">AgentLab</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navegación</div>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="nav-section-title" style={{ marginTop: '1.5rem' }}>API Endpoints</div>
        {['/api/tasks', '/api/notes', '/api/stats', '/api/health', '/api/logs'].map(ep => (
          <a
            key={ep}
            href={ep}
            target="_blank"
            rel="noreferrer"
            className="nav-item"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
          >
            <span className="nav-icon" style={{ color: 'var(--cyan)', fontSize: '0.6rem' }}>GET</span>
            {ep}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="db-status">
          <div className="db-status-dot" />
          <span>Store activo · in-memory</span>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Agente Antigravity · v1.0.0
        </div>
      </div>
    </aside>
  );
}
