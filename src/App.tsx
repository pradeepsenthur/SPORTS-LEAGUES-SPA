import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import LeagueList from "./components/LeagueList";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import SeasonBadgeModal from "./components/SeasonBadgeModal";
import Spinner from "./components/Spinner";
import SportFilter from "./components/SportFilter";
import type { League, SeasonBadgeData } from "./types";
import { fetchSeasonBadge } from "./services/api";
import { useLeagues } from "./hooks/useLeagues";

function App() {
  const {
    leagues,
    loading,
    error,
    searchTerm,
    sportFilter,
    sports,
    currentPage,
    totalPages,
    totalResults,
    setSearchTerm,
    setSportFilter,
    setCurrentPage,
  } = useLeagues(20);

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [badgeLoading, setBadgeLoading] = useState(false);
  const [badgeError, setBadgeError] = useState("");
  const [badgeData, setBadgeData] = useState<SeasonBadgeData | null>(null);
  const leaguesScrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    leaguesScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [currentPage]);

  const handleLeagueClick = useCallback(async (league: League) => {
    setSelectedLeague(league);
    setBadgeData(null);
    setBadgeError("");
    setBadgeLoading(true);

    try {
      const data = await fetchSeasonBadge(league.idLeague);
      setBadgeData(data);
    } catch (err) {
      setBadgeError(
        err instanceof Error ? err.message : "Unable to load season badge.",
      );
    } finally {
      setBadgeLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedLeague(null);
    setBadgeData(null);
    setBadgeError("");
    setBadgeLoading(false);
  }, []);

  return (
    <main className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <section className="app-top">
        <Header />

        <section className="controls">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <SportFilter
            value={sportFilter}
            options={sports}
            onChange={setSportFilter}
          />
        </section>

        <section className="results-meta">
          <p>
            Showing <strong>{leagues.length}</strong> leagues
            {searchTerm || sportFilter !== "All" ? (
              <>
                {" "}
                after filters ({totalResults} match
                {totalResults === 1 ? "" : "es"})
              </>
            ) : null}
          </p>
        </section>
      </section>

      <section
        id="main-content"
        className="leagues-scroll-region"
        ref={leaguesScrollRef}
      >
        {loading ? <Spinner label="Loading leagues..." /> : null}
        {error ? (
          <p className="error-text" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
          <>
            <LeagueList leagues={leagues} onLeagueClick={handleLeagueClick} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : null}
      </section>

      <SeasonBadgeModal
        isOpen={Boolean(selectedLeague)}
        league={selectedLeague}
        loading={badgeLoading}
        error={badgeError}
        badgeData={badgeData}
        onClose={closeModal}
      />
    </main>
  );
}

export default App;
