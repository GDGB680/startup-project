import React from 'react';

export function PostRFP() {
  return (
  <main>

    <section className="intro">
      <h2>Submit a Request for Proposal</h2>
      {/* <!-- <p>Request custom music, run contests, and discover hidden talent.</p> --> */}
    </section>

    <section className="card-section post-rfq-section">
      {/* <!-- <h2>Submit a Request for Proposal</h2> --> */}
      <form id="rfqForm">

        <label for="genres">Desired Genre:</label>
        <select id="genres" name="genres" multiple required>
          <option value="Techno">Techno</option>
          <option value="Pop">Pop</option>
          <option value="Lo-fi">Lo-fi</option>
          <option value="Chill">Chill</option>
          <option value="Orchestra">Orchestra</option>
          <option value="Cinematic">Cinematic</option>
        </select>
        {/* <!-- <small>(Hold Ctrl/Cmd to select multiples)</small> --> */}
        <br /><br />

        <label for="bountyPrize">Bounty Prize:</label>
        <input type="number" id="bounty" name="bounty" min="10" required /><br /><br />

        <label for="time">Time Duration (e.g., 60 sec)</label>
        <input type="text" id="time" name="time" required /><br /><br />

        <label for="deadline">Deadline:</label>
        <input type="date" id="deadline" name="deadline" required /><br /><br />

        <label for="details">Details:</label>
        <input type="text" id="details" name="details" required /><br /><br />

        <button type="submit" className="card-btn">Post Bounty</button>
      </form>
    </section>

  </main>
  );
}