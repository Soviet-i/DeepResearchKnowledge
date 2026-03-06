import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';
import { useLanguage } from '../hooks/useLanguage';

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 h-16 flex items-center justify-between">
      <Link to="/" className="text-white font-semibold text-xl">Deep Research</Link>
      <nav className="flex items-center space-x-6">
        <Link to="/" className="text-white hover:text-blue-100 transition-colors">
          {t.home}
        </Link>
        <Link to="/preferences" className="text-white hover:text-blue-100 transition-colors">
          {t.preferences}
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/user-center" className="text-white hover:text-blue-100 transition-colors">
              {t.userCenter}
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-white hover:text-blue-100 transition-colors"
            >
              {t.logout}
            </button>
            <span className="text-blue-100 text-sm hidden md:inline">
              {user?.email || 'signed in'}
            </span>
          </>
        ) : (
          <Link to="/login" className="text-white hover:text-blue-100 transition-colors">
            {t.login}
          </Link>
        )}
      </nav>
    </header>
  );
}
