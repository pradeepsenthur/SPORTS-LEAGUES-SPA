import { getCachedValue, setCachedValue } from "../src/services/cache";

describe("cache service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null for a missing key", () => {
    expect(getCachedValue("missing-key")).toBeNull();
  });

  it("stores and retrieves a typed value", () => {
    const value = { id: "1", name: "League A" };
    setCachedValue("league-key", value, 5_000);

    expect(getCachedValue<typeof value>("league-key")).toEqual(value);
  });

  it("evicts and returns null for an expired localStorage entry", () => {
    const storageKey = "sports-leagues-spa-cache:expired-key";
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        value: { ok: true },
        expiresAt: Date.now() - 1_000,
      }),
    );

    expect(getCachedValue("expired-key")).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
});
