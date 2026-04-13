import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="hero">
          <h1>Transparency in Governance</h1>
          <p>Your ultimate platform to track, analyze, and understand the performance of your elected representatives. Know where your tax money is being spent.</p>
          <div className="hero-buttons">
              <Link to="/politicians" className="btn">Explore Politicians</Link>
              <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
      </div>

      <div className="container text-center">
          <h2 style={{ fontSize: '2rem', color: 'var(--dark)', marginBottom: '3rem' }}>Why LokKartavya?</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', textAlign: 'left', gap: '2rem' }}>
              <div className="card" style={{ padding: '2rem', border: 'none' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.25rem' }}>Real-time Budget Tracking</h3>
                  <p>Gain insights into how allocated funds are utilized across crucial sectors like healthcare, education, and infrastructure.</p>
              </div>
              <div className="card" style={{ padding: '2rem', border: 'none' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.25rem' }}>Hold Leaders Accountable</h3>
                  <p>View the gap between commitments and actual deliveries. We parse the data so you can easily assess performance.</p>
              </div>
              <div className="card" style={{ padding: '2rem', border: 'none' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.25rem' }}>Citizen Feedback</h3>
                  <p>Submit issues directly. Highlight concerns in your constituency and make your voice heard at scale.</p>
              </div>
          </div>
      </div>
    </>
  );
}
