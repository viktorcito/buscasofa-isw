import { useState } from 'react';
import { API_BASE } from '../apis/config';
import './Form.css'

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('¡Bienvenido, ' + data.username + '!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      if (onLogin) onLogin(data.username);
    } else {
      setMsg(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <label htmlFor="login-email">Email</label>
      <input id="login-email" name="email" type="email" placeholder="tucorreo@email.com" autoComplete="email" onChange={handleChange} required />
      <label htmlFor="login-password">Contraseña</label>
      <input id="login-password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" onChange={handleChange} required />
      <button type="submit">Entrar</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default Login;