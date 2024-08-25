import React, { useState, useEffect } from "react";
import { TeamCardProps } from "@/types/interfaces";

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onScoreChange,
  onDeductedScoreChange,
}) => {
  const [score, setScore] = useState<number>(team.score);
  const [deductedScore, setDeductedScore] = useState<number>(
    team.deductedScore
  );

  // Sync local state with props
  useEffect(() => {
    setScore(team.score);
    setDeductedScore(team.deductedScore);
  }, [team]);

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseFloat(e.target.value);
    setScore(newScore);
    onScoreChange(team.id, newScore); // Notify parent about score change
  };

  const handleDeductedScoreChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDeductedScore = parseFloat(e.target.value);
    setDeductedScore(newDeductedScore);
    onDeductedScoreChange(team.id, newDeductedScore); // Notify parent about deducted score change
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
