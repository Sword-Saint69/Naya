import { useEffect, useState } from 'react';
import { api } from '../api';

export default function StudentPass() {
  const [passes, setPasses] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const load = () => api.mine().then(setPasses).catch(e => setMsg(e.message));
  useEffect(() => { load(); }, []);
  const renew = async (id: number) => {
    try { await api.renew(id); setMsg('Renew requested (PENDING)'); load(); }
    catch (e: any) { setMsg(e.message); }
  };
  return (
    <div>
      <h2>My Passes</h2>
      {msg && <p>{msg}</p>}
      {passes.map(p => (
        <div className="card" key={p.id}>
          <div>Route {p.routeId} · Year {p.academicYear} · <span className="badge">{p.status}</span></div>
          <div>Valid: {p.validFrom || '-'} → {p.validTo || '-'} · Paid: {String(p.feePaid)}</div>
          {(p.status === 'ACTIVE' || p.status === 'EXPIRED') && (
            <button onClick={() => renew(p.id)}>Renew pass</button>
          )}
        </div>
      ))}
      {passes.length === 0 && <p>No passes yet. Go to Routes to apply.</p>}
    </div>
  );
}
