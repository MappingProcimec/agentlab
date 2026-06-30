/**
 * In-memory data store — works in both local dev and Vercel serverless.
 * Uses module-level singleton so data persists between requests in the same instance.
 * For production persistence, swap this for @vercel/postgres or Turso.
 */

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  entity: string;
  entity_id: number;
  details: string;
  timestamp: string;
}

export interface ApiCall {
  id: number;
  method: string;
  endpoint: string;
  status_code: number;
  response_time_ms: number;
  timestamp: string;
}

const now = () => new Date().toISOString();
const dateOf = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

// ── Seed Data ──────────────────────────────────────────────
const seedTasks: Task[] = [
  { id: 1, title: 'Configurar base de datos', description: 'Implementar store en memoria con seed data para demos del agente', priority: 'high', status: 'completed', tags: ['backend', 'db'], created_at: dateOf(7), updated_at: dateOf(5) },
  { id: 2, title: 'Diseñar sistema dark mode', description: 'Crear CSS variables y tokens para el tema oscuro futurista con glassmorphism', priority: 'high', status: 'completed', tags: ['ui', 'design'], created_at: dateOf(6), updated_at: dateOf(4) },
  { id: 3, title: 'Crear API REST completa', description: 'Implementar todos los endpoints CRUD para tasks y notes', priority: 'critical', status: 'completed', tags: ['api', 'backend'], created_at: dateOf(5), updated_at: dateOf(1) },
  { id: 4, title: 'Integrar glassmorphism', description: 'Aplicar efectos de vidrio esmerilado en cards y modales con blur effects', priority: 'medium', status: 'in_progress', tags: ['ui', 'css', 'animations'], created_at: dateOf(4), updated_at: dateOf(1) },
  { id: 5, title: 'Publicar en GitHub & Vercel', description: 'Configurar CI/CD, publicar el repositorio y desplegar en producción', priority: 'critical', status: 'in_progress', tags: ['devops', 'deploy'], created_at: dateOf(2), updated_at: now() },
  { id: 6, title: 'Agregar animaciones de entrada', description: 'Implementar fade-in y slide-up en todas las secciones con stagger', priority: 'low', status: 'pending', tags: ['ui', 'animation'], created_at: dateOf(3), updated_at: dateOf(3) },
  { id: 7, title: 'Probar flujo end-to-end', description: 'Verificar que todo funcione desde API hasta UI en producción', priority: 'high', status: 'pending', tags: ['testing', 'qa'], created_at: dateOf(1), updated_at: dateOf(1) },
  { id: 8, title: 'Documentar API endpoints', description: 'Escribir documentación completa con ejemplos de request/response', priority: 'low', status: 'pending', tags: ['docs'], created_at: dateOf(1), updated_at: dateOf(1) },
];

const seedNotes: Note[] = [
  { id: 1, title: 'Bienvenido a AgentLab 🚀', content: '# AgentLab\n\nEsta es la plataforma de pruebas del **agente Antigravity**.\n\n## Características\n- Base de datos en memoria con seed data\n- API REST completa con 8 endpoints\n- Diseño dark mode futurista con glassmorphism\n- Demos interactivas de CRUD\n- Explorador de API integrado\n\n## Stack\n- **Next.js 14** App Router\n- **TypeScript** estricto\n- **Vercel** para despliegue', category: 'general', pinned: true, created_at: dateOf(7), updated_at: dateOf(1) },
  { id: 2, title: 'Comandos del proyecto', content: '## Comandos útiles\n\n```bash\nnpm run dev      # Desarrollo local\nnpm run build    # Build producción\nnpm run start    # Servidor producción\nnpm run lint     # Linter ESLint\n```\n\n## Rutas API\n```\nGET  /api/tasks        → Listar tareas\nPOST /api/tasks        → Crear tarea\nPUT  /api/tasks/[id]   → Actualizar tarea\nDEL  /api/tasks/[id]   → Eliminar tarea\nGET  /api/notes        → Listar notas\nPOST /api/notes        → Crear nota\nGET  /api/stats        → Estadísticas\nGET  /api/health       → Estado del sistema\n```', category: 'development', pinned: true, created_at: dateOf(6), updated_at: dateOf(2) },
  { id: 3, title: 'Ideas para próximas versiones', content: '## Roadmap\n\n- [ ] Autenticación con NextAuth.js\n- [ ] WebSockets para colaboración en tiempo real\n- [ ] Exportar datos a CSV/JSON\n- [ ] Gráficas de estadísticas con Chart.js\n- [ ] Sistema de notificaciones push\n- [ ] Toggle tema claro/oscuro\n- [ ] Búsqueda global con comando palette\n- [ ] Drag & drop para reordenar tareas', category: 'ideas', pinned: false, created_at: dateOf(5), updated_at: dateOf(5) },
  { id: 4, title: 'Decisiones de arquitectura', content: '## ¿Por qué store en memoria?\nPerfecto para demos sin configuración adicional. El agente lo generó con seed data realista.\n\n## ¿Por qué Next.js App Router?\nPermite Server Components, API Routes y layouts anidados en el mismo proyecto.\n\n## ¿Por qué Vercel?\nDeploy instantáneo desde GitHub, Edge Network global, analytics integrado.\n\n## Para producción real\nSustituir el store por `@vercel/postgres` o Turso (SQLite serverless).', category: 'architecture', pinned: false, created_at: dateOf(4), updated_at: dateOf(4) },
];

