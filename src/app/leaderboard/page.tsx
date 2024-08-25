import React from "react";
import CountryFlagWidget from "@/app/components/CountryFlagWidget";
import Image from "next/image";

import { eventData } from "@/app/data/eventDataDay1";

const Leaderboard = () => {
  const formatNumber = (number: number) => number.toFixed(2);

  return (
    <div className="leaderboard">
      <div className="header">
        <span className="title">{eventData.eventTitle}</span>
        <span className="subtitle">{eventData.eventSubtitle}</span>
      </div>
      <div className="teamRows">
        {eventData.teams.map((team) => (
          <div key={team.id} className="teamRow">
            <div className="rank">{team.rank}</div>
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
            <div className="score">{formatNumber(team.score)}</div>
            <div className="deductedScore">
              (-{formatNumber(team.deductedScore)})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
