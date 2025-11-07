import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PostRFP() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    genres: [],
    bountyPrize: '',
    duration: '',
    deadline: '',
    details: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const genreOptions = ['Techno', 'Pop', 'Lo-fi', 'Chill', 'Orchestra', 'Cinematic'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!currentUser) {
      setError('Please login to post a bounty');
      navigate('/');
      return;
    }

    try {
      const response = await fetch('/api/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Bounty posted successfully!');
        navigate('/bounties');
      } else {
        const error = await response.json();
        setError(error.msg || 'Failed to create bounty');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleGenreChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({...formData, genres: selected});
  };

  return (
    <div>
      <section className="card-section post-rfq-section">
        <h2>Submit a Request for Proposal</h2>
        {error && <div style={{color: '#dc3545', marginBottom: '1rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Bounty Title:</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Epic Orchestra for Film"
          />

          <label>Desired Genres:</label>
          <select 
            name="genres"
            multiple 
            required
            onChange={handleGenreChange}
          >
            {genreOptions.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <label>Bounty Prize ($):</label>
          <input 
            type="number" 
            name="bountyPrize"
            min="1"
            value={formData.bountyPrize}
            onChange={handleChange}
            required
          />

          <label>Time Duration:</label>
          <input 
            type="text" 
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 30s, 1min"
          />

          <label>Deadline:</label>
          <input 
            type="date" 
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />

          <label>Details:</label>
          <textarea 
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe what you're looking for..."
          />

          <button type="submit" className="card-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post Bounty'}
          </button>
        </form>
      </section>
    </div>
  );
}