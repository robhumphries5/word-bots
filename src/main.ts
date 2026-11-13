import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import './style.css';

import {
  ChallengeDealer, newBattle, PLAYER_HEARTS,
  type BattleState, type Challenge,
} from './game/challenges';
import {
  BATTLES_PER_LEVEL, beatenThisLevel, levelFor, levelsUpAfterWin, robotFor, type RobotDesign,
} from './game/levels';
import { loadProgress, recordAnswer, resetProgress, saveProgress, type Store } from './game/progress';
import { hintsFor, isSpelt, makeTiles, markSlots, pickHint } from './game/spelling';
import { sumSpoken, sumText } from './game/sums';
import { Robot } from './ui/robot';
import { setMuted, sfx } from './ui/sound';
import { canSpeak, speak, stopSpeaking } from './ui/speech';

const TAUNTS = ['Bzzzt! Is that all you have got?', 'Beep boop! Want another go?'];
const OUCH = ['Ouch!', 'Bzzt!', 'Clonk!', 'Oof!', 'Zap!', 'Argh!'];

function storage(): Store | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

const store = storage();
const progress = loadProgress(store);
setMuted(progress.muted);
const save = () => saveProgress(store, progress);

const app = document.getElementById('app')!;

// --- tiny DOM helper -------------------------------------------------------

type Props = Record<string, string | boolean | ((e: Event) => void)>;

function h(tag: string, props: Props = {}, ...kids: (Node | string | null)[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'class') el.className = String(v);
    else if (typeof v === 'boolean') { if (v) el.setAttribute(k, ''); }
    else el.setAttribute(k, v);
  }
  for (const kid of kids) if (kid !== null) el.append(kid);
  return el;
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

function heartIcon(full: boolean): HTMLElement {
  const span = h('span', { class: full ? 'heart' : 'heart lost', 'aria-hidden': 'true' });
  span.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.5 2.3 4 6.4 4c2.3 0 3.8 1.3 5.6 3.4C13.8 5.3 15.3 4 17.6 4 21.7 4 23.6 8.5 22 11.7 19.5 16.4 12 21 12 21z"/></svg>';
  return span;
}

function muteButton(): HTMLElement {
  const btn = h('button', { class: 'icon-btn', 'aria-label': 'Sound on or off' });
  const paint = () => { btn.textContent = progress.muted ? '🔇' : '🔊'; };
  paint();
  btn.addEventListener('click', () => {
    progress.muted = !progress.muted;
    setMuted(progress.muted);
    save();
    paint();
    if (progress.muted) stopSpeaking();
  });
  return btn;
}

// --- title screen ----------------------------------------------------------

/** "Level 2 · 1 of 3 robots beaten", plus a little progress bar. */
function levelBadge(): HTMLElement {
  const won = progress.battlesWon;
  const done = beatenThisLevel(won);
  return h('div', { class: 'level-badge' },
    h('div', { class: 'level-num' }, `Level ${levelFor(won)}`),
    h('div', { class: 'level-bar', 'aria-hidden': 'true' },
      ...Array.from({ length: BATTLES_PER_LEVEL }, (_, i) => h('span', { class: i < done ? 'step done' : 'step' })),
    ),
    h('div', { class: 'level-text' }, `${done} of ${BATTLES_PER_LEVEL} robots beaten`),
  );
}

function settingsButton(): HTMLElement {
  return h('button', { class: 'icon-btn', 'aria-label': 'Grown-ups: settings', onClick: showSettings }, '⚙️');
}

/** A grown-up panel for clearing progress, with an in-app confirm. */
function showSettings(): void {
  sfx.tap();
  const box = h('div', { class: 'overlay-box' });
  const close = () => box.parentElement?.remove();
  const ask = () => box.replaceChildren(
    h('h2', {}, 'Clear all progress?'),
    h('p', {}, 'This clears levels, robots beaten, missed questions and the name. It can’t be undone.'),
    h('div', { class: 'btn-row' },
      h('button', { class: 'big-btn go', onClick: close }, 'Cancel'),
      h('button', {
        class: 'big-btn danger', onClick: () => {
          resetProgress(progress);
          save();
          showTitle();
        },
      }, 'Clear'),
    ),
  );
  box.append(
    h('h2', {}, 'Grown-ups'),
    h('p', { class: 'small' }, 'Progress is saved on this device only.'),
    h('div', { class: 'btn-row' },
      h('button', { class: 'big-btn go', onClick: close }, 'Back'),
      h('button', { class: 'big-btn danger', onClick: ask }, 'Reset progress'),
    ),
  );
  app.querySelector('.title-screen')?.append(h('div', { class: 'overlay' }, box));
}

