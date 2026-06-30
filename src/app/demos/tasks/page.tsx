'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/lib/store';

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
const STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;

const priorityBadge: Record<string, string> = {
  low: 'badge-green', medium: 'badge-cyan', high: 'badge-orange', critical: 'badge-red',
};
const statusBadge: Record<string, string> = {
  pending: 'badge-gray', in_progress: 'badge-cyan', completed: 'badge-green', cancelled: 'badge-red',
};
const priorityLabel: Record<string, string> = { low: '↓ Baja', medium: '→ Media', high: '↑ Alta', critical: '⚡ Crítica' };
const statusLabel: Record<string, string> = { pending: '⏳ Pendiente', in_progress: '⚡ En progreso', completed: '✓ Completada', cancelled: '✗ Cancelada' };

interface Toast { id: number; msg: string; type: 'success' | 'error' }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium', status: 'pending', tags: '',
  });

  const toast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = toastId + 1;
    setToastId(id);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, [toastId]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (filterPriority) params.set('priority', filterPriority);
    const res = await fetch(`/api/tasks?${params}`);
    const data = await res.json();
    setTasks(data.data || []);
    setLoading(false);
  }, [filterStatus, filterPriority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const openCreate = () => {
    setEditTask(null);
    setForm({ title: '', description: '', priority: 'medium', status: 'pending', tags: '' });
    setShowModal(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description, priority: task.priority, status: task.status, tags: task.tags.join(', ') });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast('El título es requerido', 'error'); return; }
    const body = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };

    if (editTask) {
      const res = await fetch(`/api/tasks/${editTask.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { toast('✓ Tarea actualizada'); fetchTasks(); setShowModal(false); }
      else toast('Error al actualizar', 'error');
    } else {
      const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { toast('✓ Tarea creada'); fetchTasks(); setShowModal(false); }
      else toast('Error al crear', 'error');
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('✓ Tarea eliminada'); fetchTasks(); }
    else toast('Error al eliminar', 'error');
  };

  const filtered = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    critical: tasks.filter(t => t.priority === 'critical').length,
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>✓ Gestor de Tareas</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CRUD completo con prioridades y estados</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} id="btn-create-task">
          + Nueva Tarea
        </button>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid stagger">
          {[
            { icon: '◫', label: 'Total', value: stats.total, color: 'var(--cyan)' },
            { icon: '✓', label: 'Completadas', value: stats.completed, color: 'var(--green)' },
            { icon: '⚡', label: 'En Progreso', value: stats.in_progress, color: 'var(--violet)' },
            { icon: '🔴', label: 'Críticas', value: stats.critical, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} className="glass stat-card animate-slide-up">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass animate-fade-in" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-input" placeholder="🔍 Buscar tareas..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}
            id="tasks-search"
          />
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 'auto', flex: '0 0 auto' }} id="filter-status">
            <option value="">Todos los estados</option>
            {STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
          </select>
          <select className="form-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ width: 'auto', flex: '0 0 auto' }} id="filter-priority">
            <option value="">Todas las prioridades</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{priorityLabel[p]}</option>)}
          </select>
          {(filterStatus || filterPriority || search) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilterStatus(''); setFilterPriority(''); setSearch(''); }}>
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* Table */}
        <div className="animate-fade-in">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', animation: 'float 1s ease-in-out infinite' }}>⬡</div>
              <p style={{ marginTop: '1rem' }}>Cargando tareas...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✓</div>
              <div className="empty-state-title">No hay tareas</div>
              <p>Crea tu primera tarea haciendo clic en &ldquo;Nueva Tarea&rdquo;</p>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Etiquetas</th>
                    <th>Creada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(task => (
                    <tr key={task.id}>
                      <td>
                        <span className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>#{task.id}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-muted truncate" style={{ maxWidth: '280px' }}>{task.description}</div>
                        )}
                      </td>
                      <td><span className={`badge ${priorityBadge[task.priority]}`}>{priorityLabel[task.priority]}</span></td>
                      <td><span className={`badge ${statusBadge[task.status]}`}>{statusLabel[task.status]}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-muted">{new Date(task.created_at).toLocaleDateString('es-MX')}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(task)} title="Editar" id={`edit-task-${task.id}`}>✏️</button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteTask(task.id)} title="Eliminar" id={`delete-task-${task.id}`}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal glass">
            <div className="modal-header">
              <h2 className="modal-title">{editTask ? '✏️ Editar Tarea' : '+ Nueva Tarea'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título de la tarea" required id="task-title-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-input form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción opcional..." id="task-desc-input" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Prioridad</label>
                    <select className="form-select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} id="task-priority-select">
                      {PRIORITIES.map(p => <option key={p} value={p}>{priorityLabel[p]}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} id="task-status-select">
                      {STATUSES.map(s => <option key={s} value={s}>{statusLabel[s]}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Etiquetas (separadas por comas)</label>
                  <input className="form-input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="frontend, ui, design" id="task-tags-input" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" id="task-submit-btn">{editTask ? 'Guardar cambios' : 'Crear tarea'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.type === 'success' ? '✓' : '✕'}</span>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
