import { useEffect, useState } from 'react';
import { api } from '../api';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [year, setYear] = useState('2026-27');
  const [msg, setMsg] = useState('');
  useEffect(() => { api.routes().then(setRoutes).catch(e => setMsg(e.message)); }, []);
  const apply = async (id: number) => {
    setMsg('');
    try { await api.apply(id, year); setMsg(`Applied for route ${id}`); }
    catch (e: any) { setMsg(e.message); }
  };
  return (
    <div>
      <div className="card">
        <h2>Routes</h2>
        <label>Academic year <input value={year} onChange={e => setYear(e.target.value)} /></label>
        {msg && <p>{msg}</p>}
      </div>
      {routes.map(r => (
        <div className="card" key={r.id}>
          <b>{r.routeNo}</b> — {r.source} → {r.destination} <span className="badge">₹{r.fee}</span>
          <button onClick={() => apply(r.id)}>Select + Apply</button>
        </div>
      ))}
      {routes.length === 0 && <p>No routes yet.</p>}
    </div>
  );
}