function showTitle(): void {
  stopSpeaking();
  const design = robotFor(progress.battlesWon);
  const robot = new Robot(design);
  const name = h('input', {
    class: 'name-input', type: 'text', maxlength: '20', placeholder: 'Your name (optional)',
    autocomplete: 'off', 'aria-label': 'Your name (optional)',
  }) as HTMLInputElement;
  name.value = progress.playerName;
  name.addEventListener('change', () => {
    progress.playerName = name.value.trim();
    save();
  });

  app.replaceChildren(
    h('div', { class: 'title-screen' },
      h('div', { class: 'title-robot' }, robot.el),
      h('div', { class: 'title-text' },
        h('h1', {}, 'Word Bots'),
        h('p', { class: 'tagline' }, 'Beat the robot with spelling, facts and sums!'),
        name,
        h('button', {
          class: 'big-btn go', onClick: () => {
            progress.playerName = name.value.trim();
            save();
            sfx.tap();
            startBattle();
          },
        }, 'Fight!'),
        levelBadge(),
        h('p', { class: 'wins' }, `Next up: ${design.name}`),
      ),
      h('div', { class: 'corner' }, settingsButton(), muteButton()),
    ),
  );
}

// --- battle ----------------------------------------------------------------

interface Battle {
  design: RobotDesign;
  state: BattleState;
  dealer: ChallengeDealer;
  robot: Robot;
  card: HTMLElement;
  heartsEl: HTMLElement;
  hpEl: HTMLElement;
  bubble: HTMLElement;
  hearBtn: HTMLButtonElement;
  current: Challenge | null;
  over: boolean;
}

let battle: Battle;

function startBattle(): void {
  stopSpeaking();
  const design = robotFor(progress.battlesWon);
  const robot = new Robot(design);
  const hearBtn = h('button', { class: 'hear-btn', onClick: hearIt }) as HTMLButtonElement;
  battle = {
    design,
    state: newBattle(design.hp),
    dealer: new ChallengeDealer(progress, Math.random),
    robot,
    card: h('div', { class: 'card' }),
    heartsEl: h('div', { class: 'hearts', 'aria-label': 'Your hearts' }),
    hpEl: h('div', { class: 'hp', 'aria-label': 'Robot energy' }),
    bubble: h('div', { class: 'bubble hidden' }),
    hearBtn,
    current: null,
    over: false,
  };

  app.replaceChildren(
    h('div', { class: 'battle' },
      h('header', { class: 'topbar' },
        battle.heartsEl,
        h('div', { class: 'level-chip' }, `Level ${levelFor(progress.battlesWon)}`),
        h('div', { class: 'top-actions' },
          hearBtn,
          muteButton(),
          h('button', { class: 'icon-btn', 'aria-label': 'Home', onClick: showTitle }, '🏠'),
        ),
      ),
      h('main', { class: 'arena' },
        h('section', { class: 'robot-side' },
          h('div', { class: 'robot-name' }, design.name),
          battle.hpEl,
          battle.bubble,
          robot.el,
        ),
        h('section', { class: 'card-side' }, battle.card),
      ),
    ),
  );
  paintStatus();
  say(pick(design.greetings));
  nextChallenge();
}

function paintStatus(): void {
  const { state } = battle;
  battle.heartsEl.replaceChildren(
    ...Array.from({ length: PLAYER_HEARTS }, (_, i) => heartIcon(i < state.hearts)),
  );
  battle.hpEl.replaceChildren(
    ...Array.from({ length: battle.design.hp }, (_, i) => h('span', { class: i < state.robotHp ? 'pip' : 'pip empty' })),
  );
  const ok = canSpeak() && state.readsLeft > 0 && !battle.over;
  battle.hearBtn.disabled = !ok;
  battle.hearBtn.textContent = `🗣️ Hear it (${state.readsLeft})`;
}

