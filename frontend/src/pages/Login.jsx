import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      login();
      navigate('/');
    }, 500);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="form-card">
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ color: 'var(--dark-light)', fontSize: '0.95rem' }}>Please enter your credentials to access LokKartavya</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required placeholder="you@example.com" />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" required placeholder="••••••••" />
                </div>
                
                <button type="submit" className="btn w-100" style={{ padding: '1rem', marginTop: '0.5rem' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
            
            <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.95rem', color: 'var(--dark-light)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
            </p>
        </div>
    </div>
  );
}
