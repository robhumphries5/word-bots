// The enemies: cross little robots, drawn and animated in code (original art).

import type { HeadShape, RobotDesign } from '../game/levels';

let uid = 0;

/** Extra shapes drawn on or around the head. */
function headExtras(shape: HeadShape, fill: string, d: RobotDesign): string {
  switch (shape) {
    case 'castle':
      return [40, 72, 104, 136].map((x) => `<rect x="${x}" y="26" width="24" height="24" rx="3" fill="${fill}"/>`).join('');
    case 'antenna':
      return `<path d="M72 44 L58 10 M128 44 L142 10" stroke="${d.dark}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="58" cy="10" r="9" fill="${d.eye}"/><circle cx="142" cy="10" r="9" fill="${d.eye}"/>`;
    case 'dome':
      return `<path d="M40 70 A60 52 0 0 1 160 70 Z" fill="${fill}"/>
        <rect x="94" y="6" width="12" height="14" rx="4" fill="${d.dark}"/><circle cx="100" cy="6" r="7" fill="${d.eye}"/>`;
    case 'horns':
      return `<path d="M46 50 L30 6 L74 44 Z" fill="${d.dark}"/><path d="M154 50 L170 6 L126 44 Z" fill="${d.dark}"/>`;
    case 'box':
      // A square "mortarboard" hat with a tassel, for the professor.
      return `<path d="M100 8 L168 30 L100 50 L32 30 Z" fill="${d.panel}"/>
        <rect x="70" y="34" width="60" height="12" fill="${d.panel}"/>
        <path d="M100 30 L160 34 L160 62" stroke="${d.eye}" stroke-width="4" fill="none"/><circle cx="160" cy="64" r="6" fill="${d.eye}"/>
        <circle cx="36" cy="80" r="8" fill="${d.dark}"/><circle cx="164" cy="80" r="8" fill="${d.dark}"/>`;
    case 'crown':
      return `<path d="M48 46 L48 12 L72 30 L100 4 L128 30 L152 12 L152 46 Z" fill="#ffcf3f" stroke="#c99a12" stroke-width="3"/>
        <circle cx="100" cy="26" r="6" fill="#ff5a5a"/>`;
  }
}

function chest(d: RobotDesign): string {
  if (d.head === 'castle') {
    // Rook-Bot keeps its chequered chest panel.
    const squares = [[0, 0], [24, 0], [12, 12], [36, 12], [0, 24], [24, 24], [12, 36], [36, 36]]
      .map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="12" fill="#e9ecf7"/>`).join('');
    return `<g transform="translate(76 136)"><rect width="48" height="48" rx="4" fill="${d.panel}"/>${squares}</g>`;
  }
  return `<rect x="72" y="136" width="56" height="48" rx="10" fill="${d.panel}"/>
    <circle cx="100" cy="160" r="14" fill="${d.eye}" opacity="0.9"/>
    <circle cx="100" cy="160" r="6" fill="#fff" opacity="0.8"/>`;
}

function svg(d: RobotDesign): string {
  const id = `metal-${++uid}`;
  const metal = `url(#${id})`;
  return `
<svg class="robot-svg" viewBox="0 0 200 240" aria-hidden="true">
  <defs>
    <linearGradient id="${id}" x1="0" x2="1">
      <stop offset="0" stop-color="${d.light}"/><stop offset="1" stop-color="${d.dark}"/>
    </linearGradient>
  </defs>
  <g class="r-body">
    <rect x="62" y="196" width="22" height="34" rx="6" fill="${d.dark}"/>
    <rect x="116" y="196" width="22" height="34" rx="6" fill="${d.dark}"/>
    <rect x="54" y="224" width="38" height="12" rx="6" fill="${d.panel}"/>
    <rect x="108" y="224" width="38" height="12" rx="6" fill="${d.panel}"/>
    <g class="r-arm-l"><rect x="22" y="128" width="20" height="56" rx="10" fill="${metal}"/><circle cx="32" cy="188" r="12" fill="${d.dark}"/></g>
    <g class="r-arm-r"><rect x="158" y="128" width="20" height="56" rx="10" fill="${metal}"/><circle cx="168" cy="188" r="12" fill="${d.dark}"/></g>
    <rect x="40" y="120" width="120" height="84" rx="16" fill="${metal}"/>
    ${chest(d)}
    <rect x="88" y="108" width="24" height="16" fill="${d.dark}"/>
    <g class="r-head">
      ${headExtras(d.head, metal, d)}
      <rect x="40" y="42" width="120" height="76" rx="10" fill="${metal}"/>
      <rect x="52" y="54" width="96" height="44" rx="10" fill="${d.panel}"/>
      <g class="r-eyes">
        <circle cx="78" cy="76" r="11" fill="${d.eye}"/>
        <circle cx="122" cy="76" r="11" fill="${d.eye}"/>
        <circle cx="78" cy="76" r="4" fill="#fff" opacity="0.75"/>
        <circle cx="122" cy="76" r="4" fill="#fff" opacity="0.75"/>
      </g>
      <path class="r-brow" d="M62 58 l28 10" stroke="#1b2140" stroke-width="7" stroke-linecap="round"/>
      <path class="r-brow" d="M138 58 l-28 10" stroke="#1b2140" stroke-width="7" stroke-linecap="round"/>
      <rect class="r-mouth" x="80" y="104" width="40" height="8" rx="4" fill="${d.panel}"/>
    </g>
  </g>
  <g class="r-zap" opacity="0">
    <path d="M110 20 L80 100 L105 100 L75 190 L135 85 L108 85 L130 20 Z" fill="#ffe14d" stroke="#fff" stroke-width="4"/>
  </g>
</svg>`;
}

export type RobotMood = 'idle' | 'hit' | 'attack' | 'taunt' | 'defeated';

export class Robot {
  readonly el: HTMLElement;

  constructor(design: RobotDesign) {
    this.el = document.createElement('div');
    this.el.className = 'robot idle';
    this.el.innerHTML = svg(design);
  }

  play(mood: RobotMood): void {
    this.el.classList.remove('idle', 'hit', 'attack', 'taunt', 'defeated');
    // Force a reflow so the same animation can play twice in a row.
    void this.el.offsetWidth;
    this.el.classList.add(mood);
    if (mood === 'hit' || mood === 'attack' || mood === 'taunt') {
      window.setTimeout(() => {
        if (this.el.classList.contains(mood)) this.play('idle');
      }, 700);
    }
  }
}
