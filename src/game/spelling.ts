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

/** How many letter hints a word gets: 1 up to 4 letters, 2 for 5–6, 3 for longer. */
export const hintsFor = (word: string) => (word.length <= 4 ? 1 : word.length <= 6 ? 2 : 3);

const isVowel = (ch: string) => 'aeiou'.includes(ch);

/**
 * Picks which slot to reveal as a hint: a consonant that isn't locked or
 * already right if there is one, otherwise any letter that still needs
 * filling. Returns null if there is nothing left to reveal.
 */
export function pickHint(
  word: string, locked: readonly boolean[], placed: readonly (string | null)[], rng: Rng,
): number | null {
  const open = word.split('').map((_, i) => i).filter((i) => !locked[i] && placed[i] !== word[i]);
  const consonants = open.filter((i) => !isVowel(word[i]));
  const pool = consonants.length > 0 ? consonants : open;
  return pool.length === 0 ? null : pool[Math.floor(rng() * pool.length)];
}
