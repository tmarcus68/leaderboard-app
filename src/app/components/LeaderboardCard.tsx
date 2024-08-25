import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

import CountryFlagWidget from "@/app/components/CountryFlagWidget";
import Image from "next/image";
import CountUp from "react-countup";

import { Team } from "@/types/interfaces";

// Utility function to format numbers
const formatNumber = (num: number) => num.toLocaleString();

// Utility function for delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const LeaderboardCard: React.FC<{ team: Team }> = ({ team }) => {
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
    <motion.div
      className="teamRow"
      animate={{ scale: newTeam.score === oldTeam.score ? 1 : 1.03 }}
    >
      <div className="rank">{team.rank == 0 ? "-" : team.rank}</div>
      <div className="country">
        <CountryFlagWidget countryCode={team.country} />
      </div>
      <div className="logo">
        <Image src={team.logo} alt="Team Logo" width={50} height={50} />
      </div>
      <div className="name">
        <span className="chineseName">{team.chineseName}</span>
        <span className="englishName">{team.englishName}</span>
      </div>
      <div className="score">
        <CountUp
          duration={2}
          decimals={2}
          start={oldTeam?.score || 0}
          end={newTeam.score}
        />
      </div>
      <div className="deductedScore">
        <CountUp
          duration={2}
          decimals={2}
          prefix="(-"
          suffix=")"
          start={oldTeam?.deductedScore || 0}
          end={newTeam.deductedScore}
        />
      </div>
    </motion.div>
  );
};

export default memo(LeaderboardCard);
