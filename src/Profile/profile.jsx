import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    fetchStats();
  }, [currentUser, navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser.email}/profile`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading profile...</div>;
  }

  return (
    <div>
      <section className="card-section profile-section">
        <div className="card profile-card">
          <h2>{currentUser.email}</h2>
          <p className="profile-role">Composer & Producer</p>
          <p className="profile-bio">
            Passionate about creating custom tracks for various projects.
          </p>
          
          <div className="profile-stats">
            <div>
              <span>{stats.bountiesWon || 0}</span><br />
              Bounties Won
            </div>
            <div>
              <span>{stats.bountiesEntered || 0}</span><br />
              Bounties Entered
            </div>
            <div>
              <span>{stats.bountiesPosted || 0}</span><br />
              Bounties Posted
            </div>
          </div>
          
          <button 
            onClick={fetchStats}
            style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
          >
            Refresh Stats
          </button>
        </div>
      </section>
    </div>
  );
}
