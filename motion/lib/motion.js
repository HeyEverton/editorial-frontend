// lib/motion.js — primitivas de movimento. Tudo é função pura do tempo (seek(t) determinístico).
// Script clássico (não-módulo) para funcionar via file:// no Chromium headless; expõe window.M.
(function (root) {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const inv = (a, b, x) => clamp((x - a) / (b - a));

  // Mola amortecida em forma fechada, 0 → 1. k = rigidez, d = amortecimento.
  function spring(t, k = 170, d = 26) {
    if (t <= 0) return 0;
    const w0 = Math.sqrt(k), z = d / (2 * w0);
    if (z < 1) {
      const wd = w0 * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
    }
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  }

  // Presets de mola (do curso): UI ágil, padrão, pesado, brincalhão.
  const S = {
    snappy: [320, 30],  // botões, toggles, bordas de ataque
    ui: [220, 26],      // cards, containers, câmera
    heavy: [120, 24],   // tipografia grande, logo
    playful: [260, 14], // overshoot visível
  };
  const sp = (t, kind = 'ui') => spring(t, ...S[kind]);

  // Valor com vários alvos = soma de uma mola por mudança. keys: [[tempo, valor], ...]
  function track(t, keys, k = 170, d = 26) {
    let v = keys[0][1];
    for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * spring(t - keys[i][0], k, d);
    return v;
  }
  // Igual a track, mas para objetos {x, y, w...}
  function trackObj(t, keys, k, d) {
    const out = {};
    for (const p of Object.keys(keys[0][1])) out[p] = track(t, keys.map(([tt, o]) => [tt, o[p]]), k, d);
    return out;
  }

  // Indicador de aba que estica: borda de ataque mais rígida que a de fuga.
  function indicator(t, stops, width = 120) {
    const lead = track(t, stops, 320, 30);
    const trail = track(t, stops, 140, 22);
    return { left: Math.min(lead, trail), right: Math.max(lead, trail) + width };
  }

  // Texto dentro de uma caixa que muda: entra depois da mudança começar, sai antes da próxima.
  function swapAlpha(t, tIn, tOut) {
    return Math.min(clamp((t - tIn - 0.08) / 0.12), clamp((tOut - 0.1 - t) / 0.1));
  }

  const loopT = (t, dur) => ((t % dur) + dur) % dur;

  // Ruído com semente (mulberry32) — nunca Math.random.
  function rng(seed) {
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Easings só para coisas que não são "movimento físico" (opacidade, máscaras).
  const easeOut = (p) => 1 - Math.pow(1 - clamp(p), 3);
  const easeInOut = (p) => { p = clamp(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };

  root.M = { clamp, lerp, inv, spring, sp, S, track, trackObj, indicator, swapAlpha, loopT, rng, easeOut, easeInOut };
})(typeof window !== 'undefined' ? window : globalThis);