function say(text: string, ms = 2200): void {
  const b = battle.bubble;
  b.textContent = text;
  b.classList.remove('hidden');
  window.clearTimeout(Number(b.dataset.timer));
  b.dataset.timer = String(window.setTimeout(() => b.classList.add('hidden'), ms));
}

function spokenText(c: Challenge): string {
  if (c.type === 'spelling') return c.word.clue;
  if (c.type === 'sum') return sumSpoken(c.sum);
  return c.fact.kind === 'tf' ? `${c.fact.question} True or false?` : c.fact.question;
}

function hearIt(): void {
  if (!battle.current || battle.state.readsLeft <= 0 || battle.over) return;
  battle.state.readsLeft--;
  speak(spokenText(battle.current));
  paintStatus();
}

function nextChallenge(): void {
  if (battle.over) return;
  stopSpeaking();
  const c = battle.dealer.next();
  battle.current = c;
  if (c.type === 'spelling') renderSpelling(c);
  else if (c.type === 'fact') {
    const label = c.fact.kind === 'tf' ? 'True or false?' : 'Quiz!';
    renderChoices(label, c.fact.question, c.options, c.fact.answer, c.fact.kind === 'tf');
  } else {
    renderChoices('Sum!', sumText(c.sum), c.sum.options.map(String), String(c.sum.answer), false, true);
  }
}

/**
 * Applies a right or wrong answer; `damage` is how many energy pips a right
 * answer knocks off. Resolves to true if the battle carries on.
 */
async function resolve(correct: boolean, damage = 1): Promise<boolean> {
  const { state, robot } = battle;
  recordAnswer(progress, battle.current!.id, correct);
  save();
  if (correct) {
    state.robotHp = Math.max(0, state.robotHp - damage);
    sfx.zap();
    robot.play('hit');
    say(damage > 1 ? 'Double hit! Bzzzt!' : pick(OUCH), damage > 1 ? 1500 : 900);
  } else {
    state.hearts--;
    sfx.clunk();
    robot.play('attack');
    app.querySelector('.battle')?.classList.remove('shake');
    void (app.querySelector('.battle') as HTMLElement | null)?.offsetWidth;
    app.querySelector('.battle')?.classList.add('shake');
  }
  paintStatus();
  if (state.robotHp <= 0) {
    battle.over = true;
    paintStatus();
    await wait(800);
    win();
    return false;
  }
  if (state.hearts <= 0) {
    battle.over = true;
    paintStatus();
    await wait(800);
    lose();
    return false;
  }
  return true;
}

function nextButton(): HTMLElement {
  return h('button', { class: 'big-btn next', onClick: () => { sfx.tap(); nextChallenge(); } }, 'Next ▶');
}

// --- multiple choice (facts and sums) --------------------------------------

function renderChoices(label: string, prompt: string, options: string[], answer: string, trueFalse: boolean, isSum = false): void {
  const buttons = options.map((opt) =>
    h('button', { class: `choice${trueFalse ? ' tf tf-' + opt.toLowerCase() : ''}` }, opt) as HTMLButtonElement,
  );
  const footer = h('div', { class: 'card-footer' });
  buttons.forEach((btn, i) =>
    btn.addEventListener('click', async () => {
      buttons.forEach((b) => (b.disabled = true));
      const right = options[i] === answer;
      btn.classList.add(right ? 'right' : 'wrong');
      if (!right) buttons[options.indexOf(answer)].classList.add('right');
      const carryOn = await resolve(right);
      if (!carryOn) return;
      if (right) {
        await wait(900);
        nextChallenge();
      } else {
        footer.replaceChildren(h('p', { class: 'reveal' }, `The answer is: ${answer}`), nextButton());
      }
    }),
  );
  battle.card.replaceChildren(
    h('div', { class: 'label' }, label),
    h('p', { class: isSum ? 'prompt sum-prompt' : 'prompt' }, prompt),
    h('div', { class: `choices${trueFalse ? ' two' : ''}` }, ...buttons),
    footer,
  );
}

// --- spelling ---------------------------------------------------------------

