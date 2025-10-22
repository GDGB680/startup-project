import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storageService';

export function Home() {
  const { currentUser, login } = useAuth();
  const [username, setUsername] = useState('');
  const [bountyCount, setBountyCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time bounty count updates
    const bounties = StorageService.getBounties();
    setBountyCount(bounties.length);

    const interval = setInterval(() => {
      const updatedBounties = StorageService.getBounties();
      setBountyCount(updatedBounties.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
      setUsername('');
    }
  };

  return (
    <div>
      <section className="intro">
        <h2>🎵 Find Your Soundtrack</h2>
        <p>Request custom music, run contests, and discover hidden talent.</p>
      </section>

      <section className="card-section">
        <div style={{textAlign: 'center'}}>
          <h3 style={{fontSize: '2.5rem', color: '#c9ada7'}}>{bountyCount}</h3>
          <p>Bounties Available (Live Updates)</p>
        </div>
      </section>

      {!currentUser && (
        <section className="card-section">
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3>Login to Get Started</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  marginBottom: '1rem'
                }}
              />
              <button type="submit" className="card-btn" style={{width: '100%'}}>
                Login
              </button>
            </form>
          </div>
        </section>
      )}

      {currentUser && (
        <section className="card-section">
          <h2>Welcome, {currentUser.username}! 🎉</h2>
          <div className="card-list">
            <button 
              onClick={() => navigate('/bounties')} 
              className="card-btn-big"
              style={{display: 'block', margin: '1rem auto'}}
            >
              🎯 View Bounties
            </button>
            <button 
              onClick={() => navigate('/post-rfp')} 
              className="card-btn-big"
              style={{display: 'block', margin: '1rem auto'}}
            >
              ✏️ Post New Bounty
            </button>
            <button 
              onClick={() => navigate('/submit')} 
              className="card-btn-big"
              style={{display: 'block', margin: '1rem auto'}}
            >
              🎵 Submit Your Work
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="card-btn-big"
              style={{display: 'block', margin: '1rem auto'}}
            >
              👤 View Profile
            </button>
          </div>
        </section>
      )}

      <section style={{textAlign: 'center', margin: '2rem 0', color: '#c9ada7'}}>
        <p>Created by <strong>George Dexter Brunt</strong></p>
        <a 
          href="https://github.com/GDGB680/startup-project" 
          target="_blank" 
          rel="noreferrer"
          style={{color: '#c9ada7', textDecoration: 'none'}}
        >
          🔗 View Source Code on GitHub
        </a>
      </section>
    </div>
  );
}
