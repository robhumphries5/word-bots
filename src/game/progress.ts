// Progress lives only on this device (localStorage). Nothing is sent anywhere.

export interface Progress {
  battlesWon: number;
  /** Challenge id -> times missed since last answered correctly. */
  missed: Record<string, number>;
  /** Ids dealt in recent battles, newest battle last, so they can be avoided next time. */
  recent: string[][];
  muted: boolean;
  /** Optional, typed in on the device; never leaves it. */
  playerName: string;
}

const KEY = 'word-bots:progress:v1';

/** How many earlier battles to remember (plus the one being played). */
export const RECENT_BATTLES = 2;

export const emptyProgress = (): Progress => ({ battlesWon: 0, missed: {}, recent: [], muted: false, playerName: '' });

export interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function loadProgress(store: Store | undefined): Progress {
  try {
    const raw = store?.getItem(KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(store: Store | undefined, p: Progress): void {
  try {
    store?.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage full or blocked: the game still works, it just won't remember.
  }
}

/** Clears everything except the sound setting, in place. */
export function resetProgress(p: Progress): void {
  Object.assign(p, emptyProgress(), { muted: p.muted });
}

/** Missed items stay "missed" until answered correctly once. */
export function recordAnswer(p: Progress, id: string, correct: boolean): void {
  if (correct) delete p.missed[id];
  else p.missed[id] = (p.missed[id] ?? 0) + 1;
}

/** Starts a fresh list of dealt ids for a new battle, forgetting the oldest. */
export function startRecent(p: Progress): string[] {
  const list: string[] = [];
  p.recent = [...p.recent.slice(-RECENT_BATTLES), list];
  return list;
}

const seenRecently = (p: Progress, id: string) => p.recent.some((battle) => battle.includes(id));

/**
 * Missed items are much more likely to be picked. Items from the last couple
 * of battles are much less likely, unless they were missed.
 */
export function weightFor(p: Progress, id: string): number {
  const missed = p.missed[id] ?? 0;
  if (missed > 0) return 1 + 4 * Math.min(missed, 3);
  return seenRecently(p, id) ? 0.1 : 1;
}
