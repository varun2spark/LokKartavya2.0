import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          LokKartavya
        </Link>
        <div className="nav-links">
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--primary)' : '' }}>Home</Link>
          <Link to="/politicians" style={{ color: location.pathname === '/politicians' ? 'var(--primary)' : '' }}>Politicians</Link>
          <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--primary)' : '' }}>About Us</Link>
          <Link to="/feedback" style={{ color: location.pathname === '/feedback' ? 'var(--primary)' : '' }}>Feedback</Link>
          {isAuthenticated ? (
            <a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
          ) : (
             <Link to="/login" className="nav-cta">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
