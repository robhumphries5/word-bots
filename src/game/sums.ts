import { randInt, shuffle, type Rng } from './random';

export type Op = '+' | '−' | '×' | '÷';

export interface Sum {
  id: string;
  a: number;
  b: number;
  op: Op;
  answer: number;
  /** Four distinct options, one of which is the answer. */
  options: number[];
}

export const TABLES = [2, 5, 10];

export function solve(a: number, op: Op, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return a / b;
  }
}

export const sumId = (a: number, op: Op, b: number) => `sum:${a}${op}${b}`;

export function parseSumId(id: string): { a: number; op: Op; b: number } | null {
  const m = /^sum:(\d+)([+−×÷])(\d+)$/.exec(id);
  return m ? { a: Number(m[1]), op: m[2] as Op, b: Number(m[3]) } : null;
}

export function makeSum(a: number, op: Op, b: number, rng: Rng): Sum {
  const answer = solve(a, op, b);
  return { id: sumId(a, op, b), a, b, op, answer, options: makeOptions(answer, op, rng) };
}

/** + and − within 20; × and ÷ from the 2, 5 and 10 times tables. */
export function randomSum(rng: Rng): Sum {
  const op = (['+', '−', '×', '÷'] as Op[])[randInt(rng, 0, 3)];
  let a: number, b: number;
  if (op === '+') {
    a = randInt(rng, 1, 19);
    b = randInt(rng, 1, 20 - a);
  } else if (op === '−') {
    a = randInt(rng, 2, 20);
    b = randInt(rng, 1, a - 1);
  } else {
    const table = TABLES[randInt(rng, 0, TABLES.length - 1)];
    const n = randInt(rng, 1, 10);
    if (op === '×') {
      [a, b] = rng() < 0.5 ? [n, table] : [table, n];
    } else {
      a = n * table;
      b = table;
    }
  }
  return makeSum(a, op, b, rng);
}

function makeOptions(answer: number, op: Op, rng: Rng): number[] {
  // Plausible mistakes first: off by one or two, or off by a "table step".
  const step = op === '×' || op === '÷' ? [1, 2, 5, 10] : [1, 2, 3, 10];
  const candidates = new Set<number>();
  for (const s of shuffle(step, rng)) {
    candidates.add(answer + s);
    candidates.add(answer - s);
  }
  candidates.delete(answer);
  const wrong = shuffle([...candidates].filter((n) => n >= 0), rng).slice(0, 3);
  return shuffle([answer, ...wrong], rng);
}

export const sumText = (s: { a: number; op: Op; b: number }) => `${s.a} ${s.op} ${s.b} = ?`;

export function sumSpoken(s: { a: number; op: Op; b: number }): string {
  const word = { '+': 'add', '−': 'take away', '×': 'times', '÷': 'divided by' }[s.op];
  return `What is ${s.a} ${word} ${s.b}?`;
}
