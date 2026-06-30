'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/lib/store';

const CATEGORIES = ['general', 'development', 'ideas', 'architecture', 'design', 'testing'] as const;

interface Toast { id: number; msg: string; type: 'success' | 'error' }

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1rem;font-weight:700;margin:1rem 0 0.5rem;color:var(--text-primary)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.1rem;font-weight:700;margin:1.25rem 0 0.5rem;color:var(--text-primary)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.3rem;font-weight:800;margin:0 0 0.75rem;background:var(--grad-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);background:rgba(0,212,255,0.1);color:var(--cyan);padding:0.1em 0.4em;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.4);border:1px solid var(--border);border-radius:8px;padding:1rem;font-family:var(--font-mono);font-size:0.82rem;color:var(--cyan);overflow-x:auto;margin:0.75rem 0;line-height:1.7"><code>$1</code></pre>')
    .replace(/^- \[ \] (.+)$/gm, '<div style="display:flex;align-items:center;gap:0.5rem;margin:0.25rem 0"><span style="width:16px;height:16px;border:1px solid var(--border);border-radius:4px;display:inline-block;flex-shrink:0"></span><span>$1</span></div>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;align-items:flex-start;gap:0.5rem;margin:0.2rem 0;color:var(--text-secondary)"><span style="color:var(--cyan);flex-shrink:0">·</span>$1</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [preview, setPreview] = useState(true);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);
  const [filterCat, setFilterCat] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCat, setEditCat] = useState('general');
  const [editPinned, setEditPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const toast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = toastId + 1;
    setToastId(id);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, [toastId]);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const params = filterCat ? `?category=${filterCat}` : '';
    const res = await fetch(`/api/notes${params}`);
    const data = await res.json();
    setNotes(data.data || []);
    setLoading(false);
  }, [filterCat]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const selectNote = (note: Note) => {
    setSelected(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCat(note.category);
    setEditPinned(note.pinned);
    setCreating(false);
    setPreview(true);
  };

  const startCreate = () => {
    setSelected(null);
    setCreating(true);
    setEditTitle('Nueva nota');
    setEditContent('# Nueva nota\n\nEscribe aquí en **Markdown**...');
    setEditCat('general');
    setEditPinned(false);
    setPreview(false);
  };

  const saveNote = async () => {
    if (!editTitle.trim()) { toast('Título requerido', 'error'); return; }
    setSaving(true);
    const body = { title: editTitle, content: editContent, category: editCat, pinned: editPinned };
    if (creating) {
      const res = await fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        const data = await res.json();
        toast('✓ Nota creada');
        await fetchNotes();
        selectNote(data.data);
        setCreating(false);
      } else toast('Error al crear', 'error');
    } else if (selected) {
      const res = await fetch(`/api/notes/${selected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        toast('✓ Nota guardada');
        await fetchNotes();
        const updated = { ...selected, ...body, updated_at: new Date().toISOString() };
        setSelected(updated);
      } else toast('Error al guardar', 'error');
    }
    setSaving(false);
  };

  const deleteNote = async (id: number) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('✓ Nota eliminada'); setSelected(null); setCreating(false); fetchNotes(); }
    else toast('Error al eliminar', 'error');
  };

  const catColors: Record<string, string> = { general: 'cyan', development: 'violet', ideas: 'green', architecture: 'orange', design: 'pink', testing: 'red' };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>◈ Editor de Notas</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Markdown con preview en vivo</p>
        </div>
        <button className="btn btn-primary" onClick={startCreate} id="btn-create-note">+ Nueva Nota</button>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height, 80px))', overflow: 'hidden' }}>
        {/* Notes List */}
        <div style={{ width: '280px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <select className="form-select" value={filterCat} onChange={e => setFilterCat(e.target.value)} id="notes-filter-cat">
              <option value="">Todas las categorías</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div>
            ) : notes.map(note => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                id={`note-item-${note.id}`}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selected?.id === note.id ? 'rgba(0,212,255,0.06)' : 'transparent',
                  borderLeft: selected?.id === note.id ? '2px solid var(--cyan)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', flex: 1 }}>
                    {note.pinned && <span style={{ color: 'var(--orange)', marginRight: '0.3rem' }}>📌</span>}
                    {note.title}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${catColors[note.category] || 'gray'}`} style={{ fontSize: '0.65rem' }}>{note.category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(note.updated_at).toLocaleDateString('es-MX')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor / Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {(selected || creating) ? (
            <>
              {/* Toolbar */}
              <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  className="form-input" value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  style={{ flex: 1, minWidth: '200px', fontWeight: 700 }}
                  id="note-title-input"
                />
                <select className="form-select" value={editCat} onChange={e => setEditCat(e.target.value)} style={{ width: 'auto' }} id="note-cat-select">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editPinned} onChange={e => setEditPinned(e.target.checked)} id="note-pinned-check" />
                  📌 Fijar
                </label>
                <button className="btn btn-ghost btn-sm" onClick={() => setPreview(!preview)} id="btn-toggle-preview">
                  {preview ? '✏️ Editar' : '👁️ Preview'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={saveNote} disabled={saving} id="btn-save-note">
                  {saving ? '...' : '💾 Guardar'}
                </button>
                {selected && (
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteNote(selected.id)} id={`btn-delete-note-${selected.id}`}>🗑️</button>
                )}
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
                {preview ? (
                  <div
                    style={{ maxWidth: '720px', lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(editContent) }}
                  />
                ) : (
                  <textarea
                    className="form-input form-textarea"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    style={{ height: '100%', minHeight: '400px', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', lineHeight: 1.7, resize: 'none' }}
                    id="note-content-editor"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ flex: 1 }}>
              <div className="empty-state-icon">◈</div>
              <div className="empty-state-title">Selecciona una nota</div>
              <p>O crea una nueva con el botón de arriba</p>
            </div>
          )}
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.type === 'success' ? '✓' : '✕'}</span>{t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
