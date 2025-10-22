import React, { createContext, useState, useContext, useEffect } from 'react';
import { StorageService } from '../services/storageService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const user = StorageService.getCurrentUser();
    setCurrentUser(user);
    
    // Initialize mock data
    StorageService.initializeMockData();
  }, []);

  const login = (username) => {
    const user = { username, loginDate: new Date().toISOString() };
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    StorageService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}