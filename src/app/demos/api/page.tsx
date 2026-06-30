'use client';
import { useState } from 'react';

interface ApiResult {
  status: number;
  data: unknown;
  time: number;
}

const PRESET_REQUESTS = [
  { label: 'GET /api/health', method: 'GET', url: '/api/health', body: '' },
  { label: 'GET /api/stats', method: 'GET', url: '/api/stats', body: '' },
  { label: 'GET /api/tasks', method: 'GET', url: '/api/tasks', body: '' },
  { label: 'GET /api/notes', method: 'GET', url: '/api/notes', body: '' },
  { label: 'GET /api/logs', method: 'GET', url: '/api/logs', body: '' },
  { label: 'POST /api/tasks', method: 'POST', url: '/api/tasks', body: JSON.stringify({ title: 'Tarea de prueba desde API Explorer', description: 'Creada vía el explorador integrado', priority: 'high', status: 'pending', tags: ['api', 'test'] }, null, 2) },
  { label: 'POST /api/notes', method: 'POST', url: '/api/notes', body: JSON.stringify({ title: 'Nota de prueba', content: '# Test\n\nCreada desde el **API Explorer**', category: 'development', pinned: false }, null, 2) },
  { label: 'GET /api/tasks?status=pending', method: 'GET', url: '/api/tasks?status=pending', body: '' },
  { label: 'GET /api/tasks?priority=critical', method: 'GET', url: '/api/tasks?priority=critical', body: '' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'badge-cyan', POST: 'badge-green', PUT: 'badge-orange', DELETE: 'badge-red', PATCH: 'badge-violet',
};

function syntaxHighlight(json: string): string {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'token-number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'token-key' : 'token-string';
      } else if (/true|false/.test(match)) {
        cls = 'token-boolean';
      } else if (/null/.test(match)) {
        cls = 'token-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
}

export default function ApiExplorerPage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('/api/health');
  const [body, setBody] = useState('');
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ method: string; url: string; status: number; time: number }>>([]);

  const send = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const opts: RequestInit = { method };
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = body;
      }
      const res = await fetch(url, opts);
      const data = await res.json();
      const time = Date.now() - start;
      const r = { status: res.status, data, time };
      setResult(r);
      setHistory(prev => [{ method, url, status: res.status, time }, ...prev.slice(0, 9)]);
    } catch (err) {
      const time = Date.now() - start;
      setResult({ status: 0, data: { error: String(err) }, time });
    }
    setLoading(false);
  };

  const loadPreset = (preset: typeof PRESET_REQUESTS[0]) => {
    setMethod(preset.method);
    setUrl(preset.url);
    setBody(preset.body);
  };

  const statusColor = (s: number) => s >= 200 && s < 300 ? 'var(--green)' : s >= 400 ? 'var(--red)' : 'var(--orange)';

  return (
    <>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>⟡ API Explorer</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Prueba todos los endpoints REST en vivo</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem', alignItems: 'start' }}>

          {/* Presets Panel */}
          <div className="glass animate-slide-up" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Presets
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {PRESET_REQUESTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => loadPreset(p)}
                  id={`preset-${i}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.6rem', borderRadius: '6px',
                    background: url === p.url && method === p.method ? 'rgba(0,212,255,0.08)' : 'transparent',
                    border: '1px solid transparent',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = url === p.url && method === p.method ? 'rgba(0,212,255,0.08)' : 'transparent'; }}
                >
                  <span className={`badge ${METHOD_COLORS[p.method]}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{p.method}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.url.split('?')[0]}
                  </span>
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '1rem 0 0.5rem' }}>
                  Historial
                </div>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0', fontSize: '0.72rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    <span style={{ color: statusColor(h.status), fontWeight: 700 }}>{h.status}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.url}</span>
                    <span>{h.time}ms</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Main Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Request Bar */}
            <div className="glass animate-fade-in" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  className="form-select"
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  style={{ width: '110px', flexShrink: 0, fontWeight: 700 }}
                  id="api-method-select"
                >
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m}>{m}</option>)}
                </select>
                <input
                  className="form-input"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="/api/tasks"
                  style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
                  id="api-url-input"
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button
                  className="btn btn-primary"
                  onClick={send}
                  disabled={loading}
                  id="btn-send-request"
                  style={{ flexShrink: 0 }}
                >
                  {loading ? '...' : '▶ Enviar'}
                </button>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(method) && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label className="form-label">Request Body (JSON)</label>
                  <textarea
                    className="form-input form-textarea"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', minHeight: '120px' }}
                    id="api-body-input"
                  />
                </div>
              )}
            </div>

            {/* Response */}
            {result && (
              <div className="glass animate-slide-up" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Respuesta</div>
                  <span style={{ fontWeight: 800, color: statusColor(result.status), fontSize: '1.1rem' }}>{result.status}</span>
                  <span className="badge badge-gray">{result.time}ms</span>
                  <span className="badge badge-cyan">JSON</span>
                </div>
                <div
                  className="code-block"
                  style={{ maxHeight: '420px', overflowY: 'auto' }}
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(result.data, null, 2)) }}
                />
              </div>
            )}

            {!result && (
              <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }}>⟡</div>
                <p>Selecciona un preset o escribe una URL y presiona <strong style={{ color: 'var(--text-secondary)' }}>Enviar</strong></p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>También puedes presionar <kbd style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.1em 0.4em', fontFamily: 'var(--font-mono)', fontSize: '0.8em' }}>Enter</kbd> en el campo URL</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
