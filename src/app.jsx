import React, { useState, useEffect } from 'react';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './home/home';          
import { PostRFP } from './postrfp/postrfp';    
import { Bounties } from './bounties/bounties'; 
import { Submit } from './submit/submit';    
import { Profile } from './profile/profile';   
import { StorageService } from './services/storageService';



function Header() {
  const { currentUser, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Mock WebSocket - simulate new bounties appearing in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      const newBounty = `New bounty posted: "${StorageService.generateMockBountyTitle()}"`;
      setNotifications(prev => [newBounty, ...prev.slice(0, 4)]);
    }, 15000); // New bounty every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header>
      <div className="user-section">
        {currentUser ? (
          <>
            <span id="username-display">{currentUser.username}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <span id="username-display">Guest User</span>
        )}
      </div>
      <h1>Bounty Hunter</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/post-rfp">Post RFP</NavLink>
        <NavLink to="/bounties">Bounties</NavLink>
        <NavLink to="/submit">Submit</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      
      {/* Real-time notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((notif, idx) => (
            <div key={idx} className="notification">{notif}</div>
          ))}
        </div>
      )}
    </header>
  );
}

function AppContent() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post-rfp" element={<PostRFP />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <div>
          <p>Created by <strong>George Dexter Brunt</strong></p>
          <a href="https://github.com/GDGB680/startup-project" target="_blank" rel="noreferrer">
            🔗 View on GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1>404: Return to sender. Address unknown.</h1>
    </div>
  );
}
