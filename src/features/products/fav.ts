const KEY = "favorites_v1";

export function getFavoriteSet(): Set<number> {
  const raw = localStorage.getItem(KEY);
  if (!raw) return new Set();

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x) => typeof x === "number"));
  } catch {
    return new Set();
  }
}

export function toggleFavorite(id: number): void {
  const set = getFavoriteSet();
  if (set.has(id)) set.delete(id);
  else set.add(id);
  localStorage.setItem(KEY, JSON.stringify([...set]));
}
