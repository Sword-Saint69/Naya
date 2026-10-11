import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import RoutesPage from './pages/RoutesPage';
import StudentPass from './pages/StudentPass';
import Admin from './pages/AdminCapacity';
import { logout } from './api';

function Nav() {
  const nav = useNavigate();
  const loc = useLocation();
  const role = localStorage.getItem('role');
  const out = () => { logout(); nav('/login'); };
  const cls = (p: string) => (loc.pathname === p ? 'active' : '');
  return (
    <nav className="topbar">
      <span className="brand"><span className="brand-mark">🚌</span> Bus Pass</span>
      <Link className={cls('/routes')} to="/routes">Routes</Link>
      <Link className={cls('/me')} to="/me">My Pass</Link>
      {role === 'ADMIN' && <Link className={cls('/admin')} to="/admin">Admin</Link>}
      <span className="spacer" />
      {role
        ? <><span className="role-chip">{role}</span><button className="btn-ghost" onClick={out}>Logout</button></>
        : <><Link className={cls('/login')} to="/login">Login</Link><Link className={cls('/register')} to="/register">Register</Link></>}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<RoutesPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<StudentPass />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
