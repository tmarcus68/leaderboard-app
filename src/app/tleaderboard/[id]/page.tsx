"use client"; // This directive makes this component a Client Component

import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { useParams } from "next/navigation";

import TLeaderboardCard from "../../components/TLeaderboardCard";
import { Team } from "@/types/interfaces";

const TimingTower = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventShortTitle, setEventShortTitle] = useState<string>("");
  const [eventShortSubTitle, setEventShortSubTitle] = useState<string>("");

  const { id } = useParams(); // Get the event ID from the route params

  // Function to sort an array of objects based on score, deductedScore, and ID
  const sortTeams = (teams: Team[]) => {
    return [...teams].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Sort by score descending
      } else if (b.deductedScore !== a.deductedScore) {
        return a.deductedScore - b.deductedScore; // Sort by deductedScore ascending
      } else {
        return a.id - b.id; // Sort by id ascending
      }
    });
  };

  const fetchEventData = async () => {
    try {
      const response = await fetch(`/api/event/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();
      const sortedTeams = sortTeams(data.teams) || [];
      setTeams(sortedTeams);
      setEventShortTitle(data.eventShortTitle || "");
      setEventShortSubTitle(data.eventShortSubTitle || "");
    } catch (error) {
      setError((error as Error).message); // Handle and store error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchEventData(); // Initial fetch

    // Polling interval to fetch data every 5 seconds (5000 ms)
    const intervalId = setInterval(fetchEventData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="center">Error: {error}</p>;

  return (
    <div className="timingTower">
      <div className="tHeader">
        <span className="tTitle">{eventShortTitle}</span>
        <span className="tSubtitle">{eventShortSubTitle}</span>
      </div>

      <Reorder.Group
        as="div"
        className="tTeamRows"
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
            <TLeaderboardCard team={team} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default TimingTower;
