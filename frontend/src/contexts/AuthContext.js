// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // on mount, read token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setUser({ token });
    setLoading(false);
  }, []);

  // return true on success, throw on failure
  const login = async (username, password) => {
    try {
      const { data } = await API.post('/auth/login', { username, password });
      localStorage.setItem('authToken', data.token);
      setUser({ token: data.token });
      return true;
    } catch (err) {
      // re-throw so UI can catch it
      throw err.response?.data?.error || 'Login failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}