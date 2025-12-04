import React, { createContext, useState, useContext, useEffect } from 'react';
import { websocketService } from '../services/websocketService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        // Connect WebSocket when user logs in
        await websocketService.connect(user.email);
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        // Connect WebSocket on login
        await websocketService.connect(user.email);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.msg };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        // Connect WebSocket on signup
        await websocketService.connect(user.email);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.msg };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'include'
      });
      websocketService.disconnect();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
