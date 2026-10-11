import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const [f, setF] = useState({ name: '', email: '', password: '', collegeId: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: any) => {
    e.preventDefault(); setErr('');
    try { await api.register(f); nav('/login'); }
    catch (e: any) { setErr(e.message); }
  };
  return (
    <div className="card">
      <h2>Student Register</h2>
      <form onSubmit={submit}>
        <input placeholder="name" value={f.name} onChange={set('name')} />
        <input placeholder="email" value={f.email} onChange={set('email')} />
        <input placeholder="password" type="password" value={f.password} onChange={set('password')} />
        <input placeholder="college ID" value={f.collegeId} onChange={set('collegeId')} />
        <button>Register</button>
      </form>
      {err && <p className="error">{err}</p>}
    </div>
  );
}
