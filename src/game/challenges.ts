import { FACTS, type Fact } from '../content/facts';
import { WORDS, type SpellingWord } from '../content/words';
import { levelFor } from './levels';
import { startRecent, weightFor, type Progress } from './progress';
import { shuffle, weightedPick, type Rng } from './random';
import { makeSum, parseSumId, randomSum, type Sum } from './sums';

export type ChallengeType = 'spelling' | 'fact' | 'sum';

export type Challenge =
  | { type: 'spelling'; id: string; word: SpellingWord }
  | { type: 'fact'; id: string; fact: Fact; options: string[] }
  | { type: 'sum'; id: string; sum: Sum };

/** Spelling level unlocked: starts at 1, one more every 3 battles won. */
export const unlockedLevel = (battlesWon: number) => Math.min(3, levelFor(battlesWon));

/** Words from the level above are let in this much less often, for variety. */
const NEXT_LEVEL_WEIGHT = 0.25;
const TYPES: ChallengeType[] = ['spelling', 'fact', 'sum'];

/**
 * Deals the challenges for one battle: types are picked at random (about a
 * third each, never three of a kind in a row), nothing repeats within the
 * battle, missed items come back more often, and items from the last couple of
 * battles are mostly avoided. Starting a dealer starts a new battle's memory.
 */
export class ChallengeDealer {
  private used = new Set<string>();
  private lastTypes: ChallengeType[] = [];
  private dealt: string[];

  constructor(private progress: Progress, private rng: Rng) {
    this.dealt = startRecent(progress);
  }

  next(): Challenge {
    const [a, b] = this.lastTypes.slice(-2);
    const types = a !== undefined && a === b ? TYPES.filter((t) => t !== a) : TYPES;
    const type = types[Math.floor(this.rng() * types.length)];
    this.lastTypes.push(type);
    const c = type === 'spelling' ? this.spelling() : type === 'fact' ? this.fact() : this.sum();
    this.used.add(c.id);
    this.dealt.push(c.id);
    return c;
  }

  private fresh<T extends { id: string }>(items: T[]): T[] {
    return items.filter((it) => !this.used.has(it.id));
  }

  private spelling(): Challenge {
    const level = unlockedLevel(this.progress.battlesWon);
    let pool = this.fresh(WORDS.filter((w) => w.level <= level + 1 || this.progress.missed[w.id]));
    if (pool.length === 0) pool = this.fresh(WORDS);
    if (pool.length === 0) pool = WORDS;
    const weight = (w: SpellingWord) =>
      weightFor(this.progress, w.id) * (w.level > level && !this.progress.missed[w.id] ? NEXT_LEVEL_WEIGHT : 1);
    const word = weightedPick(pool, weight, this.rng);
    return { type: 'spelling', id: word.id, word };
  }

  private fact(): Challenge {
    let pool = this.fresh(FACTS);
    if (pool.length === 0) pool = FACTS;
    const fact = weightedPick(pool, (f) => weightFor(this.progress, f.id), this.rng);
    const options = fact.kind === 'tf' ? fact.options : shuffle(fact.options, this.rng);
    return { type: 'fact', id: fact.id, fact, options };
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
