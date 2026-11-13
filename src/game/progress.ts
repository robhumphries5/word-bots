// Progress lives only on this device (localStorage). Nothing is sent anywhere.

export interface Progress {
  battlesWon: number;
  /** Challenge id -> times missed since last answered correctly. */
  missed: Record<string, number>;
  muted: boolean;
  /** Optional, typed in on the device; never leaves it. */
  playerName: string;
}

const KEY = 'word-bots:progress:v1';

export const emptyProgress = (): Progress => ({ battlesWon: 0, missed: {}, muted: false, playerName: '' });

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

/** Missed items stay "missed" until answered correctly once. */
export function recordAnswer(p: Progress, id: string, correct: boolean): void {
  if (correct) delete p.missed[id];
  else p.missed[id] = (p.missed[id] ?? 0) + 1;
}

/** Missed items are much more likely to be picked. */
export const weightFor = (p: Progress, id: string) => 1 + 4 * Math.min(p.missed[id] ?? 0, 3);
