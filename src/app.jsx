import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { About } from './about/about';
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
                <a className="nav-link" href="index.html">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="PostRFQ.html">
                  PostRFQ
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Bounties.html">
                  Bounties
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Submit.html">
                  Submit
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="Profile.html">
                  Profile
                </a>
              </li>
            </menu>
          </nav>
        </header>

        <main>App components go here</main>

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