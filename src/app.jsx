import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { PostRFP } from './postrfp/postrfp';
import { Bounties } from './bounties/bounties';
import { Submit } from './submit/submit';
import { Profile } from './profile/profile';


export default function App() {
  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark">
            <div className="navbar-brand">
              Bounty Hunter<sup>&reg;</sup>
            </div>
            <menu className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="PostRFQ">
                  PostRFQ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="Bounties">
                  Bounties
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="Submit">
                  Submit
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="Profile">
                  Profile
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/postrfq' element={<PostRFP />} />
          <Route path='/bounties' element={<Bounties />} />
          <Route path='/submit' element={<Submit />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <span className="text-reset">George Dexter Brunt</span>
            <a className="text-reset" href="https://github.com/GDGB680/startup-project">
              Github
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}


function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}