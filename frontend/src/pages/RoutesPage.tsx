import { useEffect, useState } from 'react';
import { api } from '../api';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [year, setYear] = useState('2026-27');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState<Record<number, any[]>>({});
  useEffect(() => {
    api.routes().then(setRoutes).catch(e => setMsg(e.message)).finally(() => setLoading(false));
  }, []);
  const apply = async (id: number) => {
    setMsg('');
    try { await api.apply(id, year); setMsg(`✓ Applied — track it under My Pass.`); }
    catch (e: any) { setMsg(e.message); }
  };
  const toggleStops = async (id: number) => {
    if (stops[id]) { const c = { ...stops }; delete c[id]; setStops(c); return; }
    try { setStops({ ...stops, [id]: await api.stops(id) }); }
    catch (e: any) { setMsg(e.message); }
  };
  return (
    <div>
      <div className="page-head">
        <div><h2>Find your route</h2><p>Pick a bus route and apply for the pass. Admin approves seats.</p></div>
      </div>
      <div className="card">
        <label>Academic year <input value={year} onChange={e => setYear(e.target.value)} style={{ width: 120 }} /></label>
        {msg && <p>{msg}</p>}
      </div>
      {loading && <div className="card empty">Loading routes…</div>}
      {!loading && routes.map(r => (
        <div className="card route-card" key={r.id}>
          <div className="route-main">
            <div className="route-no">{r.routeNo}</div>
            <div className="route-path">{r.source} → {r.destination} · {r.distanceKm} km</div>
            {stops[r.id] && (
              <ul className="stops">{stops[r.id].map((s: any) => (
                <li key={s.id}>{s.sequence}. {s.stopName} {s.pickupTime ? `· ${s.pickupTime}` : ''}</li>
              ))}</ul>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="fee">₹{r.fee}</div>
            <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => toggleStops(r.id)}>
                {stops[r.id] ? 'Hide stops' : 'Stops'}
              </button>
              <button onClick={() => apply(r.id)}>Apply</button>
            </div>
          </div>
        </div>
      ))}
      {!loading && routes.length === 0 && <div className="card empty">No routes yet — check back soon.</div>}
    </div>
  );
}
