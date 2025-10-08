import React from 'react';

export function Home() {
  return (
    <main>
        <section className="intro">
            <h2>Find Your Soundtrack</h2>
            <p>Request custom music, run contests, and discover hidden talent.</p>
        </section>

        <a href="Profile.html">
            <button className="card-btn-big">Login</button>
        </a>
        <a href="Bounties.html">
            <button className="card-btn-big">View Bounties</button>
        </a>
        <a href="Profile.html">
            <button className="card-btn-big">Subit songs</button>
        </a>
        <a href="https://github.com/GDGB680/startup-project/tree/main#" target="_blank">
            <button className="card-btn-big">github</button>
        </a>

        <section className="intro">
            <h2>George Dexter Brunt</h2>
        </section>

    </main>
  );
}