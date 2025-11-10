import React, { useState, useEffect } from 'react';

export function adviceWidget() {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/advice');
      if (response.ok) {
        const data = await response.json();
        setAdvice(data.advice);
      }
    } catch (error) {
      console.error('Failed to fetch advice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#4a4e69',
      padding: '1.5rem',
      borderRadius: '8px',
      margin: '2rem 0',
      border: '2px solid #c9ada7'
    }}>
      <h3>💡 Composer's Tip of the Day</h3>
      {loading ? (
        <p>Loading wisdom...</p>
      ) : (
        <p style={{fontStyle: 'italic', color: '#f2e9e4'}}>{advice}</p>
      )}
      <button onClick={fetchAdvice} className="card-btn" style={{marginTop: '1rem'}}>
        Get New Tip
      </button>
    </div>
  );
}
