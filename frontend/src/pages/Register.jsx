import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
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
      alert('Account created successfully! Please sign in.');
      navigate('/login');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="form-card">
            <div className="text-center" style={{ marginBottom: '2rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <h2 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Create Account</h2>
                <p style={{ color: 'var(--dark-light)', fontSize: '0.95rem' }}>Join LokKartavya and start tracking</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" required placeholder="John Doe" />
                </div>

                <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" required placeholder="you@example.com" />
                </div>
                
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" required placeholder="Create a strong password" />
                </div>
                
                <button type="submit" className="btn w-100" style={{ padding: '1rem', marginTop: '0.5rem' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Register Now'}
                </button>
            </form>
            
            <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.95rem', color: 'var(--dark-light)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign in here</Link>
            </p>
        </div>
    </div>
  );
}
