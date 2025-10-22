import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './home/home';
import { PostRFP } from './postrfp/postrfp';
import { Bounties } from './bounties/bounties';
import { Submit } from './submit/submit';
import { Profile } from './profile/profile';

function Header() {
  const { currentUser, logout } = useAuth();

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
    </header>
  );
}

function AppContent() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/post-rfp" element={<PostRFP />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <a href="https://github.com/GDGB680/startup-project" target="_blank" rel="noreferrer">
          GitHub
        </a>
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
  return <div className="container text-center mt-5">404: Return to sender. Address unknown.</div>;
}