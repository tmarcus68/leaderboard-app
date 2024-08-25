"use client"; // This directive makes this component a Client Component

import React, { useState } from "react";

const AdminPage = () => {
  const [teamId, setTeamId] = useState<number | null>(null);
  const [newScore, setNewScore] = useState<number>(0);

  const updateScore = () => {
    // Logic to update score for the team
  };

  return (
    <div className="adminPage">
      <h1>Admin Page</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateScore();
        }}
      >
        <div>
          <label htmlFor="teamId">Team ID:</label>
          <input
            type="number"
            id="teamId"
            value={teamId ?? ""}
            onChange={(e) => setTeamId(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="newScore">New Score:</label>
          <input
            type="number"
            id="newScore"
            value={newScore}
            onChange={(e) => setNewScore(Number(e.target.value))}
          />
        </div>
        <button type="submit">Update Score</button>
      </form>
    </div>
  );
};

export default AdminPage;
