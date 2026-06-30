import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'db');
const DB_PATH = path.join(DB_DIR, 'agentlab.db');

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
  }
  return db;
}

function initializeSchema() {
  const database = db;

  database.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      category TEXT DEFAULT 'general',
      pinned INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id INTEGER,
      details TEXT DEFAULT '',
      timestamp TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS api_calls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      method TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      status_code INTEGER,
      response_time_ms INTEGER,
      timestamp TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed data if empty
  const taskCount = (database.prepare('SELECT COUNT(*) as count FROM tasks').get() as { count: number }).count;
  if (taskCount === 0) {
    seedData(database);
  }
}

function seedData(database: Database.Database) {
  const insertTask = database.prepare(`
    INSERT INTO tasks (title, description, priority, status, tags)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertNote = database.prepare(`
    INSERT INTO notes (title, content, category, pinned)
    VALUES (?, ?, ?, ?)
  `);

  const insertLog = database.prepare(`
    INSERT INTO activity_logs (action, entity, entity_id, details)
    VALUES (?, ?, ?, ?)
  `);

  const tasks = [
    ['Configurar base de datos SQLite', 'Implementar esquema y seed data para pruebas del agente', 'high', 'completed', '["db","backend"]'],
    ['Diseñar sistema de diseño dark mode', 'Crear CSS variables y tokens para el tema oscuro futurista', 'high', 'completed', '["ui","design"]'],
    ['Crear API REST completa', 'Implementar todos los endpoints CRUD para tasks y notes', 'critical', 'in_progress', '["api","backend"]'],
    ['Integrar glassmorphism en componentes', 'Aplicar efectos de vidrio esmerilado en cards y modales', 'medium', 'in_progress', '["ui","css"]'],
    ['Agregar animaciones de entrada', 'Implementar fade-in y slide-up en todas las secciones', 'low', 'pending', '["ui","animation"]'],
    ['Probar flujo completo end-to-end', 'Verificar que todo funcione desde DB hasta UI', 'high', 'pending', '["testing","qa"]'],
    ['Optimizar performance', 'Analizar y mejorar tiempos de carga y respuesta', 'medium', 'pending', '["performance"]'],
    ['Documentar API endpoints', 'Escribir documentación completa con ejemplos', 'low', 'pending', '["docs"]'],
  ];

  const notes = [
    ['Bienvenido a AgentLab', '# AgentLab\n\nEsta es la plataforma de pruebas del **agente Antigravity**.\n\n## Características\n- Base de datos SQLite integrada\n- API REST completa\n- Diseño dark mode futurista\n- Demos interactivas', 'general', 1],
    ['Comandos útiles', '## Comandos del proyecto\n\n```bash\nnpm run dev     # Iniciar servidor\nnpm run build   # Build producción\nnpm run start   # Producción\n```\n\n## Rutas principales\n- `/` - Dashboard\n- `/demos/tasks` - Gestor de tareas\n- `/demos/notes` - Editor de notas\n- `/demos/api` - Explorador de API', 'development', 1],
    ['Ideas para el proyecto', '## Próximas funcionalidades\n\n- [ ] Autenticación con JWT\n- [ ] WebSockets para tiempo real\n- [ ] Exportar datos a CSV\n- [ ] Gráficas de estadísticas\n- [ ] Sistema de notificaciones push\n- [ ] Tema claro/oscuro toggle', 'ideas', 0],
    ['Notas de arquitectura', '## Decisiones técnicas\n\n**¿Por qué SQLite?**\nPerfecto para demos y proyectos locales. Sin servidor adicional requerido.\n\n**¿Por qué Next.js?**\nApp Router permite Server Components y API Routes en el mismo proyecto.\n\n**¿Por qué CSS vanilla?**\nMáximo control sobre el diseño sin dependencias adicionales.', 'architecture', 0],
  ];

  for (const task of tasks) {
    const result = insertTask.run(...(task as [string, string, string, string, string]));
    insertLog.run('CREATE', 'task', result.lastInsertRowid, `Tarea "${task[0]}" creada en seed`);
  }

  for (const note of notes) {
    const result = insertNote.run(...(note as [string, string, string, number]));
    insertLog.run('CREATE', 'note', result.lastInsertRowid, `Nota "${note[0]}" creada en seed`);
  }

  insertLog.run('SYSTEM', 'database', 0, 'Base de datos inicializada con datos de prueba');
}

export { getDb };
