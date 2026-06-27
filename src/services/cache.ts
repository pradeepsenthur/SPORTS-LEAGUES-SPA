const STORAGE_PREFIX = "sports-leagues-spa-cache:";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

function now(): number {
  return Date.now();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCacheEntry(value: unknown): value is CacheEntry<unknown> {
  return (
    isObject(value) && "value" in value && typeof value.expiresAt === "number"
  );
}

/**
 * Reads a cache entry from localStorage, validates its shape, and evicts stale/corrupt values.
 */
function readStorageEntry(storageKey: string): CacheEntry<unknown> | null {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  const parsed: unknown = JSON.parse(raw);
  if (!isCacheEntry(parsed)) {
    localStorage.removeItem(storageKey);
    return null;
  }

  if (parsed.expiresAt <= now()) {
    localStorage.removeItem(storageKey);
    return null;
  }

  return parsed;
}

/**
 * Returns a cached value from fast in-memory cache first, then localStorage as fallback.
 * A localStorage hit is promoted back into memory for faster subsequent reads.
 */
export function getCachedValue<T>(key: string): T | null {
  const memEntry = memoryCache.get(key);
  if (memEntry && memEntry.expiresAt > now()) {
    return memEntry.value as T;
  }

  if (memEntry && memEntry.expiresAt <= now()) {
    memoryCache.delete(key);
  }

  const storageKey = `${STORAGE_PREFIX}${key}`;

  try {
    const storageEntry = readStorageEntry(storageKey);
    if (!storageEntry) {
      return null;
    }

    memoryCache.set(key, storageEntry);
    return storageEntry.value as T;
  } catch (error) {
    console.warn("Failed to read cache from localStorage:", error);
    return null;
  }
}

/**
 * Stores a value in both in-memory cache and localStorage with a TTL-based expiry.
 */
export function setCachedValue<T>(key: string, value: T, ttlMs: number): void {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: now() + ttlMs,
  };

  memoryCache.set(key, entry);

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(entry));
  } catch (error) {
    console.warn("Failed to write cache to localStorage:", error);
  }
}
