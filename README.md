# AgentLab 🚀

**Plataforma de pruebas del agente Antigravity** — Demo interactiva con Next.js 14, TypeScript y Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/agentlab)

## ✨ Características

- **Dashboard** — Landing page animada con hero y estadísticas
- **Gestor de Tareas** — CRUD completo con prioridades, estados y etiquetas
- **Editor de Notas** — Markdown con preview en vivo y categorías
- **API Explorer** — Interfaz tipo Postman para probar endpoints
- **Galería de Assets** — Imágenes generadas por IA con el agente

## 🔌 API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tasks` | Listar tareas (filtros: status, priority) |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |
| GET | `/api/notes` | Listar notas (filtro: category) |
| POST | `/api/notes` | Crear nota |
| GET | `/api/stats` | Estadísticas globales |
| GET | `/api/health` | Estado del sistema |
| GET | `/api/logs` | Logs de actividad |

## 🛠️ Stack

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: In-memory store (serverless-compatible)
- **Estilos**: CSS vanilla con design system dark mode
- **Deploy**: Vercel

## 🚀 Desarrollo local

```bash
git clone https://github.com/tu-usuario/agentlab
cd agentlab
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📁 Estructura

```
src/
├── app/
│   ├── page.tsx              # Dashboard principal
│   ├── demos/
│   │   ├── tasks/page.tsx    # Gestor de tareas
│   │   ├── notes/page.tsx    # Editor de notas
│   │   ├── api/page.tsx      # API Explorer
│   │   └── assets/page.tsx   # Galería de assets
│   └── api/                  # API Routes
│       ├── tasks/
│       ├── notes/
│       ├── stats/
│       ├── health/
│       └── logs/
├── components/
│   ├── Sidebar.tsx
│   └── FeatureCards.tsx
└── lib/
    └── store.ts              # In-memory data store
public/
└── assets/                   # Imágenes generadas por IA
```

## 🤖 Generado por

Este proyecto fue construido completamente por el agente **Antigravity** de Google DeepMind, incluyendo:
- Arquitectura y código fuente
- Assets visuales (IA generada)
- Publicación en GitHub
- Despliegue en Vercel

---

*AgentLab v1.0.0 · Antigravity Agent*
