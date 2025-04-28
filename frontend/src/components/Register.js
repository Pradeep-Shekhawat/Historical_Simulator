import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
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
      await API.post('/auth/register', form);
      await login(form.username, form.password);
      nav('/scenarios', { replace: true });
    } catch (e) {
      const res = e.response?.data;
      if (Array.isArray(res?.errors)) {
        setErr(res.errors.map(x=>x.msg).join('. '));
      } else {
        setErr(res?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="login-form">
        <label>Email<input type="email" name="username" value={form.username} onChange={onChange} required /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={onChange} required /></label>
        {err && <p className="error-message">{err}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have account? <Link to="/login">Login here</Link></p>
    </div>
  );
}