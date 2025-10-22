import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';

export function Bounties() {
  const [bounties, setBounties] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load bounties from localStorage
    const loadBounties = () => {
      const loadedBounties = StorageService.getBounties();
      setBounties(loadedBounties);
    };

    loadBounties();

    // Refresh bounties every 5 seconds (simulate real-time updates)
    const interval = setInterval(loadBounties, 5000);
    return () => clearInterval(interval);
  }, []);

  const myPostedBounties = bounties.filter(b => b.postedBy === currentUser?.username);
  const otherBounties = bounties.filter(b => b.postedBy !== currentUser?.username);

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
      <p><em>{bounty.details}</em></p>
      <small>📌 Posted by: {bounty.postedBy}</small>
      <button className="card-btn">View Details</button>
    </div>
  );

  return (
    <div>
      {currentUser && myPostedBounties.length > 0 && (
        <section className="card-section">
          <h2>🏆 Your Posted Bounties</h2>
          <div className="card-list">
            {myPostedBounties.map(bounty => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        </section>
      )}

      <section className="card-section">
        <h2>📢 Open Bounties</h2>
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

      <section style={{textAlign: 'center', margin: '2rem 0', color: '#9a8c98'}}>
        <small>Last updated: {new Date().toLocaleTimeString()}</small>
      </section>
    </div>
  );
}
