import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr]   = useState('');

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErr('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      nav('/scenarios', { replace: true });
    } catch (e) {
      const res = e.response?.data;
      if (Array.isArray(res?.errors)) {
        setErr(res.errors.map(x=>x.msg).join('. '));
      } else {
        setErr(res?.error || 'Login failed');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="login-form">
        <label>Email<input type="email" name="username" value={form.username} onChange={onChange} required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={onChange} required /></label>
        {err && <p className="error-message">{err}</p>}
        <button type="submit">Login</button>
      </form>
      <p>New user? <Link to="/register">Register here</Link></p>
    </div>
  );
}