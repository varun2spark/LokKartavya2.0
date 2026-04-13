import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

export default function PoliticianDetail() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  
  const [politician, setPolitician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Issue Form state
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [submittingIssue, setSubmittingIssue] = useState(false);

  useEffect(() => {
    if (!name) {
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/leader?name=${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        setPolitician(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [name]);

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setSubmittingIssue(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: issueTitle, description: issueDesc })
      });
      if(res.ok) {
        alert('Issue reported successfully. It will appear on the dashboard after review.');
        setIssueTitle('');
        setIssueDesc('');
      } else {
        alert('Failed to report issue.');
      }
    } catch (e) {
      alert('Error submitting issue.');
    } finally {
      setSubmittingIssue(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
          <h2 style={{ textAlign: 'center', color: 'var(--dark-light)', marginTop: '4rem' }}>Loading details...</h2>
      </div>
    );
  }

  if (!name || error || !politician) {
    return (
      <div className="container">
          <div className="text-center" style={{ marginTop: '4rem' }}>
              <h2 style={{ color: error ? 'red' : 'inherit' }}>{error ? 'Error loading details.' : 'Politician not found.'}</h2>
              <Link to="/politicians" className="btn mt-4">Browse Directory</Link>
          </div>
      </div>
    );
  }

  // Calculate percentage used if possible
  let percentage = 0;
  if (politician.budget) {
      let totalVal = parseFloat(politician.budget.total.replace(/[^0-9.]/g, ''));
      let usedVal = parseFloat(politician.budget.utilized.replace(/[^0-9.]/g, ''));
      if(!isNaN(totalVal) && !isNaN(usedVal) && totalVal > 0) {
          percentage = Math.round((usedVal / totalVal) * 100);
      } else {
          percentage = 65; 
      }
  }

  return (
    <div className="container">
        <div style={{ marginBottom: '2rem' }}>
            <Link to="/politicians" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Back to Directory
            </Link>
        </div>

        <div className="profile-header" style={{ alignItems: 'flex-start' }}>
            <img src={politician.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(politician.name)}&background=random&color=fff&size=200`} alt={politician.name} className="profile-img-large" style={{ objectFit: 'cover', objectPosition: 'top', background: '#E5E7EB' }} />
            
            <div className="profile-info" style={{ flexGrow: 1 }}>
                <h1>{politician.name}</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge" style={{ marginBottom: 0 }}>{politician.role}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: politician.criminal_cases === 0 ? '#D1FAE5' : '#FEE2E2', color: politician.criminal_cases === 0 ? '#065F46' : '#991B1B', border: `1px solid ${politician.criminal_cases === 0 ? '#34D399' : '#F87171'}` }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '2px' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        {politician.criminal_cases} Pending Cases
                    </span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div>
                        <div className="profile-meta" style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            <strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '4px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Constituency:</strong> {politician.constituency || 'N/A'}
                        </div>
                        <div className="profile-meta" style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            <strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '4px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Term Duration:</strong> {politician.term || 'N/A'}
                        </div>
                        <div className="profile-meta" style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                            <strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '4px' }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> Education:</strong> {politician.education}
                        </div>
                    </div>
                    <div>
                        <div className="profile-meta" style={{ marginBottom: '0.5rem', fontSize: '1rem', lineHeight: '1.6' }}>
                            <strong>Biography:</strong> 
                            <div style={{ color: 'var(--dark)', marginTop: '0.5rem' }}>{politician.summary}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--dark-light)', marginTop: '0.5rem', fontStyle: 'italic' }}>Source: Wikipedia</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start', marginTop: '2rem' }}>
            
            {/* Left Column: Budget & Commitments */}
            <div>
                {politician.criminal_details && politician.criminal_details.length > 0 && (
                  <div className="dashboard-section" style={{ marginTop: '2rem', borderLeft: '4px solid #EF4444', background: '#FEF2F2' }}>
                      <h3 style={{ fontSize: '1.25rem', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                          Pending Case Details
                      </h3>
                      <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: '#7F1D1D' }}>
                          {politician.criminal_details.map((detail, idx) => <li key={idx} style={{ marginBottom: '0.5rem' }}>{detail}</li>)}
                      </ul>
                      <div style={{ fontSize: '0.7rem', color: '#991B1B', marginTop: '0.5rem', marginLeft: '0.5rem', fontStyle: 'italic' }}>Source: ADR India / MyNeta Affidavits</div>
                  </div>
                )}

                <h2 style={{ fontSize: '1.75rem', color: 'var(--dark)', marginBottom: '1.5rem', marginTop: politician.criminal_details && politician.criminal_details.length > 0 ? '2.5rem' : '0' }}>Financial Overview</h2>
                
                <div className="stats-grid" style={{ marginBottom: '1rem' }}>
                    <div className="stat-card" style={{ padding: '1rem' }}>
                        <div className="stat-card-title">Total Allocated</div>
                        <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{politician.budget ? politician.budget.total : 'N/A'}</div>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem' }}>
                        <div className="stat-card-title">Utilized</div>
                        <div className="stat-card-value primary" style={{ fontSize: '1.5rem' }}>{politician.budget ? politician.budget.utilized : 'N/A'}</div>
                    </div>
                    <div className="stat-card" style={{ padding: '1rem' }}>
                        <div className="stat-card-title">Rate</div>
                        <div className="stat-card-value success" style={{ fontSize: '1.5rem' }}>{percentage}%</div>
                        <div style={{ width: '100%', background: '#E5E7EB', borderRadius: '9999px', height: '6px', marginTop: '0.5rem' }}>
                            <div style={{ background: 'var(--secondary)', width: `${percentage}%`, height: '100%', borderRadius: '9999px' }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="dashboard-section" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Categorical Expenditure Overview</h3>
                    {politician.budget && politician.budget.categories && (
                      <div className="category-bars">
                        {politician.budget.categories.map((cat, idx) => (
                          <div className="category-item" key={idx}>
                              <div className="category-header">
                                  <span>{cat.name}</span>
                                  <span style={{ color: cat.color, fontWeight: 600 }}>{cat.amount} <span style={{ color: 'var(--dark-light)', fontWeight: 500, fontSize: '0.85rem' }}>({cat.percentage}%)</span></span>
                              </div>
                              <div className="category-bar-bg">
                                  <div className="category-bar-fill" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color, transition: 'width 1s ease-out' }}></div>
                              </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.7rem', color: 'var(--dark-light)', marginTop: '0.5rem', fontStyle: 'italic' }}>Source: Ministry of Finance / Official Budget Documents</div>
                </div>

                <div className="dashboard-section">
                    <h3 style={{ fontSize: '1.25rem' }}>Commitment Tracker</h3>
                    <p style={{ color: 'var(--dark-light)', marginBottom: '1.5rem' }}>Track the status of key manifesto promises.</p>
                    {politician.commitments ? (
                      politician.commitments.map((c, idx) => (
                        <div className="timeline-item" key={idx}>
                            <div className="timeline-title">{c.title}</div>
                            <span className={`status status-${c.status}`}>{c.status.replace('-', ' ')}</span>
                        </div>
                      ))
                    ) : null}
                    <div style={{ fontSize: '0.7rem', color: 'var(--dark-light)', marginTop: '0.5rem', fontStyle: 'italic' }}>Source: Political Manifesto / Party Website</div>
                </div>
            </div>

            {/* Right Column: Reporting */}
            <div className="dashboard-section" style={{ background: 'var(--white)', border: '2px solid #F3F4F6' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Constituency Issues</h3>
                <p style={{ color: 'var(--dark-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Publicly reported problems in {politician.constituency || 'this constituency'}.</p>
                
                <div style={{ marginBottom: '2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {politician.issues && politician.issues.length > 0 ? (
                      politician.issues.map((issue, idx) => (
                        <div className="issue-card" key={idx}>
                            <div className="issue-title">{issue.title}</div>
                            <div className="issue-date">Reported on: {issue.date}</div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--dark-light)', fontStyle: 'italic' }}>No issues reported yet.</p>
                    )}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <form onSubmit={handleIssueSubmit}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <input type="text" required placeholder="Brief title of the issue" style={{ fontSize: '0.9rem', padding: '0.6rem' }} value={issueTitle} onChange={e => setIssueTitle(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <textarea rows="3" required placeholder="Details..." style={{ fontSize: '0.9rem', padding: '0.6rem' }} value={issueDesc} onChange={e => setIssueDesc(e.target.value)}></textarea>
                        </div>
                        <button type="submit" className="btn w-100" style={{ padding: '0.75rem', fontSize: '0.95rem' }} disabled={submittingIssue}>{submittingIssue ? 'Submitting...' : 'Submit Report'}</button>
                    </form>
                </div>
            </div>

        </div>
    </div>
  );
}
