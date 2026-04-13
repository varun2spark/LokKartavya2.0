import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';

export default function Politicians() {
  const [politicians, setPoliticians] = useState([]);
  const [defaultPoliticians, setDefaultPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setPoliticians(defaultPoliticians);
      setSearchMessage('');
      return;
    }
    
    setIsSearching(true);
    setSearchMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/leader?name=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        setSearchMessage("0 politicians found by this name.");
        return;
      }
      const data = await res.json();
      if (data.error) {
        setSearchMessage("0 politicians found by this name.");
        return;
      }
      
      // Show ONLY the matching politician
      setPoliticians([data]);
      // Do not clear the searchQuery so the user sees what they searched
      setSearchMessage("1 politician found by this name.");
    } catch (err) {
      setSearchMessage("Error connecting to server.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const defaultNames = ['Narendra Modi', 'Rahul Gandhi', 'Rekha Gupta', 'Amit Shah', 'Mamata Banerjee', 'Arvind Kejriwal'];
    
    const fetchPoliticians = async () => {
      try {
        const fetchedData = await Promise.all(defaultNames.map(async (name) => {
          try {
            const res = await fetch(`${API_BASE_URL}/leader?name=${encodeURIComponent(name)}`);
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        }));
        
        const validData = fetchedData.filter(pol => pol && !pol.error);
        setPoliticians(validData);
        setDefaultPoliticians(validData);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticians();
  }, []);

  return (
    <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>Politician Directory</h1>
            <p style={{ color: 'var(--dark-light)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
                Explore real-time data, budget allocations, and performance metrics for your elected representatives.
            </p>

            <form onSubmit={handleSearch} style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === '') {
                      setPoliticians(defaultPoliticians);
                      setSearchMessage('');
                    }
                  }}
                  placeholder="Search any politician..." 
                  style={{ flexGrow: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none' }}
                  required
                />
                <button type="submit" className="btn" disabled={isSearching} style={{ opacity: isSearching ? 0.7 : 1 }}>
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>
            {searchMessage && (
                <p style={{ marginTop: '1rem', color: searchMessage.includes('0') || searchMessage.includes('Error') ? '#EF4444' : '#10B981', fontWeight: '500', fontSize: '0.95rem' }}>
                    {searchMessage}
                </p>
            )}
        </div>

        <div className="grid" id="politicianList">
            {loading && <p style={{ textAlign: 'center', gridColumn: '1/-1', color: 'var(--dark-light)' }}>Loading politician data from live sources...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red', gridColumn: '1/-1' }}>Error connecting to the backend server. Is Flask running?</p>}
            
            {!loading && !error && politicians.map((pol, idx) => (
              <div className="card" key={idx}>
                  <div className="card-header">
                      <img src={pol.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(pol.name)}&background=random&color=fff&size=200`} alt={pol.name} className="card-img" style={{ objectFit: 'cover', objectPosition: 'top', background: '#E5E7EB' }} />
                      <div className="card-title">{pol.name}</div>
                      <span className="badge" style={{ marginBottom: '0.5rem' }}>{pol.role}</span>
                      <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: pol.criminal_cases === 0 ? '#D1FAE5' : '#FEE2E2', color: pol.criminal_cases === 0 ? '#065F46' : '#991B1B', display: 'inline-block', marginBottom: '1rem' }}>
                              {pol.criminal_cases} Pending Cases
                          </span>
                      </div>
                  </div>
                  <div className="card-body">
                      <div className="card-info">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                          <span>Edu: {pol.education}</span>
                      </div>
                      <div className="card-info mt-2">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          <span>Assets: {pol.assets}</span>
                      </div>
                      <div className="card-info mt-2" style={{ borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem', marginTop: '0.75rem', fontSize: '0.7rem' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--dark-light)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                          <span style={{ color: 'var(--dark-light)', fontStyle: 'italic' }}>Sources: Wikipedia, MyNeta</span>
                      </div>
                  </div>
                  <div className="card-footer">
                      <Link to={`/politician-detail?name=${encodeURIComponent(pol.name)}`} className="btn text-center">View Full Profile</Link>
                  </div>
              </div>
            ))}
        </div>
    </div>
  );
}
