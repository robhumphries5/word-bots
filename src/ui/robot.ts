// The enemy: a cross little castle-headed robot, drawn and animated in code.

const SVG = `
<svg class="robot-svg" viewBox="0 0 200 240" aria-hidden="true">
  <defs>
    <linearGradient id="metal" x1="0" x2="1">
      <stop offset="0" stop-color="#b9c3e3"/><stop offset="1" stop-color="#7f8bb0"/>
    </linearGradient>
  </defs>
  <g class="r-body">
    <!-- legs -->
    <rect x="62" y="196" width="22" height="34" rx="6" fill="#59618a"/>
    <rect x="116" y="196" width="22" height="34" rx="6" fill="#59618a"/>
    <rect x="54" y="224" width="38" height="12" rx="6" fill="#3b4268"/>
    <rect x="108" y="224" width="38" height="12" rx="6" fill="#3b4268"/>
    <!-- arms -->
    <g class="r-arm-l"><rect x="22" y="128" width="20" height="56" rx="10" fill="url(#metal)"/><circle cx="32" cy="188" r="12" fill="#59618a"/></g>
    <g class="r-arm-r"><rect x="158" y="128" width="20" height="56" rx="10" fill="url(#metal)"/><circle cx="168" cy="188" r="12" fill="#59618a"/></g>
    <!-- torso with a chequered chest panel -->
    <rect x="40" y="120" width="120" height="84" rx="16" fill="url(#metal)"/>
    <g transform="translate(76 136)">
      <rect width="48" height="48" rx="4" fill="#2a3158"/>
      <rect x="0" y="0" width="12" height="12" fill="#e9ecf7"/><rect x="24" y="0" width="12" height="12" fill="#e9ecf7"/>
      <rect x="12" y="12" width="12" height="12" fill="#e9ecf7"/><rect x="36" y="12" width="12" height="12" fill="#e9ecf7"/>
      <rect x="0" y="24" width="12" height="12" fill="#e9ecf7"/><rect x="24" y="24" width="12" height="12" fill="#e9ecf7"/>
      <rect x="12" y="36" width="12" height="12" fill="#e9ecf7"/><rect x="36" y="36" width="12" height="12" fill="#e9ecf7"/>
    </g>
    <rect x="88" y="108" width="24" height="16" fill="#59618a"/>
    <!-- castle head -->
    <g class="r-head">
      <rect x="40" y="26" width="24" height="24" rx="3" fill="url(#metal)"/>
      <rect x="72" y="26" width="24" height="24" rx="3" fill="url(#metal)"/>
      <rect x="104" y="26" width="24" height="24" rx="3" fill="url(#metal)"/>
      <rect x="136" y="26" width="24" height="24" rx="3" fill="url(#metal)"/>
      <rect x="40" y="42" width="120" height="76" rx="10" fill="url(#metal)"/>
      <rect x="52" y="54" width="96" height="44" rx="10" fill="#2a3158"/>
      <g class="r-eyes">
        <circle cx="78" cy="76" r="11" fill="#ff5a5a"/>
        <circle cx="122" cy="76" r="11" fill="#ff5a5a"/>
        <circle cx="78" cy="76" r="4" fill="#ffd0d0"/>
        <circle cx="122" cy="76" r="4" fill="#ffd0d0"/>
      </g>
      <!-- cross eyebrows -->
      <path class="r-brow" d="M62 58 l28 10" stroke="#1b2140" stroke-width="7" stroke-linecap="round"/>
      <path class="r-brow" d="M138 58 l-28 10" stroke="#1b2140" stroke-width="7" stroke-linecap="round"/>
      <rect class="r-mouth" x="80" y="104" width="40" height="8" rx="4" fill="#2a3158"/>
    </g>
  </g>
  <g class="r-zap" opacity="0">
    <path d="M110 20 L80 100 L105 100 L75 190 L135 85 L108 85 L130 20 Z" fill="#ffe14d" stroke="#fff" stroke-width="4"/>
  </g>
</svg>`;

export type RobotMood = 'idle' | 'hit' | 'attack' | 'taunt' | 'defeated';

export class Robot {
  readonly el: HTMLElement;

  constructor() {
    this.el = document.createElement('div');
    this.el.className = 'robot idle';
    this.el.innerHTML = SVG;
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
