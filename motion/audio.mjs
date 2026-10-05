// node audio.mjs out/ad_1080x1920_cues.json  → out/ad_1080x1920_music.wav + beats.json
// Trilha original sintetizada em código (sem samples), travada no grid de BPM do filme,
// mais SFX de UI nos cues que a própria animação declara (window.FILM.cues).
import { readFileSync, writeFileSync } from 'node:fs';

const cuesFile = process.argv[2];
const meta = JSON.parse(readFileSync(cuesFile, 'utf8'));
const SR = 48000, DUR = meta.dur + 0.6, N = Math.ceil(DUR * SR);
const BPM = meta.bpm, BEAT = 60 / BPM, BAR = BEAT * 4;
const mood = meta.mood || 'ad';
const L = new Float32Array(N), R = new Float32Array(N);
const send = new Float32Array(N);              // envio mono para o reverb

// ── utilidades ──
const TAU = Math.PI * 2;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;
function add(t0, len, fn, gain = 1, pan = 0, rev = 0) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(len * SR);
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < n; i++) {
    const j = s0 + i; if (j < 0 || j >= N) continue;
    const v = fn(i / SR, i);
    L[j] += v * gl; R[j] += v * gr; send[j] += v * rev * gain;
  }
}
// filtro state-variable (Chamberlin) com cutoff variável
function svf() { let lp = 0, bp = 0; return (x, fc, q = 0.7) => { const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR); const hp = x - lp - q * bp; bp += f * hp; lp += f * bp; return { lp, bp, hp }; }; }

// ── instrumentos ──
const kick = (g = 1) => (t) => (Math.sin(TAU * (45 * t + (110 / 28) * (1 - Math.exp(-28 * t)))) * Math.exp(-7 * t) + (t < 0.004 ? noise() * 0.4 : 0)) * g;
const clap = () => { const f = svf(); return (t) => { const env = Math.exp(-22 * t) + (t > 0.012 ? 0.6 * Math.exp(-30 * (t - 0.012)) : 0); return f(noise(), 1400, 0.9).bp * env * 1.6 + Math.sin(TAU * 190 * t) * Math.exp(-28 * t) * 0.3; }; };
const hat = (open = false) => { const f = svf(); return (t) => f(noise(), 8000, 0.5).hp * Math.exp(-(open ? 14 : 55) * t); };
function bass(m, len) { const f = svf(); const fr = mtof(m); let ph = 0; return (t) => { ph += fr / SR; const saw = 2 * (ph % 1) - 1; const env = Math.min(1, t * 200) * Math.exp(-2.2 * t) * (t > len - 0.02 ? Math.max(0, (len - t) / 0.02) : 1); return f(saw, 180 + 900 * Math.exp(-9 * t), 0.4).lp * env + Math.sin(TAU * fr * t) * env * 0.5; }; }
// "piano de feltro": parciais harmônicas com decaimento por parcial (sem pad genérico)
function keys(m, decay = 2.5) { const fr = mtof(m); return (t) => { let v = 0; for (let k = 1; k <= 6; k++) v += Math.sin(TAU * fr * k * t * (1 + 0.0008 * k * k)) * Math.exp(-(decay + k * 1.6) * t) / Math.pow(k, 1.4); return v * Math.min(1, t * 400) * 0.6; }; }
function bell(m) { const fr = mtof(m); return (t) => (Math.sin(TAU * fr * t) + 0.4 * Math.sin(TAU * fr * 2.76 * t) * Math.exp(-6 * t) + 0.2 * Math.sin(TAU * fr * 5.4 * t) * Math.exp(-12 * t)) * Math.exp(-3 * t) * Math.min(1, t * 800); }

