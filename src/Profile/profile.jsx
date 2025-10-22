import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    bountiesWon: 0,
    bountiesEntered: 0,
    bountiesPosted: 0
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Calculate stats
    const submissions = StorageService.getSubmissions();
    const bounties = StorageService.getBounties();
    
    const userSubmissions = submissions.filter(s => s.submittedBy === currentUser.username);
    const wonSubmissions = userSubmissions.filter(s => s.status === 'Winner');
    const userBounties = bounties.filter(b => b.postedBy === currentUser.username);

    setStats({
      bountiesWon: wonSubmissions.length,
      bountiesEntered: userSubmissions.length,
      bountiesPosted: userBounties.length
    });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div>
      <section className="card-section profile-section">
        <div className="card profile-card">
          <h2>{currentUser.username}</h2>
          <p className="profile-role">Composer & Producer</p>
          <p className="profile-bio">
            Passionate about creating custom tracks for various projects. 
            Always up for a creative challenge!
          </p>
          
          <div className="profile-stats">
            <div>
              <span>{stats.bountiesWon}</span><br />
              Bounties Won
            </div>
            <div>
              <span>{stats.bountiesEntered}</span><br />
              Bounties Entered
            </div>
            <div>
              <span>{stats.bountiesPosted}</span><br />
              Bounties Posted
            </div>
          </div>
          
          <div className="profile-tags">
            <span className="tag genre-tag">Techno</span>
            <span className="tag genre-tag">Orchestra</span>
            <span className="tag genre-tag">Chill</span>
          </div>
        </div>
      </section>
    </div>
  );
}
