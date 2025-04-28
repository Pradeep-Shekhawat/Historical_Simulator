import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ScenarioList from './components/ScenarioList';
import GameDashboard from './components/GameDashboard';
import { AuthContext } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const { user, loading, logout } = useContext(AuthContext);
  const isAuth = !!user;

  return (
    <Router>
      <Header isAuth={isAuth} onLogout={logout} />
      <AnimatePresence exitBeforeEnter>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={() => {}} />} />
            <Route
              path="/scenarios"
              element={isAuth ? <ScenarioList /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/game/:scenarioId"
              element={isAuth ? <GameDashboard /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to={isAuth ? '/scenarios' : '/login'} replace />} />
          </Routes>
        )}
      </AnimatePresence>
      <Footer />
    </Router>
  );
}