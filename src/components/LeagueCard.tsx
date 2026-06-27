import { useCallback } from "react";
import type { League } from "../types";

interface LeagueCardProps {
  league: League;
  onClick: (league: League) => void;
}

function LeagueCard({ league, onClick }: LeagueCardProps) {
  const handleClick = useCallback(() => {
    onClick(league);
  }, [league, onClick]);

  return (
    <button
      type="button"
      className="league-card"
      onClick={handleClick}
      aria-label={`Open season badge for ${league.strLeague ?? "league"}`}
    >
      <h3>{league.strLeague || "Unknown League"}</h3>
      <p>
        <strong>Sport:</strong> {league.strSport || "N/A"}
      </p>
      <p>
        <strong>Alternate:</strong> {league.strLeagueAlternate || "N/A"}
      </p>
    </button>
  );
}

export default LeagueCard;
