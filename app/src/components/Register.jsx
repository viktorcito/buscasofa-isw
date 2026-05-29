import { useState } from 'react';
import { API_BASE } from '../apis/config';
import './Form.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className='register-form'>
      <h2>Registro de Usuario</h2>
      <label htmlFor="reg-username">Usuario</label>
      <input id="reg-username" name="username" placeholder="Tu nombre de usuario" autoComplete="username" onChange={handleChange} required />
      <label htmlFor="reg-email">Email</label>
      <input id="reg-email" name="email" type="email" placeholder="tucorreo@email.com" autoComplete="email" onChange={handleChange} required />
      <label htmlFor="reg-password">Contraseña</label>
      <input id="reg-password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" onChange={handleChange} required />
      <button type="submit">Registrarse</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

export default Register;