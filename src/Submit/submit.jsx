import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Submit() {
  const [submissions, setSubmissions] = useState([]);
  const [bounties, setBounties] = useState([]);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    const loadedSubmissions = StorageService.getSubmissions();
    const userSubmissions = loadedSubmissions.filter(s => s.submittedBy === currentUser.username);
    setSubmissions(userSubmissions);

    const loadedBounties = StorageService.getBounties();
    setBounties(loadedBounties);
  }, [currentUser, navigate]);

  const handleSubmitSong = (e) => {
    e.preventDefault();
    
    const submission = {
      bountyId: selectedBounty.id,
      bountyTitle: selectedBounty.title,
      songTitle: songTitle,
    };
    
    StorageService.addSubmission(submission);
    
    // Reload submissions
    const loadedSubmissions = StorageService.getSubmissions();
    const userSubmissions = loadedSubmissions.filter(s => s.submittedBy === currentUser.username);
    setSubmissions(userSubmissions);
    
    setSongTitle('');
    setShowSubmitForm(false);
    setSelectedBounty(null);
    alert('Song submitted successfully!');
  };

  return (
    <div>
      <section className="card-section">
        <h2>Submit to Open Bounties</h2>
        <div className="card-list">
          {bounties.map(bounty => (
            <div key={bounty.id} className="card">
              <h3>{bounty.title}</h3>
              <p>Prize: ${bounty.bountyPrize}</p>
              <button 
                className="card-btn" 
                onClick={() => {
                  setSelectedBounty(bounty);
                  setShowSubmitForm(true);
                }}
              >
                Submit Song
              </button>
            </div>
          ))}
        </div>
      </section>

      {showSubmitForm && (
        <section className="card-section">
          <div className="card" style={{maxWidth: '500px', margin: '0 auto'}}>
            <h3>Submit to: {selectedBounty.title}</h3>
            <form onSubmit={handleSubmitSong}>
              <label>Song Title:</label>
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
                onClick={() => setShowSubmitForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </section>
      )}

      <section className="card-section">
        <h2>My Submissions</h2>
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
