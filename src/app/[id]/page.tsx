"use client"; // This directive makes this component a Client Component

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams
import { Team } from "@/types/interfaces";
import TeamCard from "@/app/components/TeamCard";

const AdminPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams(); // Get the event ID from params

  useEffect(() => {
    if (!id) return;

    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/event/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data.teams || []);
      } catch (error) {
        setError((error as Error).message); // Type assertion for error
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [id]);

  const handleScoreChange = async (teamId: number, newScore: number) => {
    const updatedTeams = teams.map((team) =>
      team.id === teamId ? { ...team, score: newScore } : team
    );
    setTeams(updatedTeams);

    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teams: updatedTeams }),
      });
      if (!response.ok) {
        throw new Error("Failed to update score");
      }
    } catch (error) {
      setError((error as Error).message); // Type assertion for error
    }
  };

  const handleDeductedScoreChange = async (
    teamId: number,
    newDeductedScore: number
  ) => {
    const updatedTeams = teams.map((team) =>
      team.id === teamId ? { ...team, deductedScore: newDeductedScore } : team
    );
    setTeams(updatedTeams);

    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teams: updatedTeams }),
      });
      if (!response.ok) {
        throw new Error("Failed to update deducted score");
      }
    } catch (error) {
      setError((error as Error).message); // Type assertion for error
    }
  };

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="center">Error: {error}</p>;

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
