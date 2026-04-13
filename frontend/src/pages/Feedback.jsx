import React, { useState } from 'react';
import { API_BASE_URL } from '../utils/api';

export default function Feedback() {
  const [formData, setFormData] = useState({ name: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('Thank you for your feedback! It has been recorded securely.');
        setFormData({ name: '', subject: '', message: '' });
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (err) {
      alert('Error submitting feedback. Is the server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
        <div className="form-card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2>Raise an Issue</h2>
            <p style={{ textAlign: 'center', color: 'var(--dark-light)', marginBottom: '2rem' }}>
                Help us improve the platform or report discrepancies in transparency data.
            </p>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                
                <div className="form-group">
                    <label>Subject Topic</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="E.g., Missing constituency data"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Detailed Message</label>
                    <textarea 
                      rows="5" 
                      required 
                      placeholder="Please describe the issue in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn w-100" 
                  style={{ padding: '1rem', fontSize: '1.1rem', opacity: isSubmitting ? 0.7 : 1 }} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    </div>
  );
}
