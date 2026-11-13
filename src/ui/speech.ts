// Read-aloud using the device's own voice, preferring British English.

let voice: SpeechSynthesisVoice | null = null;

function pickVoice(): void {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  voice =
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang.replace('_', '-').startsWith('en-GB')) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null;
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

if (canSpeak()) {
  pickVoice();
  window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export function speak(text: string): void {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/_{2,}/g, 'blank'));
  u.lang = 'en-GB';
  if (voice) u.voice = voice;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}
