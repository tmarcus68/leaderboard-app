"use client"; // This directive makes this component a Client Component

import { useParams } from "next/navigation";

import React, { useState, useEffect } from "react";

import { Team } from "@/types/interfaces";

import TeamCard from "@/app/components/TeamCard";

const AdminPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [eventShortTitle, setEventShortTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { id } = useParams(); // Get the event ID from params

  useEffect(() => {
    if (!id) return;
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/event/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch admin page");
        }
        const data = await response.json();
        setEventShortTitle(data.eventShortTitle);
        setTeams(data.teams || []);
      } catch (error) {
        setError((error as Error).message); // Type assertion for error
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [id]);

  const handleScoreChange = (teamId: number, newScore: number) => {
    const updatedTeams = teams.map((team) =>
      team.id === teamId ? { ...team, score: newScore } : team
    );
    setTeams(updatedTeams);
    setHasChanges(true); // Set flag when there are changes
  };

  const handleDeductedScoreChange = (
    teamId: number,
    newDeductedScore: number
  ) => {
    const updatedTeams = teams.map((team) =>
      team.id === teamId ? { ...team, deductedScore: newDeductedScore } : team
    );
    setTeams(updatedTeams);
    setHasChanges(true); // Set flag when there are changes
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/event/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teams }),
      });
      if (!response.ok) {
        throw new Error("Failed to update teams");
      }
      setHasChanges(false); // Reset changes flag after successful update
    } catch (error) {
      setError((error as Error).message); // Type assertion for error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="center">Error: {error}</p>;

  return (
    <div className="adminPage">
      <h1 className="adminPageTitle">Admin Page - {eventShortTitle}</h1>
      <button
        className="updateButton"
        onClick={handleUpdate}
        disabled={!hasChanges || loading}
      >
        Update
      </button>
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
