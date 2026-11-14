import { FACTS, type Fact } from '../content/facts';
import { READING, type ReadingQuestion } from '../content/reading';
import { WORDS, type SpellingWord } from '../content/words';
import { levelFor } from './levels';
import { startRecent, weightFor, type Progress } from './progress';
import { shuffle, weightedPick, type Rng } from './random';
import { makeSum, parseSumId, randomSum, type Sum } from './sums';

export type ChallengeType = 'spelling' | 'fact' | 'sum' | 'reading';

export type Challenge =
  | { type: 'spelling'; id: string; word: SpellingWord }
  | { type: 'fact'; id: string; fact: Fact; options: string[] }
  | { type: 'sum'; id: string; sum: Sum }
  | { type: 'reading'; id: string; reading: ReadingQuestion; options: string[] };

/** Everything a battle can draw from. Inactive items are filtered out by the dealer. */
export interface Content {
  words: SpellingWord[];
  facts: Fact[];
  reading: ReadingQuestion[];
}

export const ALL_CONTENT: Content = { words: WORDS, facts: FACTS, reading: READING };

const onlyActive = (c: Content): Content => ({
  words: c.words.filter((w) => w.active),
  facts: c.facts.filter((f) => f.active),
  reading: c.reading.filter((q) => q.active),
});

/** Spelling level unlocked: starts at 1, one more every 3 battles won. */
export const unlockedLevel = (battlesWon: number) => Math.min(3, levelFor(battlesWon));

/**
 * Chance that a spelling question is a sound-it-out word (level 0) rather than
 * a tricky one, so not every word is a struggle. Higher at the start.
 */
export const easyShare = (level: number) => (level <= 1 ? 0.6 : 0.4);

/** Words from the level above are let in this much less often, for variety. */
const NEXT_LEVEL_WEIGHT = 0.25;

/**
 * Deals the challenges for one battle, using only active questions. Types are
 * picked at random (evenly, never three of a kind in a row; reading only once
 * some reading questions are active), nothing repeats within the
 * battle, missed items come back more often, and items from the last couple of
 * battles are mostly avoided. Starting a dealer starts a new battle's memory.
 */
export class ChallengeDealer {
  private used = new Set<string>();
  private lastTypes: ChallengeType[] = [];
  private dealt: string[];
  private content: Content;
  private types: ChallengeType[];

  constructor(private progress: Progress, private rng: Rng, content: Content = ALL_CONTENT) {
    this.dealt = startRecent(progress);
    this.content = onlyActive(content);
    this.types = ['spelling', 'fact', 'sum'];
    if (this.content.reading.length > 0) this.types.push('reading');
  }

  next(): Challenge {
    const [a, b] = this.lastTypes.slice(-2);
    const types = a !== undefined && a === b ? this.types.filter((t) => t !== a) : this.types;
    const type = types[Math.floor(this.rng() * types.length)];
    this.lastTypes.push(type);
    const c = type === 'spelling' ? this.spelling()
      : type === 'fact' ? this.fact()
      : type === 'reading' ? this.reading()
      : this.sum();
    this.used.add(c.id);
    this.dealt.push(c.id);
    return c;
  }

  private fresh<T extends { id: string }>(items: T[]): T[] {
    return items.filter((it) => !this.used.has(it.id));
  }

  private spelling(): Challenge {
    const words = this.content.words;
    const level = unlockedLevel(this.progress.battlesWon);
    const easy = this.rng() < easyShare(level);
    const pick = easy
      ? words.filter((w) => w.level === 0)
      : words.filter((w) => w.level > 0 && (w.level <= level + 1 || this.progress.missed[w.id]));
    let pool = this.fresh(pick);
    if (pool.length === 0) pool = this.fresh(words);
    if (pool.length === 0) pool = words;
    const weight = (w: SpellingWord) =>
      weightFor(this.progress, w.id) * (w.level > level && !this.progress.missed[w.id] ? NEXT_LEVEL_WEIGHT : 1);
    const word = weightedPick(pool, weight, this.rng);
    return { type: 'spelling', id: word.id, word };
  }

  private fact(): Challenge {
    let pool = this.fresh(this.content.facts);
    if (pool.length === 0) pool = this.content.facts;
    const fact = weightedPick(pool, (f) => weightFor(this.progress, f.id), this.rng);
    const options = fact.kind === 'tf' ? fact.options : shuffle(fact.options, this.rng);
    return { type: 'fact', id: fact.id, fact, options };
  }

  private reading(): Challenge {
    let pool = this.fresh(this.content.reading);
    if (pool.length === 0) pool = this.content.reading;
    const reading = weightedPick(pool, (q) => weightFor(this.progress, q.id), this.rng);
    return { type: 'reading', id: reading.id, reading, options: shuffle(reading.options, this.rng) };
  }

  private sum(): Challenge {
    const missed = Object.keys(this.progress.missed)
      .filter((id) => id.startsWith('sum:') && !this.used.has(id))
      .map(parseSumId)
      .filter((s) => s !== null);
    if (missed.length > 0 && this.rng() < 0.4) {
      const s = missed[Math.floor(this.rng() * missed.length)];
      const sum = makeSum(s.a, s.op, s.b, this.rng);
      return { type: 'sum', id: sum.id, sum };
    }
    let sum = randomSum(this.rng);
    const avoid = (id: string) => this.used.has(id) || weightFor(this.progress, id) < 1;
    for (let tries = 0; avoid(sum.id) && tries < 50; tries++) sum = randomSum(this.rng);
    return { type: 'sum', id: sum.id, sum };
  }
}

export const ROBOT_HP = 8;
export const PLAYER_HEARTS = 5;
export const READS_PER_BATTLE = 3;

export interface BattleState {
  robotHp: number;
  hearts: number;
  readsLeft: number;
}

export const newBattle = (robotHp = ROBOT_HP): BattleState => ({ robotHp, hearts: PLAYER_HEARTS, readsLeft: READS_PER_BATTLE });
