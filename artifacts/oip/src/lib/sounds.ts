let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function ramp(gain: GainNode, values: [number, number][], startTime: number) {
  values.forEach(([v, t]) => gain.gain.linearRampToValueAtTime(v, startTime + t));
}

export function playClick() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.06);
    gain.gain.setValueAtTime(0, ac.currentTime);
    ramp(gain, [[0.06, 0.005], [0, 0.07]], ac.currentTime);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.08);
  } catch {}
}

export function playSuccess() {
  try {
    const ac = getCtx();
    const freqs = [523, 659, 784];
    freqs.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      const t = ac.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, t);
      ramp(gain, [[0.05, 0.01], [0, 0.18]], t);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  } catch {}
}

export function playAlert() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ac.currentTime);
    osc.frequency.setValueAtTime(330, ac.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ac.currentTime);
    ramp(gain, [[0.07, 0.01], [0.07, 0.09], [0, 0.18]], ac.currentTime);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.2);
  } catch {}
}

export function playNav() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ac.currentTime + 0.05);
    gain.gain.setValueAtTime(0, ac.currentTime);
    ramp(gain, [[0.04, 0.005], [0, 0.08]], ac.currentTime);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.09);
  } catch {}
}
