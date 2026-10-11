import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="auth-wrap">
      <div className="card">
        <h2>Create account</h2>
        <p className="note">Students register here. Admin role is granted by promotion.</p>
        <form onSubmit={submit}>
          <input placeholder="Full name" value={f.name} onChange={set('name')} />
          <input placeholder="College email" value={f.email} onChange={set('email')} />
          <input placeholder="Password (min 6)" type="password" value={f.password} onChange={set('password')} />
          <input placeholder="College ID" value={f.collegeId} onChange={set('collegeId')} />
          <button>Register</button>
        </form>
        {err && <p className="error">{err}</p>}
        <p className="note">Have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
