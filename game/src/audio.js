// Sounds, made with the Web Audio oscillator — no audio files, nothing to
// load over the network. A find chimes a little higher with each find in a
// row; a miss buzzes low; a finished level plays a short fanfare. Everything
// is guarded: a browser with no audio just plays silent.

let context = null;

function audio() {
  if (context) return context;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    context = new AC();
  } catch {
    return null;
  }
  return context;
}

function tone(freq, at, dur, type, vol) {
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ac.currentTime + at);
    gain.gain.linearRampToValueAtTime(vol, ac.currentTime + at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  } catch {
    // Silent is fine.
  }
}

export function unlockAudio() {
  const ac = audio();
  if (ac && ac.state === 'suspended') ac.resume().catch(() => {});
}

export function playFind(streak) {
  const base = 620 * Math.pow(1.059, Math.min(streak, 10));
  tone(base, 0, 0.16, 'sine', 0.22);
  tone(base * 1.5, 0.07, 0.22, 'sine', 0.2);
}

export function playMiss() {
  tone(150, 0, 0.18, 'square', 0.08);
  tone(110, 0.06, 0.2, 'square', 0.07);
}

export function playWin() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.3, 'triangle', 0.2));
}

export function playClick() {
  tone(880, 0, 0.06, 'sine', 0.1);
}
