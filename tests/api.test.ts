describe("api service", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  it("returns mock leagues with expected size and repeated keyword", async () => {
    const leaguesPayload = Array.from({ length: 50 }, (_, index) => ({
      idLeague: `${1000 + index}`,
      strLeague:
        index < 12 ? `Premier Test League ${index + 1}` : `League ${index + 1}`,
      strSport:
        index % 5 === 0 ? "Cricket" : index % 5 === 1 ? "Tennis" : "Soccer",
      strLeagueAlternate: `ALT ${index + 1}`,
    }));
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ leagues: leaguesPayload }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { fetchAllLeagues } = await import("../src/services/api");
    const leagues = await fetchAllLeagues();

    expect(leagues).toHaveLength(50);
    expect(
      leagues.filter((league) => league.strLeague?.includes("Premier")).length,
    ).toBeGreaterThanOrEqual(10);
    expect(leagues.some((league) => league.strSport === "Cricket")).toBe(true);
    expect(leagues.some((league) => league.strSport === "Tennis")).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("caches season badge response and avoids duplicate fetches", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        seasons: [
          { strSeason: "2023-2024", strBadge: "https://img.test/b.png" },
        ],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { fetchSeasonBadge } = await import("../src/services/api");
    const first = await fetchSeasonBadge("4321");
    const second = await fetchSeasonBadge("4321");

    expect(first).toEqual({
      season: "2023-2024",
      badgeUrl: "https://img.test/b.png",
    });
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to first season when no explicit badge season exists", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        seasons: [{ strSeason: "2022", strBadge: null }],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { fetchSeasonBadge } = await import("../src/services/api");
    const badge = await fetchSeasonBadge("9999");

    expect(badge).toEqual({ season: "2022", badgeUrl: null });
  });
});
