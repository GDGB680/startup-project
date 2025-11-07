import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function Bounties() {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bounties', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setBounties(data);
      } else {
        setError('Failed to load bounties');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '2rem'}}>Loading bounties...</div>;
  }

  const myBounties = bounties.filter(b => b.postedBy === currentUser?.email);
  const otherBounties = bounties.filter(b => b.postedBy !== currentUser?.email);

  const BountyCard = ({ bounty }) => (
    <div className="card">
      <h3>{bounty.title}</h3>
      <div className="card-tags">
        {bounty.genres?.map((genre, index) => (
          <span key={index} className="tag">{genre}</span>
        ))}
      </div>
      <p><strong>Budget:</strong> ${bounty.bountyPrize} | <strong>Duration:</strong> {bounty.duration}</p>
      <p><strong>Deadline:</strong> {new Date(bounty.deadline).toLocaleDateString()}</p>
      <p>{bounty.details}</p>
      <small>Posted by: {bounty.postedBy}</small>
      <button className="card-btn">View Details</button>
    </div>
  );

  return (
    <div>
      {error && <div style={{color: '#dc3545', margin: '1rem'}}>{error}</div>}

      {currentUser && myBounties.length > 0 && (
        <section className="card-section">
          <h2>Your Posted Bounties</h2>
          <div className="card-list">
            {myBounties.map(bounty => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        </section>
      )}

      <section className="card-section">
        <h2>Open Bounties</h2>
        <div className="card-list">
          {otherBounties.length > 0 ? (
            otherBounties.map(bounty => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))
          ) : (
            <p style={{textAlign: 'center', color: '#c9ada7'}}>
              No bounties available. Be the first to post one!
            </p>
          )}
        </div>
      </section>

      <button 
        onClick={fetchBounties}
        style={{display: 'block', margin: '2rem auto', padding: '0.5rem 1rem'}}
      >
        Refresh
      </button>
    </div>
  );
}
