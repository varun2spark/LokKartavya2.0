import React from 'react';

export default function About() {
  return (
    <>
      <div className="hero" style={{ padding: '4rem 2rem', borderBottom: 'none' }}>
          <h1 style={{ fontSize: '3rem' }}>About LokKartavya</h1>
          <p>Bending the arc of democracy towards transparency</p>
      </div>

      <div className="container" style={{ maxWidth: '800px', paddingTop: '0' }}>
          <div style={{ background: 'var(--white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
              <h2 style={{ color: 'var(--dark)', fontSize: '1.75rem', marginBottom: '1rem' }}>Our Mission</h2>
              <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                  LokKartavya is a platform aimed at bringing absolute transparency to Indian politics. We empower citizens to view detailed statistics about their politicians, including their electoral terms, constituencies, and critically, how they allocate and utilize public funds.
              </p>
              
              <h2 style={{ color: 'var(--dark)', fontSize: '1.75rem', marginBottom: '1rem' }}>Why This Matters</h2>
              <p style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                  An informed voter is the foundation of a strong democracy. By shedding light on the gap between promises and deliverables, we aim to foster a culture of accountability among leaders and awareness among the populace.
              </p>

              <div style={{ background: '#EEF2FF', padding: '2rem', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)' }}>
                  <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Built by Students, For Citizens</h3>
                  <p style={{ margin: '0', color: 'var(--dark-light)' }}>
                      We are a group of passionate students leveraging technology to solve civic issues without unnecessarily complex frameworks. Pure code, pure transparency.
                  </p>
              </div>
          </div>
      </div>
    </>
  );
}