// ── SFX ──
const SFX = {
  impact: (g) => (t0) => { add(t0, 1.4, (t) => Math.sin(TAU * (38 * t + 6 * (1 - Math.exp(-20 * t)))) * Math.exp(-3.2 * t), 0.9 * g); const f = svf(); add(t0, 0.5, (t) => f(noise(), 900 * Math.exp(-4 * t) + 120).lp * Math.exp(-7 * t), 0.5 * g, 0, 0.4); },
  drop: (g) => (t0) => { SFX.impact(1.2 * g)(t0); const f = svf(); add(t0, 1.6, (t) => f(noise(), 6000, 0.6).hp * Math.exp(-2.5 * t), 0.12 * g, 0, 0.6); },
  click: (g) => (t0) => { add(t0, 0.05, (t) => (Math.sin(TAU * 1900 * t) * Math.exp(-120 * t) + noise() * Math.exp(-900 * t) * 0.6), 0.45 * g, 0.1, 0.1); },
  tick: (g) => (t0) => { add(t0, 0.02, (t) => Math.sin(TAU * 4200 * t) * Math.exp(-300 * t), 0.18 * g, -0.2); },
  pop: (g) => (t0) => { add(t0, 0.12, (t) => Math.sin(TAU * (380 * t + 520 / 40 * (1 - Math.exp(-40 * t)))) * Math.exp(-30 * t), 0.5 * g, (rnd() - 0.5) * 0.6, 0.25); },
  whoosh: (g, len = 0.55) => (t0) => { const f = svf(); add(t0 - len * 0.6, len, (t) => { const p = t / len; return f(noise(), 300 + 5000 * Math.sin(Math.PI * p), 0.35).bp * Math.sin(Math.PI * p) ** 2; }, 0.55 * g, 0, 0.3); },
  swoosh: (g) => SFX.whoosh(0.8 * g, 0.3),
  scratch: (g) => (t0) => { const f = svf(); add(t0, 0.35, (t) => f(noise(), 2400 - 1600 * t, 0.25).bp * Math.exp(-6 * t) * (1 + 0.5 * Math.sin(TAU * 38 * t)), 0.6 * g, 0.15); },
  paper: (g) => (t0) => { const f = svf(); add(t0, 0.5, (t) => f(noise(), 3200, 0.3).bp * Math.exp(-7 * t) * (0.6 + 0.4 * Math.sin(TAU * 23 * t)), 0.5 * g); },
  riser: (g) => (t0) => { const f = svf(); const len = 1.4; add(t0 - 0.2, len, (t) => { const p = t / len; return f(noise(), 300 + 7000 * p * p, 0.3).bp * p * p + Math.sin(TAU * (200 * t + 300 * t * t)) * p * 0.15; }, 0.5 * g, 0, 0.5); },
  chime: (g) => (t0) => { add(t0, 2.5, bell(88), 0.18 * g, -0.3, 0.7); add(t0 + 0.09, 2.5, bell(93), 0.15 * g, 0.3, 0.7); },
  type: (g) => SFX.tick(g),
};

