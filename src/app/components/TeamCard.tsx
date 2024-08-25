import React, { useState } from "react";
import { Team } from "@/types/interfaces";

interface TeamCardProps {
  team: Team;
  onScoreChange: (id: number, newScore: number) => void;
  onDeductedScoreChange: (id: number, newDeductedScore: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onScoreChange,
  onDeductedScoreChange,
}) => {
  const [score, setScore] = useState<number>(team.score);
  const [deductedScore, setDeductedScore] = useState<number>(
    team.deductedScore
  );

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseFloat(e.target.value);
    setScore(newScore);
    onScoreChange(team.id, newScore);
  };

  const handleDeductedScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDeductedScore = parseFloat(e.target.value);
    setDeductedScore(newDeductedScore);
    onDeductedScoreChange(team.id, newDeductedScore);
  };

  return (
    <div className="teamCard">
      <div className="teamHeader">
        <img src={team.logo} alt={team.chineseName} className="teamLogo" />
        <div className="teamInfo">
          <h2 className="teamMainName">{team.chineseName}</h2>
          <h3 className="teamSubName">{team.englishName}</h3>
        </div>
      </div>
      <div className="teamScores">
        <div className="scoreField">
          <label>
            Score:
            <input
              type="number"
              step="0.01"
              value={score.toFixed(2)}
              onChange={handleScoreChange}
            />
          </label>
        </div>
        <div className="scoreField">
          <label>
            Deducted Score:
            <input
              type="number"
              step="0.01"
              value={deductedScore.toFixed(2)}
              onChange={handleDeductedScoreChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
