"use client"; // This directive makes this component a Client Component

import React, { useState } from "react";

import { Team } from "@/types/interfaces";

import { eventData } from "@/app/data/eventDataDay";

import TeamCard from "@/app/components/TeamCard";

const AdminPage = () => {
  const [teams, setTeams] = useState<Team[]>(eventData.teams);

  const handleScoreChange = (id: number, newScore: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, score: newScore } : team
      )
    );
  };

  const handleDeductedScoreChange = (id: number, newDeductedScore: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, deductedScore: newDeductedScore } : team
      )
    );
  };

  return (
    <div className="adminPage">
      <h1 className="adminPageTitle">Admin Page</h1>
      <div className="teamCardsContainer">
        <div className="teamCards">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onScoreChange={handleScoreChange}
              onDeductedScoreChange={handleDeductedScoreChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
