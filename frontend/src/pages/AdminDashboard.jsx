import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { API_BASE_URL } from '../utils/api';

export default function AdminDashboard() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!isAuthenticated || !user?.is_admin) {
      navigate('/');
      return;
    }
    fetchIssues(activeTab);
  }, [isAuthenticated, user, navigate, activeTab]);

  const fetchIssues = async (tab) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('lokkartavya_token');
      const endpoint = tab === 'pending' ? '/admin/issues' : '/admin/issues/live';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error("Error fetching pending issues", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (issueId, action) => {
    try {
      const token = localStorage.getItem('lokkartavya_token');
      const res = await fetch(`${API_BASE_URL}/admin/issues/${issueId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        // Remove the issue from the list
        setIssues(issues.filter(issue => issue.id !== issueId));
      } else {
        alert(`Failed to ${action} issue.`);
      }
    } catch (err) {
      alert(`Error trying to ${action} issue.`);
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Admin Moderation Queue</h1>
      <p style={{ color: 'var(--dark-light)', marginBottom: '1.5rem' }}>Review pending issues or take down live issues.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E5E7EB' }}>
        <button 
          onClick={() => setActiveTab('pending')}
          style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'pending' ? 'var(--primary)' : '#6B7280', fontWeight: 600, cursor: 'pointer' }}
        >
          Pending Queue
        </button>
        <button 
          onClick={() => setActiveTab('live')}
          style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'live' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'live' ? 'var(--primary)' : '#6B7280', fontWeight: 600, cursor: 'pointer' }}
        >
          Live Issues
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : issues.length === 0 ? (
        <div style={{ padding: '3rem', background: '#F9FAFB', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ margin: '0 auto 1rem auto' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3 style={{ color: '#4B5563' }}>All caught up!</h3>
          <p style={{ color: '#6B7280' }}>
            {activeTab === 'pending' ? 'There are no pending issues to review.' : 'There are no live issues.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {issues.map(issue => (
            <div key={issue.id} style={{ border: '1px solid #E5E7EB', borderRadius: '0.5rem', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 250px' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{issue.title}</h3>
                    <div style={{ display: 'inline-block', background: '#FEF2F2', color: '#991B1B', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      Target: {issue.politician_name}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>{issue.date}</span>
                </div>
                
                <p style={{ color: '#4B5563', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{issue.description}</p>
                
                {issue.geotag && (
                  <div style={{ fontSize: '0.85rem', color: '#6366F1', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {issue.geotag}
                  </div>
                )}
              </div>
              
              <div style={{ background: '#F9FAFB', borderLeft: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                {issue.image_filename ? (
                  <div style={{ flexGrow: 1, padding: '1rem', borderBottom: '1px solid #E5E7EB' }}>
                    <img src={`${API_BASE_URL}/uploads/${issue.image_filename}`} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                ) : (
                  <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic', borderBottom: '1px solid #E5E7EB' }}>
                    No Photo
                  </div>
                )}
                {activeTab === 'pending' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#E5E7EB' }}>
                    <button onClick={() => handleAction(issue.id, 'reject')} style={{ background: 'white', color: '#DC2626', border: 'none', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                    <button onClick={() => handleAction(issue.id, 'approve')} style={{ background: 'white', color: '#059669', border: 'none', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1px', background: '#E5E7EB' }}>
                    <button onClick={() => handleAction(issue.id, 'reject')} style={{ background: 'white', color: '#DC2626', border: 'none', padding: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Take Down / Remove</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
