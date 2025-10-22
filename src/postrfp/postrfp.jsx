import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storageService';
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

  const genreOptions = ['Techno', 'Pop', 'Lo-fi', 'Chill', 'Orchestra', 'Cinematic'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please login to post a bounty');
      navigate('/');
      return;
    }

    const bounty = {
      ...formData,
      bountyPrize: Number(formData.bountyPrize)
    };
    
    StorageService.addBounty(bounty);
    alert('Bounty posted successfully!');
    navigate('/bounties');
  };

  const handleGenreChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({...formData, genres: selected});
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <section className="card-section post-rfq-section">
        <h2>Submit a Request for Proposal</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Bounty Title:</label>
          <input 
            type="text" 
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Epic Orchestra for Film"
          />

          <label htmlFor="genres">Desired Genres:</label>
          <select 
            id="genres" 
            name="genres"
            multiple 
            required
            onChange={handleGenreChange}
          >
            {genreOptions.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple</small>

          <label htmlFor="bountyPrize">Bounty Prize ($):</label>
          <input 
            type="number" 
            id="bountyPrize"
            name="bountyPrize"
            min="1"
            value={formData.bountyPrize}
            onChange={handleChange}
            required
          />

          <label htmlFor="duration">Time Duration (e.g., 60 sec):</label>
          <input 
            type="text" 
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g., 30s, 1min, 2:30"
          />

          <label htmlFor="deadline">Deadline:</label>
          <input 
            type="date" 
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />

          <label htmlFor="details">Details:</label>
          <textarea 
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Describe what you're looking for..."
          />

          <button type="submit" className="card-btn">Post Bounty</button>
        </form>
      </section>
    </div>
  );
}