const seedLogs: ActivityLog[] = [
  { id: 1, action: 'SYSTEM', entity: 'app', entity_id: 0, details: 'AgentLab iniciado — store en memoria creado', timestamp: dateOf(7) },
  { id: 2, action: 'CREATE', entity: 'task', entity_id: 1, details: 'Tarea "Configurar base de datos" creada', timestamp: dateOf(7) },
  { id: 3, action: 'CREATE', entity: 'note', entity_id: 1, details: 'Nota "Bienvenido a AgentLab" creada', timestamp: dateOf(7) },
  { id: 4, action: 'UPDATE', entity: 'task', entity_id: 1, details: 'Estado cambiado a "completed"', timestamp: dateOf(5) },
  { id: 5, action: 'UPDATE', entity: 'task', entity_id: 2, details: 'Estado cambiado a "completed"', timestamp: dateOf(4) },
  { id: 6, action: 'CREATE', entity: 'task', entity_id: 5, details: 'Tarea "Publicar en GitHub & Vercel" creada', timestamp: dateOf(2) },
  { id: 7, action: 'DEPLOY', entity: 'app', entity_id: 0, details: 'Proyecto desplegado en Vercel', timestamp: now() },
];

// ── Singleton Store ─────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __store: Store | undefined;
}

class Store {
  tasks: Task[];
  notes: Note[];
  logs: ActivityLog[];
  apiCalls: ApiCall[];
  private taskIdCounter: number;
  private noteIdCounter: number;
  private logIdCounter: number;
  private apiCallIdCounter: number;

  constructor() {
    this.tasks = [...seedTasks];
    this.notes = [...seedNotes];
    this.logs = [...seedLogs];
    this.apiCalls = [];
    this.taskIdCounter = Math.max(...seedTasks.map(t => t.id)) + 1;
    this.noteIdCounter = Math.max(...seedNotes.map(n => n.id)) + 1;
    this.logIdCounter = Math.max(...seedLogs.map(l => l.id)) + 1;
    this.apiCallIdCounter = 1;
  }

  // ── Tasks ──
  getTasks(status?: string, priority?: string): Task[] {
    let result = this.tasks;
    if (status) result = result.filter(t => t.status === status);
    if (priority) result = result.filter(t => t.priority === priority);
    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getTask(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task {
    const task: Task = { ...data, id: this.taskIdCounter++, created_at: now(), updated_at: now() };
    this.tasks.push(task);
    this.addLog('CREATE', 'task', task.id, `Tarea "${task.title}" creada`);
    return task;
  }

  updateTask(id: number, data: Partial<Omit<Task, 'id' | 'created_at'>>): Task | null {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = { ...this.tasks[idx], ...data, updated_at: now() };
    this.addLog('UPDATE', 'task', id, `Tarea "${this.tasks[idx].title}" actualizada`);
    return this.tasks[idx];
  }

  deleteTask(id: number): boolean {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    const title = this.tasks[idx].title;
    this.tasks.splice(idx, 1);
    this.addLog('DELETE', 'task', id, `Tarea "${title}" eliminada`);
    return true;
  }

  // ── Notes ──
  getNotes(category?: string): Note[] {
    let result = this.notes;
    if (category) result = result.filter(n => n.category === category);
    return result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }

  getNote(id: number): Note | undefined {
    return this.notes.find(n => n.id === id);
  }

  createNote(data: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Note {
    const note: Note = { ...data, id: this.noteIdCounter++, created_at: now(), updated_at: now() };
    this.notes.push(note);
    this.addLog('CREATE', 'note', note.id, `Nota "${note.title}" creada`);
    return note;
  }

  updateNote(id: number, data: Partial<Omit<Note, 'id' | 'created_at'>>): Note | null {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.notes[idx] = { ...this.notes[idx], ...data, updated_at: now() };
    this.addLog('UPDATE', 'note', id, `Nota "${this.notes[idx].title}" actualizada`);
    return this.notes[idx];
  }

  deleteNote(id: number): boolean {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return false;
    const title = this.notes[idx].title;
    this.notes.splice(idx, 1);
    this.addLog('DELETE', 'note', id, `Nota "${title}" eliminada`);
    return true;
  }

  // ── Logs ──
  addLog(action: string, entity: string, entity_id: number, details: string) {
    this.logs.unshift({ id: this.logIdCounter++, action, entity, entity_id, details, timestamp: now() });
    if (this.logs.length > 100) this.logs.pop();
  }

  getLogs(limit = 20): ActivityLog[] {
    return this.logs.slice(0, limit);
  }

  // ── API Calls ──
  recordApiCall(method: string, endpoint: string, status_code: number, response_time_ms: number) {
    this.apiCalls.unshift({ id: this.apiCallIdCounter++, method, endpoint, status_code, response_time_ms, timestamp: now() });
    if (this.apiCalls.length > 50) this.apiCalls.pop();
  }

  getApiCalls(limit = 20): ApiCall[] {
    return this.apiCalls.slice(0, limit);
  }

  // ── Stats ──
  getStats() {
    const tasksByStatus = this.tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByPriority = this.tasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const notesByCategory = this.notes.reduce((acc, n) => {
      acc[n.category] = (acc[n.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      tasks: { total: this.tasks.length, ...tasksByStatus },
      notes: { total: this.notes.length, ...notesByCategory },
      tasksByPriority,
      logs: { total: this.logs.length, recent: this.logs.slice(0, 5) },
      apiCalls: { total: this.apiCalls.length, recent: this.apiCalls.slice(0, 5) },
    };
  }
}

function getStore(): Store {
  if (!global.__store) {
    global.__store = new Store();
  }
  return global.__store;
}

export { getStore };
