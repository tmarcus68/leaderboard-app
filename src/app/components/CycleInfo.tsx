import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { CycleInfoProps } from "@/types/interfaces";

const CycleInfo: React.FC<CycleInfoProps> = ({ team, oldTeam, newTeam }) => {
  const [view, setView] = useState<"chineseName" | "score" | "deductedScore">(
    "chineseName"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setView((prevView) => {
        if (prevView === "chineseName") return "score";
        if (prevView === "score") return "deductedScore";
        return "chineseName";
      });
    }, 30000); // Cycle every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (view) {
      case "chineseName":
        return <span className="tInfoName">{team.chineseName}</span>;
      case "score":
        if (
          newTeam.deductedScore == 9.99 ||
          newTeam.deductedScore == 9.989999999999995
        ) {
          return <span className="tInfoScore">棄權</span>;
        } else {
          return (
            <span className="tInfoScore">
              最后得分：
              <CountUp
                key={`score-${newTeam.score}`} // Unique key for score
                duration={2}
                decimals={2}
                start={oldTeam?.score || 0}
                end={newTeam.score}
              />
            </span>
          );
        }

      case "deductedScore":
        if (
          newTeam.deductedScore == 9.99 ||
          newTeam.deductedScore == 9.989999999999995
        ) {
          return (
            <span className="tInfoDeductedScore">
              扣分：
              <CountUp
                key={`deductedScore-${newTeam.deductedScore}`} // Unique key for deductedScore
                duration={2}
                decimals={2}
                prefix="(-"
                suffix=")"
                start={oldTeam?.deductedScore || 0}
                end={0}
              />
            </span>
          );
        } else {
          return (
            <span className="tInfoDeductedScore">
              扣分：
              <CountUp
                key={`deductedScore-${newTeam.deductedScore}`} // Unique key for deductedScore
                duration={2}
                decimals={2}
                prefix="(-"
                suffix=")"
                start={oldTeam?.deductedScore || 0}
                end={newTeam.deductedScore}
              />
            </span>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="tInfoWrapper">
      <AnimatePresence>
        <motion.div
          key={view}
          initial={{ opacity: 0, position: "absolute" }} // Position absolute to overlay
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }} // Shorter duration for smoother transition
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CycleInfo;