function renderSpelling(c: Extract<Challenge, { type: 'spelling' }>): void {
  const word = c.word.word;
  const tiles = makeTiles(word, Math.random);
  /** slot index -> tile index (or null) */
  const slots: (number | null)[] = Array(word.length).fill(null);
  const locked: boolean[] = Array(word.length).fill(false);
  /** Slots revealed by a hint (shown in a different colour). */
  const hinted: boolean[] = Array(word.length).fill(false);
  let hintsLeft = hintsFor(word);
  let attempts = 0;
  let done = false;

  const slotRow = h('div', { class: 'slots' });
  const tray = h('div', { class: 'tray' });
  const message = h('p', { class: 'spell-msg' });
  const check = h('button', { class: 'big-btn check' }, 'Check ✔') as HTMLButtonElement;
  const hint = h('button', { class: 'big-btn hint' }) as HTMLButtonElement;
  const footer = h('div', { class: 'card-footer' }, message, hint, check);
  // Tile size adapts so even the longest word fits on one row.
  for (const row of [slotRow, tray]) row.style.setProperty('--n', String(Math.max(word.length, 5)));

  const inSlot = (t: number) => slots.includes(t);
  const letters = () => slots.map((t) => (t === null ? null : tiles[t]));

  function place(tile: number, slot?: number): void {
    if (done) return;
    if (slot === undefined) slot = slots.findIndex((s, i) => s === null && !locked[i]);
    if (slot < 0 || locked[slot]) return paint();
    const from = slots.indexOf(tile);
    if (from >= 0) slots[from] = null;
    slots[slot] = tile; // any tile already there goes back to the tray
    sfx.tap();
    paint();
  }

  function unplace(slot: number): void {
    if (done || locked[slot] || slots[slot] === null) return;
    slots[slot] = null;
    sfx.tap();
    paint();
  }

  function paint(revealWord = false): void {
    slotRow.replaceChildren(
      ...word.split('').map((ch, i) => {
        const t = slots[i];
        const el = h('div', {
          class: `slot${locked[i] ? ' locked' : ''}${hinted[i] && !revealWord ? ' hinted' : ''}${t !== null ? ' filled' : ''}`,
          'data-slot': String(i),
        }, revealWord ? ch : t !== null ? tiles[t] : '');
        if (revealWord) el.classList.add('locked');
        if (t !== null && !revealWord && !locked[i]) attachDrag(el, t, () => unplace(i));
        return el;
      }),
    );
    tray.style.visibility = revealWord ? 'hidden' : '';
    tray.replaceChildren(
      ...tiles.map((letter, t) => {
        if (inSlot(t)) return h('div', { class: 'tile ghost' });
        const el = h('div', { class: 'tile' }, letter);
        attachDrag(el, t, () => place(t));
        return el;
      }),
    );
    check.disabled = done || slots.some((s) => s === null);
    hint.textContent = `💡 Hint (${hintsLeft})`;
    hint.disabled = done || hintsLeft <= 0 || pickHint(word, locked, letters(), Math.random) === null;
  }

  /** Puts one right letter (a consonant if possible) in its slot and locks it. */
  function giveHint(): void {
    if (done || hintsLeft <= 0) return;
    const slot = pickHint(word, locked, letters(), Math.random);
    if (slot === null) return;
    const lockedTiles = new Set(slots.filter((t, i) => t !== null && locked[i]));
    const candidates = tiles.map((_, t) => t).filter((t) => tiles[t] === word[slot] && !lockedTiles.has(t));
    const tile = candidates.find((t) => !inSlot(t)) ?? candidates[0];
    if (tile === undefined) return;
    const from = slots.indexOf(tile);
    if (from >= 0) slots[from] = null;
    slots[slot] = tile; // any tile already there goes back to the tray
    locked[slot] = true;
    hinted[slot] = true;
    hintsLeft--;
    sfx.tap();
    paint();
  }
  hint.addEventListener('click', giveHint);

  /** Drag a tile onto a slot, or just tap it. */
  function attachDrag(el: HTMLElement, tile: number, onTap: () => void): void {
    el.addEventListener('pointerdown', (down) => {
      if (done) return;
      down.preventDefault();
      el.setPointerCapture(down.pointerId);
      const rect = el.getBoundingClientRect();
      let dragging = false;
      const move = (e: PointerEvent) => {
        const dx = e.clientX - down.clientX, dy = e.clientY - down.clientY;
        if (!dragging && Math.hypot(dx, dy) > 8) {
          dragging = true;
          el.classList.add('dragging');
          el.style.width = `${rect.width}px`;
          el.style.height = `${rect.height}px`;
        }
        if (dragging) {
          el.style.left = `${rect.left + dx}px`;
          el.style.top = `${rect.top + dy}px`;
        }
      };
      const up = (e: PointerEvent) => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        if (!dragging) return onTap();
        const target = document.elementsFromPoint(e.clientX, e.clientY)
          .find((n) => n instanceof HTMLElement && n.dataset.slot !== undefined) as HTMLElement | undefined;
        if (target) place(tile, Number(target.dataset.slot));
        else if (inSlot(tile)) unplace(slots.indexOf(tile));
        else paint();
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  check.addEventListener('click', async () => {
    if (done || slots.some((s) => s === null)) return;
    const placed = letters();
    if (isSpelt(word, placed)) {
      done = true;
      word.split('').forEach((_, i) => (locked[i] = true));
      // Right first time with no hints: a double hit.
      const perfect = attempts === 0 && hintsLeft === hintsFor(word);
      message.textContent = perfect ? 'Perfect! Double hit!' : 'Brilliant!';
      paint();
      if (await resolve(true, perfect ? 2 : 1)) {
        await wait(900);
        nextChallenge();
      }
      return;
    }
    attempts++;
    if (attempts === 1) {
      // Keep the right letters (they go green); send the rest back to the tray.
      markSlots(word, placed).forEach((ok, i) => {
        if (ok) locked[i] = true;
        else slots[i] = null;
      });
      message.textContent = 'Nearly! Green letters are right. Have another go.';
      sfx.clunk();
      slotRow.classList.remove('wobble');
      void slotRow.offsetWidth;
      slotRow.classList.add('wobble');
      paint();
      return;
    }
    done = true;
    message.textContent = `It is spelt: ${word}`;
    paint(true);
    if (await resolve(false)) footer.replaceChildren(message, nextButton());
  });

  battle.card.replaceChildren(
    h('div', { class: 'label' }, 'Spell it!'),
    h('p', { class: 'prompt' }, c.word.clue),
    slotRow,
    tray,
    footer,
  );
  paint();
}

// --- end of battle ----------------------------------------------------------

function overlay(...kids: (Node | string)[]): void {
  app.querySelector('.battle')?.append(h('div', { class: 'overlay' }, h('div', { class: 'overlay-box' }, ...kids)));
}

function win(): void {
  const levelUp = levelsUpAfterWin(progress.battlesWon);
  progress.battlesWon++;
  save();
  sfx.victory();
  battle.robot.play('defeated');
  const who = progress.playerName ? `Well done, ${progress.playerName}!` : 'Well done!';
  const next = robotFor(progress.battlesWon);
  const done = beatenThisLevel(progress.battlesWon);
  overlay(
    h('h2', {}, levelUp ? 'Level up!' : 'Victory!'),
    h('p', {}, `${who} You beat ${battle.design.name}!`),
    h('p', { class: 'small' }, levelUp
      ? `You are now on Level ${levelFor(progress.battlesWon)}. Watch out, ${next.name} is coming!`
      : `${done} of ${BATTLES_PER_LEVEL} robots beaten on Level ${levelFor(progress.battlesWon)}`),
    h('button', { class: 'big-btn go', onClick: () => { sfx.tap(); startBattle(); } }, 'Next battle ▶'),
  );
}

function lose(): void {
  sfx.lose();
  battle.robot.play('taunt');
  say(pick([...battle.design.taunts, ...TAUNTS]), 4000);
  overlay(
    h('h2', {}, 'Out of hearts!'),
    h('p', {}, `${battle.design.name} won this time. You can beat it!`),
    h('button', { class: 'big-btn go', onClick: () => { sfx.tap(); startBattle(); } }, 'Try again ↻'),
  );
}

// --- start ------------------------------------------------------------------

showTitle();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline support is a bonus */ });
  });
}
