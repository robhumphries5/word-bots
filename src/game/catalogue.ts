// Every question in the game as a flat list, for the grown-ups' "All
// questions" screen: what is asked, the right answer, the wrong options and
// where it came from.

import { FACTS, type Topic } from '../content/facts';
import { WORDS, type WordLevel } from '../content/words';
import { allSums, solve, sumId, sumText, SUMS_SOURCE } from './sums';

export type Kind = 'spelling' | 'fact' | 'sum';

export interface Entry {
  id: string;
  kind: Kind;
  /** Topic for facts, level for words, operation for sums. */
  group: string;
  question: string;
  answer: string;
  /** Wrong options shown in battle (empty for spelling and sums). */
  wrong: string[];
  source: string;
}

export const TOPIC_NAMES: Record<Topic, string> = {
  space: 'Space', animals: 'Animals', nature: 'Nature', maths: 'Maths', records: 'Records', pokemon: 'Pokémon',
};

export const LEVEL_NAMES: Record<WordLevel, string> = {
  0: 'Sound it out', 1: 'Tricky words 1', 2: 'Tricky words 2', 3: 'Tricky words 3',
};

const OP_NAMES = { '+': 'Adding', '−': 'Taking away', '×': 'Times', '÷': 'Dividing' } as const;

export function buildCatalogue(): Entry[] {
  return [
    ...WORDS.map((w): Entry => ({
      id: w.id, kind: 'spelling', group: LEVEL_NAMES[w.level],
      question: w.clue, answer: w.word, wrong: [], source: w.source,
    })),
    ...FACTS.map((f): Entry => ({
      id: f.id, kind: 'fact', group: TOPIC_NAMES[f.topic],
      question: f.kind === 'tf' ? `True or false? ${f.question}` : f.question,
      answer: f.answer, wrong: f.kind === 'tf' ? [] : f.options.filter((o) => o !== f.answer), source: f.source,
    })),
    ...allSums().map((s): Entry => ({
      id: sumId(s.a, s.op, s.b), kind: 'sum', group: OP_NAMES[s.op],
      question: sumText(s), answer: String(solve(s.a, s.op, s.b)), wrong: [], source: SUMS_SOURCE,
    })),
  ];
}

/** Groups in the order they first appear, for the filter drop-down. */
export const groupsOf = (entries: Entry[], kind: Kind | 'all'): string[] =>
  kind === 'all' ? [] : [...new Set(entries.filter((e) => e.kind === kind).map((e) => e.group))];

export interface Filter {
  kind: Kind | 'all';
  /** '' means every group. */
  group: string;
  search: string;
}

/** Case-insensitive search over the question, answers and group; every word must match. */
export function filterCatalogue(entries: Entry[], f: Filter): Entry[] {
  const words = f.search.toLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter((e) => {
    if (f.kind !== 'all' && e.kind !== f.kind) return false;
    if (f.group && e.group !== f.group) return false;
    if (words.length === 0) return true;
    const text = [e.question, e.answer, ...e.wrong, e.group].join(' ').toLowerCase();
    return words.every((w) => text.includes(w));
  });
}
