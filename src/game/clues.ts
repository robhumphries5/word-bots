/** A piece of a reading passage, marked if it is one of the clue phrases. */
export interface Piece {
  text: string;
  clue: boolean;
}

/**
 * Splits a passage into plain and clue pieces, so clue phrases can be
 * highlighted. Every occurrence of each clue is marked; overlaps merge.
 */
export function markClues(passage: string, clues: string[]): Piece[] {
  const marked = Array<boolean>(passage.length).fill(false);
  for (const clue of clues) {
    if (!clue) continue;
    for (let i = passage.indexOf(clue); i >= 0; i = passage.indexOf(clue, i + 1)) {
      marked.fill(true, i, i + clue.length);
    }
  }
  const pieces: Piece[] = [];
  for (let i = 0; i < passage.length; i++) {
    const last = pieces[pieces.length - 1];
    if (last && last.clue === marked[i]) last.text += passage[i];
    else pieces.push({ text: passage[i], clue: marked[i] });
  }
  return pieces;
}
