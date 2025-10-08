import React from 'react';

export function Bounties() {
  return (
    <main>

        <section className="intro">
            <h2>Open Bounties</h2>
            {/* <!-- <p>Request custom music, run contests, and discover hidden talent.</p> --> */}
        </section>

        <section className="bounty-board">
              <div className="card-container" id="cardContainer"></div>
                <div className="card">
                    <h3>Epic Orchestra</h3>
                    <p>Budget: $50 | Deadline: 7d</p>
                    {/* <!-- <button class="card-btn">View Details</button> --> */}
                </div>
                {/* <!-- <div class="card">
                    <h3>Lo-fi Chill Loop</h3>
                    <span class="tag status-pending">Pending</span>
                    <p>Submitted: Sep 23</p>
                    <button class="card-btn">View Details</button>
                </div> --> */}
                 <div className="card">
                    <h3>Inspirational Techno Pop</h3>
                    <p>Budget: $30 | Deadline: 3d</p>
                    {/* <!-- <button class="card-btn">View Details</button> --> */}
                </div>
        </section>

    </main>
  );
}