import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Submit() {
  const [bounties, setBounties] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadData();
  }, [currentUser, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch all bounties
      const bountiesRes = await fetch('/api/bounties', { credentials: 'include' });
      if (bountiesRes.ok) {
        setBounties(await bountiesRes.json());
      }

      // Fetch user submissions
      const submissionsRes = await fetch('/api/submissions/user', { credentials: 'include' });
      if (submissionsRes.ok) {
        setSubmissions(await submissionsRes.json());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSong = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bountyId: selectedBounty.id,
          bountyTitle: selectedBounty.title,
          songTitle: songTitle
        }),
        credentials: 'include'
      });

      if (response.ok) {
        setSongTitle('');
        setShowForm(false);
        setSelectedBounty(null);
        await loadData();
        alert('Song submitted successfully!');
      } else {
        const error = await response.json();
        setError(error.msg || 'Failed to submit');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>;
  }

  return (
    <div>
      {error && <div style={{color: '#dc3545', margin: '1rem'}}>{error}</div>}

      <section className="card-section">
        <h2>Available Bounties</h2>
        <div className="card-list">
          {bounties.map(bounty => (
            <div key={bounty.id} className="card">
              <h3>{bounty.title}</h3>
              <p>Prize: ${bounty.bountyPrize}</p>
              <button 
                className="card-btn"
                onClick={() => {
                  setSelectedBounty(bounty);
                  setShowForm(true);
                }}
              >
                Submit Song
              </button>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <section className="card-section">
          <div className="card" style={{maxWidth: '500px', margin: '0 auto'}}>
            <h3>Submit to: {selectedBounty.title}</h3>
            <form onSubmit={handleSubmitSong}>
              <input 
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                required
                placeholder="Enter your song title"
              />
              <button type="submit" className="card-btn">Submit</button>
              <button 
                type="button" 
                className="card-btn" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="card-section">
        <h2>🎵 My Submissions</h2>
        <div className="card-list">
          {submissions.length > 0 ? (
            submissions.map(submission => (
              <div key={submission.id} className="card">
                <h3>{submission.songTitle}</h3>
                <span className={`tag status-${submission.status.toLowerCase()}`}>
                  {submission.status}
                </span>
                <p>Bounty: {submission.bountyTitle}</p>
                <p>Submitted: {new Date(submission.submittedDate).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No submissions yet. Submit to a bounty above!</p>
          )}
        </div>
      </section>
    </div>
  );
}
