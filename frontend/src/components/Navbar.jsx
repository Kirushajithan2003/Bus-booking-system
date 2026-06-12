import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const BusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="13" rx="2" fill="#6366f1" opacity="0.2"/>
    <rect x="2" y="5" width="20" height="13" rx="2" stroke="#6366f1" strokeWidth="1.5"/>
    <path d="M2 10h20" stroke="#6366f1" strokeWidth="1.5"/>
    <path d="M7 18v2M17 18v2" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="5" y="12" width="3" height="3" rx="0.5" fill="#6366f1"/>
    <rect x="11" y="12" width="3" height="3" rx="0.5" fill="#6366f1"/>
  </svg>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <BusIcon />
          <span>Bus<span className="brand-go">Go</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</Link>
          {user && (
            <Link to="/my-bookings" className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>My Bookings</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
        </div>

        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className={`user-dropdown ${menuOpen ? 'open' : ''}`}>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="dropdown-divider" />
                <Link to="/my-bookings" className="dropdown-item" onClick={() => setMenuOpen(false)}>My Bookings</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
                )}
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
