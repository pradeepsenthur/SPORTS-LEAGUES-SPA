import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllLeagues } from "../services/api";
import { getCachedValue } from "../services/cache";
import type { League } from "../types";

interface UseLeaguesResult {
  leagues: League[];
  loading: boolean;
  error: string;
  searchTerm: string;
  sportFilter: string;
  sports: string[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  setSearchTerm: (value: string) => void;
  setSportFilter: (value: string) => void;
  setCurrentPage: (value: number) => void;
}

/**
 * Centralized leagues state manager:
 * loads data, applies search/sport filters, and exposes paginated results.
 */
export function useLeagues(pageSize: number): UseLeaguesResult {
  const [initialCachedLeagues] = useState<League[] | null>(() =>
    getCachedValue<League[]>("all-leagues"),
  );
  const [allLeagues, setAllLeagues] = useState<League[]>(
    () => initialCachedLeagues ?? [],
  );
  const [loading, setLoading] = useState(initialCachedLeagues === null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTermValue] = useState("");
  const [sportFilter, setSportFilterValue] = useState("All");
  const [currentPage, setCurrentPageValue] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadLeagues() {
      if (initialCachedLeagues === null) {
        setLoading(true);
      }
      setError("");

      try {
        const leagues = await fetchAllLeagues();
        if (cancelled) {
          return;
        }
        setAllLeagues(leagues);
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Unable to load leagues.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeagues();
    return () => {
      cancelled = true;
    };
  }, [initialCachedLeagues]);

  const sports = useMemo(() => {
    const values = new Set(
      allLeagues
        .map((league) => league.strSport)
        .filter((sport): sport is string => Boolean(sport)),
    );
    return ["All", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [allLeagues]);

  const filteredLeagues = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return allLeagues.filter((league) => {
      const leagueName = String(league.strLeague || "").toLowerCase();
      const matchesName = !query || leagueName.includes(query);
      const matchesSport =
        sportFilter === "All" || league.strSport === sportFilter;
      return matchesName && matchesSport;
    });
  }, [allLeagues, searchTerm, sportFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeagues.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const leagues = useMemo(() => {
    const start = (currentPageSafe - 1) * pageSize;
    return filteredLeagues.slice(start, start + pageSize);
  }, [filteredLeagues, currentPageSafe, pageSize]);

  const setSearchTerm = useCallback(
    (value: string) => {
      if (value === searchTerm) {
        return;
      }
      setCurrentPageValue(1);
      setSearchTermValue(value);
    },
    [searchTerm],
  );

  const setSportFilter = useCallback(
    (value: string) => {
      if (value === sportFilter) {
        return;
      }
      setCurrentPageValue(1);
      setSportFilterValue(value);
    },
    [sportFilter],
  );

  const setCurrentPage = useCallback(
    (value: number) => {
      setCurrentPageValue(Math.min(Math.max(1, value), totalPages));
    },
    [totalPages],
  );

  return {
    leagues,
    loading,
    error,
    searchTerm,
    sportFilter,
    sports,
    currentPage: currentPageSafe,
    totalPages,
    totalResults: filteredLeagues.length,
    setSearchTerm,
    setSportFilter,
    setCurrentPage,
  };
}
