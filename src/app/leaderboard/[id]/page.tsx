"use client"; // This directive makes this component a Client Component

import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { useParams } from "next/navigation";

import LeaderboardCard from "../../components/LeaderboardCard";
import { Team } from "@/types/interfaces";

const Leaderboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventSubtitle, setEventSubtitle] = useState<string>("");

  const { id } = useParams(); // Get the event ID from the route params

  useEffect(() => {
    if (!id) return;

    const fetchEventData = async () => {
      try {
        const response = await fetch(`/api/event/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }
        const data = await response.json();
        setTeams(data.teams || []);
        setEventTitle(data.eventTitle || "");
        setEventSubtitle(data.eventSubtitle || "");
      } catch (error) {
        setError((error as Error).message); // Handle and store error
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="center">Error: {error}</p>;

  return (
    <div className="leaderboardContainer">
      <div className="leaderboard">
        <div className="header">
          <span className="title">{eventTitle}</span>
          <span className="subtitle">{eventSubtitle}</span>
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