// ── trilha ──
// Am – F – C – G (graus em lá menor), um acorde por compasso
const PROG = [[57, 60, 64], [53, 57, 60], [48, 52, 55, 60], [55, 59, 62]];
const ROOT = [45, 41, 48, 43];
// níveis por seção (0..1) — o anúncio tem gancho seco, drop, respiro e final; o tutorial é contínuo e calmo
function section(t) {
  if (mood === 'ad') {
    if (t < 3) return { kick: 0, clap: 0, hat: 0, bass: 0.35, arp: 0, keys: 0.9 };
    if (t < 18) return { kick: 1, clap: 1, hat: 1, bass: 1, arp: 1, keys: 0.5 };
    if (t < 21) return { kick: 0, clap: 0, hat: 0.5, bass: 0.6, arp: 1, keys: 0.8 };
    return { kick: 1, clap: 1, hat: 1, bass: 1, arp: 0.8, keys: 0.6 };
  }
  const intro = t < BAR * 2;
  return { kick: intro ? 0 : 0.45, clap: 0, hat: intro ? 0.2 : 0.55, bass: intro ? 0.4 : 0.75, arp: 0.85, keys: 0.6 };
}
const endT = meta.dur;
const nBeats = Math.floor(endT / BEAT);
for (let b = 0; b < nBeats; b++) {
  const t = b * BEAT, bar = Math.floor(b / 4), bi = b % 4, ch = bar % 4;
  const s = section(t);
  const lastBar = t >= endT - BAR;
  if (s.kick && !(mood === 'ad' && lastBar && bi > 0)) add(t, 0.6, kick(), 0.9 * s.kick);
  if (s.clap && (bi === 1 || bi === 3)) add(t, 0.3, clap(), 0.35 * s.clap, 0, 0.35);
  if (s.hat) { add(t + BEAT / 2, 0.15, hat(bi === 3 && mood === 'ad'), 0.16 * s.hat, 0.25); add(t + BEAT * 0.75, 0.08, hat(), 0.06 * s.hat, -0.25); }
  if (s.bass) { add(t + BEAT / 2, BEAT / 2, bass(ROOT[ch], BEAT / 2), 0.32 * s.bass); if (bi === 0) add(t, BEAT / 2, bass(ROOT[ch], BEAT / 2), 0.26 * s.bass); }
  if (s.keys && bi === 0) PROG[ch].forEach((m, k) => add(t + k * 0.012, BAR + 1, keys(m, 1.4), 0.11 * s.keys, (k - 1) * 0.3, 0.5));
  if (s.arp) {
    // arpejo em semicolcheias, notas do acorde uma oitava acima, padrão com semente
    for (let sx = 0; sx < 4; sx++) {
      const pick = [0, 2, 1, 2, 0, 1, 2, 1][(b * 4 + sx) % 8];
      if ((b * 4 + sx) % 3 === 2 && mood === 'tutorial') continue;
      const m = PROG[ch][pick % PROG[ch].length] + 12;
      add(t + sx * BEAT / 4, 0.6, keys(m, 6), 0.085 * s.arp, sx % 2 ? 0.35 : -0.35, 0.45);
    }
  }
}
// acorde final que fica soando
add(endT - BAR, BAR + 0.6, keys(45, 0.9), 0.14, 0, 0.6);
PROG[0].forEach((m, k) => add(endT - BAR + k * 0.02, BAR + 0.6, keys(m + 12, 1.2), 0.08, (k - 1) * 0.4, 0.6));

// ── SFX nos cues da animação ──
for (const c of meta.cues) { const f = SFX[c.type]; if (f) f(c.gain ?? 1)(c.t); else console.warn('sfx desconhecido', c.type); }

// ── reverb Schroeder no envio ──
(function reverb() {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, buf: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, buf: new Float32Array(d), i: 0 }));
  for (let n = 0; n < N; n++) {
    let x = send[n] * 0.3, y = 0;
    for (const c of combs) { const o = c.buf[c.i]; c.buf[c.i] = x + o * 0.8; c.i = (c.i + 1) % c.d; y += o; }
    for (const a of aps) { const o = a.buf[a.i]; const v = y + o * 0.5; a.buf[a.i] = v; a.i = (a.i + 1) % a.d; y = o - v * 0.5; }
    L[n] += y * 0.5; R[n] += y * 0.47;
  }
})();

// ── saída: fade final, saturação suave, WAV 16-bit ──
const fadeS = Math.floor((meta.dur - 0.4) * SR);
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVEfmt ', 8);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  const f = n > fadeS ? Math.max(0, 1 - (n - fadeS) / (SR * 1.0)) : 1;
  out.writeInt16LE(Math.round(Math.tanh(L[n] * 0.9) * f * 32000), 44 + n * 4);
  out.writeInt16LE(Math.round(Math.tanh(R[n] * 0.9) * f * 32000), 46 + n * 4);
}
const wav = cuesFile.replace('_cues.json', '_music.wav');
writeFileSync(wav, out);
writeFileSync(cuesFile.replace('_cues.json', '_beats.json'), JSON.stringify({
  bpm: BPM, beats: Array.from({ length: nBeats }, (_, i) => +(i * BEAT).toFixed(3)),
  downbeats: Array.from({ length: Math.ceil(nBeats / 4) }, (_, i) => +(i * BAR).toFixed(3)), hits: meta.cues.map((c) => c.t),
}, null, 1));
console.log('→', wav);
