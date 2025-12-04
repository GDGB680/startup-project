import React, { useState, useEffect } from 'react';
import { websocketService } from '../services/websocketService';


export function LiveFeed() {


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



}