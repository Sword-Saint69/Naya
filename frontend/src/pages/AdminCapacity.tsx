import { useEffect, useState } from 'react';
import { api } from '../api';

const TABS = ['passes', 'buses', 'drivers', 'assignments', 'capacity', 'create'];

export default function Admin() {
  const [tab, setTab] = useState('passes');
  const [rows, setRows] = useState<any[]>([]);
  const [cap, setCap] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [f, setF] = useState<any>({});

  const load = async () => {
    try {
      if (tab === 'passes') setRows(await api.passes());
      if (tab === 'buses') setRows(await api.buses());
      if (tab === 'drivers') setRows(await api.drivers());
      if (tab === 'assignments') setRows(await api.assignments());
      if (tab === 'capacity') setCap(await api.capacity());
    } catch (e: any) { setMsg(e.message); }
  };
  useEffect(() => { load(); }, [tab]);

  const approve = async (id: number) => {
    try { await api.approve(id, Number(f[`a_${id}`]), !!f[`p_${id}`]); setMsg(`✓ Approved pass ${id}`); load(); }
    catch (e: any) { setMsg(e.message); }
  };

  const reject = async (id: number) => {
    try { await api.reject(id); setMsg(`Rejected pass ${id}`); load(); }
    catch (e: any) { setMsg(e.message); }
  };

  return (
    <div>
      <div className="page-head">
        <div><h2>Transport admin</h2><p>Buses, drivers, routes, approvals and live capacity.</p></div>
      </div>
      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {msg && <div className="card"><p style={{ margin: 0 }}>{msg}</p></div>}

      {tab === 'passes' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table><thead><tr><th>ID</th><th>Student</th><th>Route</th><th>Status</th><th>Bus</th><th>Action</th></tr></thead>
          <tbody>{rows.map(p => (
            <tr key={p.id}>
              <td>#{p.id}</td><td>{p.studentId}</td><td>{p.routeId}</td>
              <td><span className={`badge ${p.status}`}>{p.status}</span></td>
              <td>{p.assignmentId || '—'}</td>
              <td>{p.status === 'PENDING'
                ? <div className="btn-row" style={{ marginTop: 0 }}>
                    <input placeholder="bus assign ID" onChange={e => setF({ ...f, [`a_${p.id}`]: e.target.value })} style={{ width: 110 }} />
                    <label className="note"><input type="checkbox" onChange={e => setF({ ...f, [`p_${p.id}`]: e.target.checked })} /> paid</label>
                    <button onClick={() => approve(p.id)}>Approve</button>
                    <button className="btn-danger" onClick={() => reject(p.id)}>Reject</button>
                  </div>
                : <span className="note">decided</span>}</td>
            </tr>))}</tbody></table>
          {rows.length === 0 && <div className="empty">No passes in this view.</div>}
        </div>
      )}

      {tab === 'capacity' && (
        <div className="card">
          {cap.map(c => {
            const pct = c.capacity ? Math.round((c.used / c.capacity) * 100) : 0;
            return (
              <div key={c.assignmentId} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <b>Bus {c.busId} · Route {c.routeId}</b>
                  <span className="note">{c.used}/{c.capacity} used · {c.free} free</span>
                </div>
                <div className="cap-bar"><div className="cap-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
          {cap.length === 0 && <div className="empty">No assignments yet.</div>}
        </div>
      )}

      {(tab === 'buses' || tab === 'drivers' || tab === 'assignments') && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table><thead><tr>
            {Object.keys(rows[0] || { info: '' }).map(k => <th key={k}>{k}</th>)}
          </tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={i}>{Object.values(r).map((v: any, j) => <td key={j}>{String(v)}</td>)}</tr>
          ))}</tbody></table>
          {rows.length === 0 && <div className="empty">Nothing here yet — add via Create.</div>}
        </div>
      )}

      {tab === 'create' && <CreateForms onDone={() => setMsg('✓ Created')} />}
    </div>
  );
}

function CreateForms({ onDone }: any) {
  const [msg, setMsg] = useState('');
  const go = async (fn: () => Promise<any>) => { try { await fn(); setMsg('✓ Saved'); onDone(); } catch (e: any) { setMsg(e.message); } };
  const [bus, setBus] = useState({ busNo: '', capacity: 40, busType: 'STANDARD' });
  const [drv, setDrv] = useState({ name: '', licenseNo: '', phone: '' });
  const [rt, setRt] = useState({ routeNo: '', source: '', destination: '', distanceKm: 0, fee: 0 });
  const [as, setAs] = useState({ busId: 2, driverId: 1, routeId: 2, shift: 'MORNING' });
  return (
    <div className="grid2">
      <div className="card"><h4 style={{ marginTop: 0 }}>＋ Bus</h4>
        <input placeholder="bus number" onChange={e => setBus({ ...bus, busNo: e.target.value })} />
        <input placeholder="capacity" type="number" onChange={e => setBus({ ...bus, capacity: Number(e.target.value) })} />
        <div className="btn-row"><button onClick={() => go(() => api.addBus(bus))}>Add bus</button></div></div>
      <div className="card"><h4 style={{ marginTop: 0 }}>＋ Driver</h4>
        <input placeholder="name" onChange={e => setDrv({ ...drv, name: e.target.value })} />
        <input placeholder="license no" onChange={e => setDrv({ ...drv, licenseNo: e.target.value })} />
        <input placeholder="phone" onChange={e => setDrv({ ...drv, phone: e.target.value })} />
        <div className="btn-row"><button onClick={() => go(() => api.addDriver(drv))}>Add driver</button></div></div>
      <div className="card"><h4 style={{ marginTop: 0 }}>＋ Route</h4>
        <input placeholder="route no" onChange={e => setRt({ ...rt, routeNo: e.target.value })} />
        <input placeholder="source" onChange={e => setRt({ ...rt, source: e.target.value })} />
        <input placeholder="destination" onChange={e => setRt({ ...rt, destination: e.target.value })} />
        <div className="btn-row"><button onClick={() => go(() => api.addRoute(rt))}>Add route</button></div></div>
      <div className="card"><h4 style={{ marginTop: 0 }}>＋ Assignment</h4>
        <input placeholder="bus ID" type="number" defaultValue={2} onChange={e => setAs({ ...as, busId: Number(e.target.value) })} />
        <input placeholder="driver ID" type="number" onChange={e => setAs({ ...as, driverId: Number(e.target.value) })} />
        <input placeholder="route ID" type="number" defaultValue={2} onChange={e => setAs({ ...as, routeId: Number(e.target.value) })} />
        <div className="btn-row"><button onClick={() => go(() => api.assign(as))}>Assign bus</button></div></div>
      {msg && <p>{msg}</p>}
    </div>
  );
}
