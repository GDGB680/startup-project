import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LiveFeed } from '../components/LiveFeed';
import { adviceWidget } from '../components/adviceWidget';

export function Home() {
  const { currentUser, login, signup, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [bountyCount, setBountyCount] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch bounty count from backend
    fetchBountyCount();
  }, []);

  const fetchBountyCount = async () => {
    try {
      const response = await fetch('/api/bounties');
      if (response.ok) {
        const bounties = await response.json();
        setBountyCount(bounties.length);
      }
    } catch (error) {
      console.error('Failed to fetch bounty count:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = isSignup 
      ? await signup(email, password)
      : await login(email, password);

    if (result.success) {
      setEmail('');
      setPassword('');
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div>
      <section className="intro">
        <h2>Find Your Soundtrack</h2>
        <p>Request custom music, run contests, and discover hidden talent.</p>
      </section>

      <section className="card-section">
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2.5rem', color: '#c9ada7' }}>{bountyCount}</h3>
          <p>Bounties Available</p>
        </div>
      </section>

      {/* Show login/signup form when not logged in */}
      {!currentUser && (
        <section className="card-section">
          <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3>{isSignup ? 'Create Account' : 'Login'}</h3>
            {error && <div style={{ color: '#35addcff', marginBottom: '1rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  marginBottom: '1rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: 'none',
                  marginBottom: '1rem',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="submit" 
                className="card-btn" 
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <button 
              onClick={() => setIsSignup(!isSignup)}
              style={{
                background: 'none', 
                border: 'none', 
                color: '#c9ada7', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isSignup 
                ? 'Already have an account? Login' 
                : 'Need an account? Sign Up'}
            </button>
          </div>
        </section>
      )}

      {/* Show navigation buttons when logged in */}
      {currentUser && (
        <section className="card-section">
          <h2>Welcome, {currentUser.email}! 🎉</h2>
          <div className="card-list">
            <button 
              onClick={() => navigate('/bounties')} 
              className="card-btn-big"
              style={{ display: 'block', margin: '1rem auto' }}
            >
            View Bounties
            </button>
            <button 
              onClick={() => navigate('/post-rfp')} 
              className="card-btn-big"
              style={{ display: 'block', margin: '1rem auto' }}
            >
            Post New Bounty
            </button>
            <button 
              onClick={() => navigate('/submit')} 
              className="card-btn-big"
              style={{ display: 'block', margin: '1rem auto' }}
            >
            Submit Your Work
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="card-btn-big"
              style={{ display: 'block', margin: '1rem auto' }}
            >
            View Profile
            </button>
          </div>
        </section>
      )}

      {/* Display advice widget */}
      <adviceWidget />

      {/* Footer */}
      <section style={{ textAlign: 'center', margin: '2rem 0', color: '#c9ada7' }}>
        <p>Created by <strong>George Dexter Brunt</strong></p>
        <a 
          href="https://github.com/GDGB680/startup-project" 
          target="_blank" 
          rel="noreferrer"
          style={{ color: '#c9ada7', textDecoration: 'none' }}
        >
        View Source Code on GitHub
        </a>
      </section>
    </div>
  );
}