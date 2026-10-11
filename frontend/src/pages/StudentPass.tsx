import { useEffect, useState } from 'react';
import { api } from '../api';

export default function StudentPass() {
  const [passes, setPasses] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const load = () => api.mine().then(setPasses).catch(e => setMsg(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const renew = async (id: number) => {
    try { await api.renew(id); setMsg('✓ Renew requested — status is now PENDING.'); load(); }
    catch (e: any) { setMsg(e.message); }
  };
  return (
    <div>
      <div className="page-head">
        <div><h2>My passes</h2><p>Apply from Routes, renew before expiry.</p></div>
      </div>
      {msg && <div className="card"><p style={{ margin: 0 }}>{msg}</p></div>}
      {loading && <div className="card empty">Loading passes…</div>}
      {!loading && passes.map(p => (
        <div className="card" key={p.id}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <b>Route {p.routeId}</b>
            <span className={`badge ${p.status}`}>{p.status}</span>
            <span className="note">{p.academicYear}</span>
          </div>
          <div className="note" style={{ marginTop: 6 }}>
            Valid {p.validFrom || '—'} → {p.validTo || '—'} · Fee {p.feePaid ? 'paid ✓' : 'pending'}
          </div>
          {(p.status === 'ACTIVE' || p.status === 'EXPIRED') && (
            <div className="btn-row"><button onClick={() => renew(p.id)}>Renew pass</button></div>
          )}
        </div>
      ))}
      {!loading && passes.length === 0 && <div className="card empty">No passes yet. Head to Routes to apply.</div>}
    </div>
  );
}
