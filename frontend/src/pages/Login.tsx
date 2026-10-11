import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const submit = async (e: any) => {
    e.preventDefault(); setErr('');
    try {
      const d = await api.login({ email, password });
      localStorage.setItem('access', d.access);
      localStorage.setItem('role', d.role);
      nav(d.role === 'ADMIN' ? '/admin' : '/routes');
    } catch (e: any) { setErr(e.message); }
  };
  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      {err && <p className="error">{err}</p>}
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
