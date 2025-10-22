import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { currentUser, login } = useAuth();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

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
        <h2>Find Your Soundtrack</h2>
        <p>Request custom music, run contests, and discover hidden talent.</p>
      </section>

      {!currentUser && (
        <section className="card-section">
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3>Login to Get Started</h3>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button type="submit" className="card-btn">Login</button>
            </form>
          </div>
        </section>
      )}

      {currentUser && (
        <section className="card-section">
          <button onClick={() => navigate('/bounties')} className="card-btn-big">
            View Bounties
          </button>
          <button onClick={() => navigate('/post-rfp')} className="card-btn-big">
            Post New Bounty
          </button>
          <button onClick={() => navigate('/submit')} className="card-btn-big">
            Submit Songs
          </button>
        </section>
      )}

      <footer className="text-center mt-4">
        <p>Created by George Dexter Brunt</p>
      </footer>
    </div>
  );
}