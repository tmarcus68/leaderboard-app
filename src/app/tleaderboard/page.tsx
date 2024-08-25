"use client"; // This directive makes this component a Client Component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { eventData } from "@/app/data/eventDataDay1";

export interface Team {
  id: number;
  rank: number;
  logo: string;
  chineseName: string;
  englishName: string;
  score: number;
  deductedScore: number;
}

const TimingTower = () => {
  const formatNumber = (number: number) => number.toFixed(2);

  return (
    <div className="timingTower">
      <div className="tHeader">
        <span className="tTitle">{eventData.eventShortTitle}</span>
        <span className="tSubtitle">{eventData.eventShortSubTitle}</span>
      </div>
      {eventData.teams.map((team) => (
        <div key={team.id} className="tTeamRow">
          <div className="tRank">{team.rank}</div>
          <div className="tLogo">
            <Image src={team.logo} alt="Team Logo" width={40} height={40} />
          </div>
          <div className="tInfoWrapper">
            <span className="tInfo">{team.chineseName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimingTower;
