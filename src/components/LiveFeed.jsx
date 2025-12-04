import React, { useState, useEffect } from 'react';
import { websocketService } from '../services/websocketService';

export function LiveFeed() {
  const [events, setEvents] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Listen for bounty posts
    websocketService.on('bounty_posted', (message) => {
      addEvent({
        type: 'bounty',
        title: message.bounty.title,
        user: message.postedBy,
        timestamp: new Date(message.timestamp)
      });
    });

    // Listen for submissions
    websocketService.on('submission_created', (message) => {
      addEvent({
        type: 'submission',
        title: message.submission.songTitle,
        user: message.submittedBy,
        timestamp: new Date(message.timestamp)
      });
    });

    // Listen for user joins/leaves
    websocketService.on('user_joined', (message) => {
      setActiveUsers(message.activeUsers);
      addEvent({
        type: 'user_join',
        user: message.userId,
        timestamp: new Date(message.timestamp)
      });
    });

    websocketService.on('user_left', (message) => {
      setActiveUsers(message.activeUsers);
      addEvent({
        type: 'user_leave',
        user: message.userId,
        timestamp: new Date(message.timestamp)
      });
    });

    return () => {
      websocketService.off('bounty_posted', null);
      websocketService.off('submission_created', null);
      websocketService.off('user_joined', null);
      websocketService.off('user_left', null);
    };
  }, []);

  const addEvent = (event) => {
    setEvents(prev => [event, ...prev].slice(0, 10)); // Keep last 10 events
  };

  return (
    <div style={{
      background: '#4a4e69',
      padding: '1.5rem',
      borderRadius: '8px',
      margin: '2rem 0',
      border: '2px solid #c9ada7'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h3>📡 Live Activity</h3>
        <span style={{color: '#9a8c98'}}>👥 {activeUsers} active</span>
      </div>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '6px',
        padding: '1rem'
      }}>
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} style={{
              padding: '0.5rem',
              marginBottom: '0.5rem',
              borderLeft: '3px solid #c9ada7',
              paddingLeft: '0.75rem',
              fontSize: '0.9rem',
              color: '#f2e9e4'
            }}>
              {event.type === 'bounty' && (
                <span><strong>{event.user}</strong> posted bounty: <em>{event.title}</em></span>
              )}
              {event.type === 'submission' && (
                <span><strong>{event.user}</strong> submitted: <em>{event.title}</em></span>
              )}
              {event.type === 'user_join' && (
                <span><strong>{event.user}</strong> joined</span>
              )}
              {event.type === 'user_leave' && (
                <span><strong>{event.user}</strong> left</span>
              )}
              <br />
              <small style={{color: '#9a8c98'}}>
                {event.timestamp.toLocaleTimeString()}
              </small>
            </div>
          ))
        ) : (
          <p style={{color: '#9a8c98', textAlign: 'center'}}>Waiting for activity...</p>
        )}
      </div>
    </div>
  );
}
