// Sound effects made in code with Web Audio: no audio files needed.

let ctx: AudioContext | null = null;
let muted = false;

export const setMuted = (m: boolean) => { muted = m; };

function audio(): AudioContext | null {
  if (muted) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(type: OscillatorType, from: number, to: number, start: number, dur: number, vol = 0.2): void {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  tap: () => tone('sine', 660, 880, 0, 0.06, 0.08),
  zap: () => {
    tone('square', 1400, 180, 0, 0.25, 0.12);
    tone('sawtooth', 900, 120, 0.05, 0.25, 0.08);
  },
  clunk: () => {
    tone('triangle', 160, 60, 0, 0.3, 0.35);
    tone('square', 90, 50, 0.02, 0.2, 0.12);
  },
  victory: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone('square', f, f, i * 0.14, i === 3 ? 0.5 : 0.13, 0.1));
  },
  lose: () => {
    [392, 330, 262].forEach((f, i) => tone('triangle', f, f * 0.97, i * 0.22, 0.25, 0.2));
  },
};
