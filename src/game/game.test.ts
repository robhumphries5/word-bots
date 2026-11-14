import { describe, expect, it } from 'vitest';
import { FACTS, TRUSTED_DOMAINS } from '../content/facts';
import { READING, type ReadingQuestion } from '../content/reading';
import { WORDS } from '../content/words';
import { ALL_CONTENT, ChallengeDealer, unlockedLevel } from './challenges';
import { markClues } from './clues';
import {
  BATTLES_PER_LEVEL, beatenThisLevel, levelFor, levelsUpAfterWin, robotFor, ROBOTS,
} from './levels';
import { emptyProgress, RECENT_BATTLES, recordAnswer, resetProgress, weightFor } from './progress';
import { hintsFor, isSpelt, makeTiles, markSlots, pickHint } from './spelling';
import { allSums, makeSum, parseSumId, randomSum, solve, TABLES } from './sums';
import { buildCatalogue, filterCatalogue, groupsOf } from './catalogue';

/** Small seeded RNG so tests are repeatable. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32;
    return seed / 2 ** 32;
  };
}

// American spellings that must never appear (British English rule).
const AMERICAN = /\b(color|favorite|center|meter|liter|gray|honor|neighbor|flavor|theater|realize|organize|mom|candy floss|cotton candy|math)\b/i;

describe('content', () => {
  const allText = [
    ...WORDS.flatMap((w) => [w.word, w.clue]),
    ...FACTS.flatMap((f) => [f.question, ...f.options]),
    ...READING.flatMap((q) => [q.passage, q.question, ...q.options]),
  ];

  it('uses British spelling', () => {
    for (const t of allText) expect(t, t).not.toMatch(AMERICAN);
  });

  it('has plenty of words and facts with unique ids', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(100);
    expect(FACTS.length).toBeGreaterThanOrEqual(70);
    const ids = [...WORDS, ...FACTS, ...READING].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every item has a source from the trusted list', () => {
    for (const item of [...WORDS, ...FACTS, ...READING]) {
      const host = new URL(item.source).hostname;
      expect(TRUSTED_DOMAINS.some((d) => host === d || host.endsWith('.' + d)), `${item.id}: ${host}`).toBe(true);
    }
  });

  it('spelling clues never give away the word', () => {
    for (const w of WORDS) expect(w.clue.toLowerCase(), w.word).not.toContain(w.word);
  });

  it('spelling words are lower-case letters only', () => {
    for (const w of WORDS) expect(w.word).toMatch(/^[a-z]+$/);
  });

  it('facts have their answer among distinct options', () => {
    for (const f of FACTS) {
      expect(f.options, f.id).toContain(f.answer);
      expect(new Set(f.options).size, f.id).toBe(f.options.length);
      if (f.kind === 'tf') expect(f.options).toEqual(['True', 'False']);
      else expect(f.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('covers every planned topic', () => {
    const topics = new Set(FACTS.map((f) => f.topic));
    for (const t of ['space', 'animals', 'nature', 'maths', 'records', 'pokemon']) expect(topics).toContain(t);
  });
});

describe('sums', () => {
  it('generates sums inside the Year 3 ranges, with correct answers', () => {
    const rng = seeded(1);
    for (let i = 0; i < 2000; i++) {
      const s = randomSum(rng);
      expect(s.answer).toBe(solve(s.a, s.op, s.b));
      expect(Number.isInteger(s.answer)).toBe(true);
      if (s.op === '+') expect(s.answer).toBeLessThanOrEqual(20);
      if (s.op === '−') {
        expect(s.a).toBeLessThanOrEqual(20);
        expect(s.answer).toBeGreaterThan(0);
      }
      if (s.op === '×') expect(TABLES.includes(s.a) || TABLES.includes(s.b)).toBe(true);
      if (s.op === '÷') expect(TABLES).toContain(s.b);
      expect(s.options).toHaveLength(4);
      expect(new Set(s.options).size).toBe(4);
      expect(s.options).toContain(s.answer);
      for (const o of s.options) expect(o).toBeGreaterThanOrEqual(0);
    }
  });

  it('round-trips ids so missed sums can come back', () => {
    const s = makeSum(12, '÷', 2, seeded(3));
    expect(parseSumId(s.id)).toEqual({ a: 12, op: '÷', b: 2 });
  });
});

describe('spelling', () => {
  it('tiles are exactly the letters of the word, not already in order', () => {
    const rng = seeded(7);
    for (const w of WORDS) {
      const tiles = makeTiles(w.word, rng);
      expect([...tiles].sort().join('')).toBe(w.word.split('').sort().join(''));
      expect(tiles.join('')).not.toBe(w.word);
    }
  });

  it('marks correctly placed letters', () => {
    expect(markSlots('heart', ['h', 'a', 'e', 'r', 't'])).toEqual([true, false, false, true, true]);
    expect(isSpelt('heart', ['h', 'e', 'a', 'r', 't'])).toBe(true);
    expect(isSpelt('heart', ['h', 'e', 'a', 'r', null])).toBe(false);
  });
});

describe('spelling hints', () => {
  it('gives 1 hint up to 4 letters, 2 for 5 or 6, 3 for longer', () => {
    expect(hintsFor('cat')).toBe(1);
    expect(hintsFor('bird')).toBe(1);
    expect(hintsFor('heart')).toBe(2);
    expect(hintsFor('friend')).toBe(2);
    expect(hintsFor('because')).toBe(3);
    expect(hintsFor('favourite')).toBe(3);
  });

  it('reveals consonants first, never a locked or already-right slot', () => {
    const word = 'favourite';
    const rng = seeded(4);
    for (let n = 0; n < 200; n++) {
      const locked = word.split('').map((_, i) => i === 0);
      const placed: (string | null)[] = word.split('').map((_, i) => (i === 2 ? 'v' : null));
      const i = pickHint(word, locked, placed, rng)!;
      expect([0, 2]).not.toContain(i);
      expect('aeiou').not.toContain(word[i]);
    }
  });

  it('falls back to vowels, then to nothing', () => {
    const rng = seeded(9);
    const word = 'oat';
    expect(pickHint(word, [false, false, true], [null, null, 't'], rng)).not.toBeNull();
    expect('oa').toContain(word[pickHint(word, [false, false, true], [null, null, 't'], rng)!]);
    expect(pickHint(word, [true, true, true], ['o', 'a', 't'], rng)).toBeNull();
  });
});

describe('dealing a battle', () => {
  it('mixes types roughly a third each, never three in a row, with no repeats', () => {
    const counts: Record<string, number> = { spelling: 0, fact: 0, sum: 0 };
    for (let seed = 0; seed < 50; seed++) {
      const dealer = new ChallengeDealer(emptyProgress(), seeded(seed));
      const deal = Array.from({ length: 12 }, () => dealer.next());
      expect(new Set(deal.map((c) => c.id)).size).toBe(12);
      for (let i = 2; i < deal.length; i++) {
        expect(deal[i].type === deal[i - 1].type && deal[i].type === deal[i - 2].type).toBe(false);
      }
      for (const c of deal) counts[c.type]++;
    }
    for (const n of Object.values(counts)) expect(n / 600).toBeGreaterThan(0.25);
  });

  it('does not always use the same type pattern', () => {
    const patterns = new Set<string>();
    // Seeds spread out: with neighbouring seeds this simple RNG's first draws are almost identical.
    for (let seed = 0; seed < 20; seed++) {
      const dealer = new ChallengeDealer(emptyProgress(), seeded(seed * 104729));
      patterns.add(Array.from({ length: 6 }, () => dealer.next().type[0]).join(''));
    }
    expect(patterns.size).toBeGreaterThan(10);
  });

  const spellingLevels = (battlesWon: number) => {
    const levels: number[] = [];
    for (let seed = 0; seed < 100; seed++) {
      const p = { ...emptyProgress(), battlesWon };
      const dealer = new ChallengeDealer(p, seeded(seed));
      for (let i = 0; i < 12; i++) {
        const c = dealer.next();
        if (c.type === 'spelling') levels.push(c.word.level);
      }
    }
    return levels;
  };

  it('starts with mostly easy tricky words, a few from the next level, and unlocks harder ones', () => {
    expect(unlockedLevel(0)).toBe(1);
    expect(unlockedLevel(3)).toBe(2);
    expect(unlockedLevel(99)).toBe(3);
    const tricky = spellingLevels(0).filter((l) => l > 0);
    expect(tricky).not.toContain(3);
    const easy = tricky.filter((l) => l === 1).length / tricky.length;
    expect(easy).toBeGreaterThan(0.6);
    expect(easy).toBeLessThan(1);
  });

  it('keeps sound-it-out words in the mix at every level', () => {
    expect(WORDS.filter((w) => w.level === 0).length).toBeGreaterThanOrEqual(40);
    const share = (won: number) => {
      const levels = spellingLevels(won);
      return levels.filter((l) => l === 0).length / levels.length;
    };
    expect(share(0)).toBeGreaterThan(0.5);
    expect(share(0)).toBeLessThan(0.7);
    expect(share(9)).toBeGreaterThan(0.3);
    expect(share(9)).toBeLessThan(0.5);
  });

  it('mostly avoids questions from the last couple of battles', () => {
    let repeats = 0, total = 0;
    for (let seed = 0; seed < 50; seed++) {
      const p = emptyProgress();
      const rng = seeded(seed);
      const first = new Set<string>();
      const d1 = new ChallengeDealer(p, rng);
      for (let i = 0; i < 10; i++) first.add(d1.next().id);
      const d2 = new ChallengeDealer(p, rng);
      const second = Array.from({ length: 10 }, () => d2.next()).filter((c) => c.type === 'fact');
      total += second.length;
      repeats += second.filter((c) => first.has(c.id)).length;
    }
    // Without memory, about 1 in 8 facts would repeat from the battle before.
    expect(repeats / total).toBeLessThan(0.05);
  });

  it('only remembers the last couple of battles', () => {
    const p = emptyProgress();
    for (let i = 0; i < 5; i++) new ChallengeDealer(p, seeded(i)).next();
    expect(p.recent).toHaveLength(RECENT_BATTLES + 1);
  });

  it('brings missed items back more often until answered correctly', () => {
    const p = emptyProgress();
    recordAnswer(p, 'fact:googol', false);
    expect(weightFor(p, 'fact:googol')).toBeGreaterThan(weightFor(p, 'fact:hexagon'));
    let seen = 0, seenOther = 0;
    for (let seed = 0; seed < 200; seed++) {
      const dealer = new ChallengeDealer(p, seeded(seed));
      const ids = Array.from({ length: 12 }, () => dealer.next().id);
      if (ids.includes('fact:googol')) seen++;
      if (ids.includes('fact:hexagon')) seenOther++;
    }
    // A missed fact should come up far more often than one that was answered fine.
    expect(seen).toBeGreaterThan(2 * Math.max(seenOther, 5));
    recordAnswer(p, 'fact:googol', true);
    expect(p.missed['fact:googol']).toBeUndefined();
  });

  it('lets a missed harder word come back even before its level unlocks', () => {
    const p = emptyProgress();
    recordAnswer(p, 'word:favourite', false);
    let seen = false;
    for (let seed = 0; seed < 100 && !seen; seed++) {
      const dealer = new ChallengeDealer(p, seeded(seed));
      seen = Array.from({ length: 12 }, () => dealer.next().id).includes('word:favourite');
    }
    expect(seen).toBe(true);
  });
});

describe('levels and robots', () => {
  it('goes up a level every few robots beaten', () => {
    expect(BATTLES_PER_LEVEL).toBe(3);
    expect(levelFor(0)).toBe(1);
    expect(levelFor(2)).toBe(1);
    expect(levelFor(3)).toBe(2);
    expect(beatenThisLevel(4)).toBe(1);
    expect(levelsUpAfterWin(2)).toBe(true);
    expect(levelsUpAfterWin(3)).toBe(false);
  });

  it('changes robot each level and cycles round after the last', () => {
    expect(robotFor(0).name).toBe('Rook-Bot');
    expect(robotFor(2).name).toBe('Rook-Bot');
    expect(robotFor(3).name).not.toBe('Rook-Bot');
    expect(robotFor(3 * ROBOTS.length).name).toBe('Rook-Bot');
    expect(new Set(ROBOTS.map((r) => r.name)).size).toBe(ROBOTS.length);
  });

  it('robot lines use British spelling', () => {
    for (const r of ROBOTS) for (const t of [...r.greetings, ...r.taunts]) expect(t, t).not.toMatch(AMERICAN);
  });
});

describe('reset', () => {
  it('clears progress but keeps the sound setting', () => {
    const p = emptyProgress();
    p.battlesWon = 7;
    p.muted = true;
    p.playerName = 'Test';
    recordAnswer(p, 'fact:googol', false);
    new ChallengeDealer(p, seeded(1)).next();
    resetProgress(p);
    expect(p).toEqual({ ...emptyProgress(), muted: true });
  });
});

describe('grown-ups question list', () => {
  const all = buildCatalogue();

  it('lists every word, fact and possible sum once', () => {
    const sums = allSums();
    expect(sums.filter((s) => s.op === '+')).toHaveLength(190);
    expect(sums.filter((s) => s.op === '−')).toHaveLength(190);
    expect(sums.filter((s) => s.op === '×')).toHaveLength(51);
    expect(sums.filter((s) => s.op === '÷')).toHaveLength(30);
    expect(all).toHaveLength(WORDS.length + READING.length + FACTS.length + sums.length);
    expect(new Set(all.map((e) => e.id)).size).toBe(all.length);
  });

  it('includes every sum a battle can deal', () => {
    const ids = new Set(all.map((e) => e.id));
    const rng = seeded(7);
    for (let i = 0; i < 2000; i++) expect(ids.has(randomSum(rng).id)).toBe(true);
  });

  it('every entry has an answer and a source link', () => {
    for (const e of all) {
      expect(e.answer, e.id).not.toBe('');
      expect(() => new URL(e.source), e.id).not.toThrow();
    }
  });

  it('filters by type, group and search words', () => {
    const facts = filterCatalogue(all, { kind: 'fact', group: '', status: 'all', search: '' });
    expect(facts).toHaveLength(FACTS.length);
    const space = filterCatalogue(all, { kind: 'fact', group: 'Space', status: 'all', search: '' });
    expect(space.length).toBeGreaterThan(0);
    expect(space.every((e) => e.group === 'Space')).toBe(true);
    const mars = filterCatalogue(all, { kind: 'all', group: '', status: 'all', search: 'RED planet' });
    expect(mars.map((e) => e.answer)).toContain('Mars');
    expect(filterCatalogue(all, { kind: 'all', group: '', status: 'all', search: 'zzzzqqq' })).toHaveLength(0);
    expect(groupsOf(all, 'sum')).toEqual(['Adding', 'Taking away', 'Times', 'Dividing']);
  });
});

describe('reading questions', () => {
  it('have a short passage, distinct options including the answer, and clues from the passage', () => {
    expect(READING.length).toBeGreaterThanOrEqual(15);
    for (const q of READING) {
      const sentences = q.passage.split(/[.!?](?:[”’"]?)(?:\s|$)/).filter((x) => x.trim()).length;
      expect(sentences, q.id).toBeLessThanOrEqual(3);
      expect(q.options, q.id).toContain(q.answer);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.clues.length, q.id).toBeGreaterThan(0);
      for (const c of q.clues) expect(q.passage, `${q.id}: ${c}`).toContain(c);
    }
  });

  it('marks clue phrases in a passage, merging overlaps', () => {
    expect(markClues('It was dark and the moon shone.', ['dark', 'moon'])).toEqual([
      { text: 'It was ', clue: false },
      { text: 'dark', clue: true },
      { text: ' and the ', clue: false },
      { text: 'moon', clue: true },
      { text: ' shone.', clue: false },
    ]);
    expect(markClues('big dog', ['big', 'big dog'])).toEqual([{ text: 'big dog', clue: true }]);
    expect(markClues('no clues', [])).toEqual([{ text: 'no clues', clue: false }]);
  });
});

describe('active questions', () => {
  const deal = (content = ALL_CONTENT, battles = 40) => {
    const ids: string[] = [];
    const types = new Set<string>();
    for (let seed = 0; seed < battles; seed++) {
      const dealer = new ChallengeDealer(emptyProgress(), seeded(seed * 7919), content);
      for (let i = 0; i < 12; i++) {
        const c = dealer.next();
        ids.push(c.id);
        types.add(c.type);
      }
    }
    return { ids, types };
  };

  it('never puts inactive questions in a battle', () => {
    const offWord = { ...WORDS[0], active: false };
    const offFact = { ...FACTS[0], active: false };
    const content = { words: [offWord, ...WORDS.slice(1)], facts: [offFact, ...FACTS.slice(1)], reading: READING };
    const { ids } = deal(content, 150);
    expect(ids).not.toContain(offWord.id);
    expect(ids).not.toContain(offFact.id);
    for (const q of READING.filter((r) => !r.active)) expect(ids).not.toContain(q.id);
  });

  it('only deals reading once some reading questions are active', () => {
    const off = READING.map((q): ReadingQuestion => ({ ...q, active: false }));
    expect(deal({ ...ALL_CONTENT, reading: off }).types.has('reading')).toBe(false);
    const on = off.map((q, i) => ({ ...q, active: i < 5 }));
    const { ids, types } = deal({ ...ALL_CONTENT, reading: on });
    expect(types.has('reading')).toBe(true);
    const readIds = new Set(ids.filter((id) => id.startsWith('read:')));
    for (const id of readIds) expect(on.find((q) => q.id === id)?.active).toBe(true);
  });

  it('shows every question in the grown-ups list, active or not', () => {
    const all = buildCatalogue();
    for (const q of READING) expect(all.find((e) => e.id === q.id)?.active).toBe(q.active);
    const waiting = filterCatalogue(all, { kind: 'all', group: '', status: 'inactive', search: '' });
    expect(waiting.every((e) => !e.active)).toBe(true);
    expect(waiting.length).toBe(READING.filter((q) => !q.active).length);
    const owls = filterCatalogue(all, { kind: 'reading', group: '', status: 'all', search: 'owls' });
    expect(owls.map((e) => e.answer)).toEqual(['Night-time']);
  });
});
