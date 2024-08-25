import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

import Image from "next/image";
import CountUp from "react-countup";

import { Team } from "@/types/interfaces";

// Utility function for delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const TLeaderboardCard: React.FC<{ team: Team }> = ({ team }) => {
  // State for old and new teams
  const [newTeam, setNewTeam] = useState<Team | undefined>(undefined);
  const [oldTeam, setOldTeam] = useState<Team | undefined>(undefined);

  useEffect(() => {
    async function setTeams() {
      // If there has been a change in score
      if (oldTeam && oldTeam.score !== team.score) {
        setNewTeam(team);
        await delay(2100);
        setOldTeam(team);
      } else {
        // If this is the first render or no change in score
        setNewTeam(team);
        setOldTeam(team);
      }
    }
    setTeams();
  }, [team]);

  if (!oldTeam || !newTeam) return null;

  return (
    <>
      {oldTeam && newTeam && (
        <motion.div
          className="tTeamRow"
          animate={{ scale: newTeam.score === oldTeam.score ? 1 : 1.03 }}
        >
          <div className="tRank">{team.rank == 0 ? "-" : team.rank}</div>
          <div className="tLogo">
            <Image src={team.logo} alt="Team Logo" width={40} height={40} />
          </div>
          <div className="tInfoWrapper">
            <span className="tInfoName">{team.chineseName}</span>
            {/* <span className="tInfoScore">
              <CountUp
                duration={2}
                decimals={2}
                start={oldTeam?.score || 0}
                end={newTeam.score}
              />
            </span>
            <span className="tInfoDeductedScore">
              <CountUp
                duration={2}
                decimals={2}
                prefix="(-"
                suffix=")"
                start={oldTeam?.deductedScore || 0}
                end={newTeam.deductedScore}
              />
            </span> */}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default memo(TLeaderboardCard);
