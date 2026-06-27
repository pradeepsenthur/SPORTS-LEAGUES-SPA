import { memo } from "react";
import LeagueCard from "./LeagueCard";
import type { League } from "../types";

interface LeagueListProps {
  leagues: League[];
  onLeagueClick: (league: League) => void;
}

function LeagueList({ leagues, onLeagueClick }: LeagueListProps) {
  if (!leagues.length) {
    return (
      <p className="empty-state">No leagues found for the current filters.</p>
    );
  }

  return (
    <section className="league-grid" aria-live="polite">
      {leagues.map((league) => (
        <LeagueCard
          key={league.idLeague}
          league={league}
          onClick={onLeagueClick}
        />
      ))}
    </section>
  );
}

export default memo(LeagueList);
