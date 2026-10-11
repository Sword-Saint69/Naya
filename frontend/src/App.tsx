import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import RoutesPage from './pages/RoutesPage';
import StudentPass from './pages/StudentPass';
import Admin from './pages/AdminCapacity';
import { logout } from './api';

function Nav() {
  const nav = useNavigate();
  const role = localStorage.getItem('role');
  const out = () => { logout(); nav('/login'); };
  return (
    <nav>
      <b>Bus Pass</b>
      <Link to="/routes">Routes</Link>
      <Link to="/me">My Pass</Link>
      {role === 'ADMIN' && <Link to="/admin">Admin</Link>}
      <span style={{ marginLeft: 'auto' }} />
      {role ? <button onClick={out}>Logout ({role})</button> : <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
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
