import React from 'react';

export function Profile() {
  return (
  <main>


    <section className="card-section profile-section">

      <div className="card profile-card">

        <img src="https://via.placeholder.com/100x100" alt="User Avatar" className="profile-img"></img>


        <h2>Name goes here</h2>


        <p className="profile-bio">bio goes here</p>


        <div className="profile-stats">
          <div><span>Bounties Won</span></div>
          <div><span>Bounties Entered</span></div>
          <div><span>Followers</span></div>
        </div>


        <div className="profile-tags">
          <span className="tag genre-tag">Techno</span>
          <span className="tag genre-tag">Orchestra</span>
          <span className="tag genre-tag">Chill</span>
        </div>


        <button className="card-btn profile-btn">Edit Profile</button>

      </div>

    </section>





    <section className="card-section">
      <h2>Bounties You've Submitted To</h2>
      <div className="card-list">
          {/* <!-- <div class="card">
              <h3>Lo-fi Chill Loop</h3>
              <span class="tag status-pending">Pending</span>
              <p>Submitted: Sep 23</p>
              <button class="card-btn">View Details</button>
          </div> --> */}
      </div>
    </section>

    <section className="card-section">
      <h2>Bounties You've Posted</h2>
      <div className="card-list">
          {/* <!-- <div class="card">
              <h3>Epic Orchestra</h3>
              <p>Budget: $50 | Deadline: 7d</p>
              <button class="card-btn">View Details</button>
          </div> --> */}
      </div>
    </section>


    <section className="card-section">
      <h2>Bounties You're Following</h2>
      <div className="card-list">
          {/* <!-- <div class="card">
              <h3>Inspirational Techno Pop</h3>
              <p>Budget: $30 | Deadline: 3d</p>
              <button class="card-btn">View Details</button>
          </div> --> */}
      </div>
    </section>



  </main>
  );
}