import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000
});

API.interceptors.request.use(cfg => {
  const t = localStorage.getItem('authToken');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

API.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401) {
    localStorage.removeItem('authToken');
    window.location.replace('/login');
  }
  return Promise.reject(e);
});

export default API;