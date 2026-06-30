import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentLab — Plataforma de Pruebas Antigravity',
  description: 'Plataforma interactiva para probar las capacidades del agente Antigravity. Incluye gestor de tareas, notas, explorador de API y galería de assets con base de datos en tiempo real.',
  keywords: ['AgentLab', 'Antigravity', 'AI Agent', 'Next.js', 'Demo', 'API'],
  openGraph: {
    title: 'AgentLab — Plataforma de Pruebas',
    description: 'Demo interactiva del agente Antigravity con CRUD completo y API REST',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
