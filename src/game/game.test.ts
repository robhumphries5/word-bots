import { describe, expect, it } from 'vitest';
import { FACTS, TRUSTED_DOMAINS } from '../content/facts';
import { WORDS } from '../content/words';
import { ChallengeDealer, unlockedLevel } from './challenges';
import { emptyProgress, recordAnswer, weightFor } from './progress';
import { isSpelt, makeTiles, markSlots } from './spelling';
import { makeSum, parseSumId, randomSum, solve, TABLES } from './sums';

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
  ];

  it('uses British spelling', () => {
    for (const t of allText) expect(t, t).not.toMatch(AMERICAN);
  });

  it('has about 30 words and 30 facts with unique ids', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(30);
    expect(FACTS.length).toBeGreaterThanOrEqual(30);
    const ids = [...WORDS, ...FACTS].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every item has a source from the trusted list', () => {
    for (const item of [...WORDS, ...FACTS]) {
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

describe('dealing a battle', () => {
  it('mixes types roughly a third each, with no repeats', () => {
    const dealer = new ChallengeDealer(emptyProgress(), seeded(11));
    const deal = Array.from({ length: 12 }, () => dealer.next());
    expect(new Set(deal.map((c) => c.id)).size).toBe(12);
    for (const t of ['spelling', 'fact', 'sum']) expect(deal.filter((c) => c.type === t)).toHaveLength(4);
  });

  it('starts with easy words and unlocks harder ones', () => {
    expect(unlockedLevel(0)).toBe(1);
    expect(unlockedLevel(3)).toBe(2);
    expect(unlockedLevel(99)).toBe(3);
    const dealer = new ChallengeDealer(emptyProgress(), seeded(5));
    for (let i = 0; i < 12; i++) {
      const c = dealer.next();
      if (c.type === 'spelling') expect(c.word.level).toBe(1);
    }
  });

  it('brings missed items back more often until answered correctly', () => {
    const p = emptyProgress();
    recordAnswer(p, 'fact:googol', false);
    expect(weightFor(p, 'fact:googol')).toBeGreaterThan(weightFor(p, 'fact:hexagon'));
    let seen = 0;
    for (let seed = 0; seed < 200; seed++) {
      const dealer = new ChallengeDealer(p, seeded(seed));
      const ids = Array.from({ length: 12 }, () => dealer.next().id);
      if (ids.includes('fact:googol')) seen++;
    }
    // Baseline chance is about 4 facts out of 32 = 12.5%; missed should be far higher.
    expect(seen / 200).toBeGreaterThan(0.3);
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
