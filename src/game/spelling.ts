import { shuffle, type Rng } from './random';

/** Letter tiles for a word: exactly its letters, shuffled so they don't already spell it. */
export function makeTiles(word: string, rng: Rng): string[] {
  const letters = word.split('');
  if (new Set(letters).size === 1) return letters;
  for (;;) {
    const tiles = shuffle(letters, rng);
    if (tiles.join('') !== word) return tiles;
  }
}

/** For each slot, whether the placed letter is the right one. */
export function markSlots(word: string, placed: readonly (string | null)[]): boolean[] {
  return word.split('').map((ch, i) => placed[i] === ch);
}

export const isSpelt = (word: string, placed: readonly (string | null)[]) =>
  markSlots(word, placed).every(Boolean);
