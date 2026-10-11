import { useEffect, useState } from 'react';
import { api } from '../api';

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
    try { await api.approve(id, Number(f[`a_${id}`]), f[`p_${id}`] === 'on' || f[`p_${id}`] === true); setMsg(`Approved ${id}`); load(); }
    catch (e: any) { setMsg(e.message); }
  };

  const reject = async (id: number) => {
    try { await api.reject(id); setMsg(`Rejected ${id}`); load(); }
    catch (e: any) { setMsg(e.message); }
  };

  return (
    <div>
      <h2>Transport Admin</h2>
      {['passes', 'buses', 'drivers', 'assignments', 'capacity', 'create'].map(t => (
        <button key={t} onClick={() => setTab(t)}>{t}</button>
      ))}
      {msg && <p>{msg}</p>}

      {tab === 'passes' && (
        <div className="card"><table><thead><tr><th>ID</th><th>Student</th><th>Route</th><th>Status</th><th>AssignID</th><th>Action</th></tr></thead>
        <tbody>{rows.map(p => (
          <tr key={p.id}><td>{p.id}</td><td>{p.studentId}</td><td>{p.routeId}</td><td>{p.status}</td><td>{p.assignmentId || '-'}</td>
          <td>{p.status === 'PENDING' && (<>
            <input placeholder="assignId" onChange={e => setF({ ...f, [`a_${p.id}`]: e.target.value })} size={6} />
            <label><input type="checkbox" onChange={e => setF({ ...f, [`p_${p.id}`]: e.target.checked })} /> paid</label>
            <button onClick={() => approve(p.id)}>Approve</button>
            <button onClick={() => reject(p.id)} style={{ background: '#b91c1c' }}>Reject</button>
          </>)}</td></tr>))}</tbody></table></div>
      )}

      {tab === 'capacity' && (
        <div className="card"><table><thead><tr><th>Assign</th><th>Route</th><th>Cap</th><th>Used</th><th>Free</th></tr></thead>
        <tbody>{cap.map(c => (
          <tr key={c.assignmentId}><td>{c.assignmentId}</td><td>{c.routeId}</td><td>{c.capacity}</td><td>{c.used}</td><td>{c.free}</td></tr>))}</tbody></table></div>
      )}

      {(tab === 'buses' || tab === 'drivers' || tab === 'assignments') && (
        <div className="card"><pre>{JSON.stringify(rows, null, 1)}</pre></div>
      )}

      {tab === 'create' && <CreateForms onDone={() => setMsg('Created')} />}
    </div>
  );
}

function CreateForms({ onDone }: any) {
  const [msg, setMsg] = useState('');
  const go = async (fn: () => Promise<any>) => { try { await fn(); setMsg('ok'); onDone(); } catch (e: any) { setMsg(e.message); } };
  const [bus, setBus] = useState({ busNo: '', capacity: 40, busType: 'STANDARD' });
  const [drv, setDrv] = useState({ name: '', licenseNo: '', phone: '' });
  const [rt, setRt] = useState({ routeNo: '', source: '', destination: '', distanceKm: 0, fee: 0 });
  const [as, setAs] = useState({ busId: 1, driverId: 1, routeId: 1, shift: 'MORNING' });
  return (
    <div>
      <div className="card"><h4>Bus</h4>
        <input placeholder="busNo" onChange={e => setBus({ ...bus, busNo: e.target.value })} />
        <input placeholder="capacity" type="number" onChange={e => setBus({ ...bus, capacity: Number(e.target.value) })} />
        <button onClick={() => go(() => api.addBus(bus))}>Add bus</button></div>
      <div className="card"><h4>Driver</h4>
        <input placeholder="name" onChange={e => setDrv({ ...drv, name: e.target.value })} />
        <input placeholder="license" onChange={e => setDrv({ ...drv, licenseNo: e.target.value })} />
        <input placeholder="phone" onChange={e => setDrv({ ...drv, phone: e.target.value })} />
        <button onClick={() => go(() => api.addDriver(drv))}>Add driver</button></div>
      <div className="card"><h4>Route</h4>
        <input placeholder="routeNo" onChange={e => setRt({ ...rt, routeNo: e.target.value })} />
        <input placeholder="source" onChange={e => setRt({ ...rt, source: e.target.value })} />
        <input placeholder="dest" onChange={e => setRt({ ...rt, destination: e.target.value })} />
        <button onClick={() => go(() => api.addRoute(rt))}>Add route</button></div>
      <div className="card"><h4>Assignment</h4>
        <input placeholder="busId" type="number" onChange={e => setAs({ ...as, busId: Number(e.target.value) })} />
        <input placeholder="driverId" type="number" onChange={e => setAs({ ...as, driverId: Number(e.target.value) })} />
        <input placeholder="routeId" type="number" onChange={e => setAs({ ...as, routeId: Number(e.target.value) })} />
        <button onClick={() => go(() => api.assign(as))}>Assign</button></div>
      {msg && <p>{msg}</p>}
    </div>
  );
}
