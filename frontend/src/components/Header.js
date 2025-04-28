import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ isAuth, onLogout }) {
  const nav = useNavigate();
  const discordUrl = process.env.REACT_APP_DISCORD_URL;

  return (
    <header className="app-header">
      <Link to={isAuth ? '/scenarios' : '/login'} className="app-logo">
        <img
          src="/logo.png"
          alt="Historical Simulator Logo"
          className="app-logo-img"
        />
      </Link>

      <div className="header-center">
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <img
            src="/Forever_Knights.png"
            alt="Forever Knights Logo"
            className="forever-logo-img"
          />
        </a>
        <h1 className="forever-title">Forever Knights</h1>
      </div>

      {isAuth ? (
        <button
          className="user-menu"
          onClick={() => {
            onLogout();
            nav('/login');
          }}
        >
          Logout
        </button>
      ) : (
        <Link to="/login" className="user-menu">
          Login
        </Link>
      )}
    </header>
  );
}