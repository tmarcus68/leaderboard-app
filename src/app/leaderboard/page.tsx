"use client"; // This directive makes this component a Client Component

import React, { useState } from "react";
import { Reorder } from "framer-motion";

import LeaderboardCard from "../components/LeaderboardCard";

import { Team } from "@/types/interfaces";

import { eventData } from "@/app/data/eventDataDay1";

const Leaderboard = () => {
  const [teams, setTeams] = useState<Team[]>(eventData.teams);

  return (
    <div className="leaderboardContainer">
      <div className="leaderboard">
        <div className="header">
          <span className="title">{eventData.eventTitle}</span>
          <span className="subtitle">{eventData.eventSubtitle}</span>
        </div>
        <Reorder.Group
          as="div"
          className="teamRows"
          axis="y"
          values={teams}
          onReorder={setTeams}
        >
          {teams.map((team) => (
            <Reorder.Item
              as="div"
              key={team.id}
              dragListener={false}
              draggable={false}
              value={team}
            >
              <LeaderboardCard team={team} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Leaderboard;
