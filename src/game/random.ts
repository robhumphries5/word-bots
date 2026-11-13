export type Rng = () => number;

export const randInt = (rng: Rng, min: number, max: number): number =>
  min + Math.floor(rng() * (max - min + 1));

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Picks one item, with probability proportional to its weight. */
export function weightedPick<T>(items: readonly T[], weight: (item: T) => number, rng: Rng): T {
  const total = items.reduce((sum, it) => sum + weight(it), 0);
  let r = rng() * total;
  for (const it of items) {
    r -= weight(it);
    if (r < 0) return it;
  }
  return items[items.length - 1];
}
