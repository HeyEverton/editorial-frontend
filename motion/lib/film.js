// lib/film.js — runtime comum dos filmes: canvas, assets, tipografia cinética, câmera sobre
// screenshots reais, cursor. Contrato: window.seek(t) pinta o quadro t. Nada de timers no render.
(function (root) {
  const { clamp, lerp, sp, spring, rng, easeOut } = root.M;
  const q = new URLSearchParams(location.search);
  const W = +(q.get('w') || 1920), H = +(q.get('h') || 1080);
  const c = document.getElementById('c');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const V = H > W * 1.2, SQ = !V && H > W * 0.8;      // vertical / quadrado / horizontal
  const U = Math.min(W, H) / 1080;                     // unidade de escala tipográfica

  // ── Paleta da marca (landing AE·Studio) + um acento ──
  const C = {
    ink: '#0A0A0A', black: '#000000', char: '#151515', paper: '#F7F5F0', white: '#FFFFFF',
    muted: '#7A7A7A', faint: '#B5B2AA', line: 'rgba(0,0,0,0.08)', lineInv: 'rgba(255,255,255,0.07)',
    gold: '#B8925A',   // acento único (vem do preset Classic Gold do produto)
  };
  const F = {
    serif: "'Playfair Display', serif", sans: "'Inter', sans-serif", label: "'Syne', sans-serif",
  };

  // ── Assets ──
  const IMG = {};
  function loadImages(map) {
    return Promise.all(Object.entries(map).map(([k, src]) => new Promise((res, rej) => {
      const im = new Image(); im.onload = () => { IMG[k] = im; res(); }; im.onerror = () => rej(new Error('img ' + src)); im.src = src;
    })));
  }

  // ── Grão de filme pré-gerado com semente (8 tiles, troca a 24 fps) ──
  const grain = [];
  (function () {
    const r = rng(42);
    for (let i = 0; i < 8; i++) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 256;
      const x = cv.getContext('2d'), d = x.createImageData(256, 256);
      for (let p = 0; p < d.data.length; p += 4) { const v = r() * 255; d.data[p] = d.data[p + 1] = d.data[p + 2] = v; d.data[p + 3] = 255; }
      x.putImageData(d, 0, 0); grain.push(cv);
    }
  })();
  function drawGrain(t, alpha = 0.05) {
    g.save(); g.globalAlpha = alpha; g.globalCompositeOperation = 'overlay';
    g.fillStyle = g.createPattern(grain[Math.floor(t * 24) % 8], 'repeat'); g.fillRect(0, 0, W, H); g.restore();
  }

  // ── Fundos com textura (grid e pontos da landing) ──
  function bg(color) { g.fillStyle = color; g.fillRect(0, 0, W, H); }
  function gridTex(size = 40 * U, color = C.line, ox = 0, oy = 0) {
    g.save(); g.strokeStyle = color; g.lineWidth = 1;
    g.beginPath();
    for (let x = ((ox % size) + size) % size; x < W; x += size) { g.moveTo(Math.round(x) + 0.5, 0); g.lineTo(Math.round(x) + 0.5, H); }
    for (let y = ((oy % size) + size) % size; y < H; y += size) { g.moveTo(0, Math.round(y) + 0.5); g.lineTo(W, Math.round(y) + 0.5); }
    g.stroke(); g.restore();
  }
  function dotTex(size = 22 * U, color = 'rgba(0,0,0,0.07)') {
    g.save(); g.fillStyle = color;
    for (let y = size / 2; y < H; y += size) for (let x = size / 2; x < W; x += size) g.fillRect(x, y, 1.6 * U, 1.6 * U);
    g.restore();
  }

  // ── Texto ──
  function font(size, fam = F.sans, weight = 400, italic = false) {
    return `${italic ? 'italic ' : ''}${weight} ${Math.round(size)}px ${fam}`;
  }
  function text(str, x, y, o = {}) {
    g.save();
    g.font = font(o.size || 32 * U, o.fam || F.sans, o.weight || 400, o.italic);
    g.letterSpacing = (o.ls || 0) + 'px';
    g.fillStyle = o.color || C.ink; g.globalAlpha *= (o.alpha ?? 1);
    g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic';
    g.fillText(str, x, y); g.restore();
  }
  function measure(str, o = {}) {
    g.save(); g.font = font(o.size || 32 * U, o.fam || F.sans, o.weight || 400, o.italic);
    g.letterSpacing = (o.ls || 0) + 'px'; const w = g.measureText(str).width; g.restore(); return w;
  }
  // Rótulo em caixa alta da marca (Syne espaçada)
  function label(str, x, y, o = {}) {
    text(str.toUpperCase(), x, y, { fam: F.label, weight: 700, size: o.size || 16 * U, ls: o.ls ?? 5 * U, color: o.color || C.muted, align: o.align, alpha: o.alpha });
  }

  // Tipografia cinética: cada palavra sobe de dentro de uma máscara da linha (mola pesada).
  // lines: [{ words:'Transforme estratégia', size, fam, weight, italic, color }], entra em t0, sai em t1.
  function kinetic(t, lines, x, y, o = {}) {
    const t0 = o.t0 ?? 0, t1 = o.t1 ?? 1e9, stagger = o.stagger ?? 0.06, align = o.align || 'left';
    let yy = y, idx = 0;
    for (const L of lines) {
      const size = L.size, lh = size * (L.lh || 1.08);
      const st = { size, fam: L.fam || F.serif, weight: L.weight || 400, italic: L.italic, ls: L.ls || 0 };
      const words = L.words.split(' ');
      const total = measure(L.words, st);
      let xx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
      const space = measure(' ', st);
      for (const w of words) {
        const ww = measure(w, st);
        const pin = sp(t - t0 - idx * stagger, o.kind || 'heavy');
        const pout = clamp((t - t1 + (o.outStagger ?? 0.02) * (lines.length * 3 - idx)) / 0.28);
        const off = (1 - pin) * size * 1.4 - easeOut(pout) * size * 1.4;
        g.save();
        g.beginPath(); g.rect(xx - size * 0.15, yy - size * 1.02, ww + size * 0.35, size * 1.4); g.clip();
        text(w, xx, yy + off, { ...st, color: L.color || o.color || C.ink, alpha: L.alpha ?? 1 });
        g.restore();
        xx += ww + space; idx++;
      }
      yy += lh;
    }
    return yy;
  }

  // Quebra de linha simples para parágrafos
  function wrap(str, maxW, o) {
    const out = []; let line = '';
    for (const w of str.split(' ')) {
      const test = line ? line + ' ' + w : w;
      if (measure(test, o) > maxW && line) { out.push(line); line = w; } else line = test;
    }
    if (line) out.push(line); return out;
  }

  // ── Formas ──
  function rrect(x, y, w, h, r) {
    g.beginPath(); g.roundRect(x, y, w, h, r);
  }
  function shadow(blur, oy, alpha) { g.shadowColor = `rgba(0,0,0,${alpha})`; g.shadowBlur = blur; g.shadowOffsetY = oy; }
  function noShadow() { g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0; }

  // ── "Tela": desenha a região `reg` de um screenshot dentro do retângulo `r` do canvas.
  // reg = { cx, cy, w } em pixels da imagem (altura sai do aspecto de r). Devolve o mapeador img→canvas.
  function screen(img, r, reg, o = {}) {
    const s = r.w / reg.w, rh = r.h / s;
    const sx = reg.cx - reg.w / 2, sy = reg.cy - rh / 2;
    g.save();
    if (o.shadow !== false) { shadow(o.shadowBlur ?? 80 * U, o.shadowY ?? 40 * U, o.shadowA ?? 0.28); }
    rrect(r.x, r.y, r.w, r.h, o.radius ?? 14 * U); g.fillStyle = o.fill || '#000'; g.fill(); noShadow();
    g.clip();
    if (o.blur) g.filter = `blur(${o.blur}px)`;
    g.globalAlpha = o.alpha ?? 1;
    g.drawImage(img, sx, sy, reg.w, rh, r.x, r.y, r.w, r.h);
    g.restore();
    return { x: (px) => r.x + (px - sx) * s, y: (py) => r.y + (py - sy) * s, s };
  }

  // ── Cursor (seta) + onda de clique ──
  function cursor(x, y, o = {}) {
    const s = (o.scale || 1) * 1.7 * U * (1 - 0.18 * (o.press || 0));
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = o.alpha ?? 1;
    shadow(8, 3, 0.35);
    g.beginPath();
    g.moveTo(0, 0); g.lineTo(0, 22); g.lineTo(5.5, 17); g.lineTo(9.5, 26); g.lineTo(13, 24.5); g.lineTo(9, 16); g.lineTo(16, 16); g.closePath();
    g.fillStyle = o.dark ? '#fff' : '#000'; g.fill(); noShadow();
    g.lineWidth = 1.6; g.strokeStyle = o.dark ? '#000' : '#fff'; g.stroke();
    g.restore();
  }
  function ripple(x, y, dt, color = C.gold) {
    if (dt < 0 || dt > 0.6) return;
    const p = easeOut(dt / 0.6);
    g.save(); g.globalAlpha = 1 - p; g.strokeStyle = color; g.lineWidth = 3 * U;
    g.beginPath(); g.arc(x, y, (10 + 50 * p) * U, 0, Math.PI * 2); g.stroke(); g.restore();
  }
  // Caminho do cursor: keys [[t, {x,y}], ...] com mola UI + "press" nos cliques
  function cursorAt(t, keys, clicks = []) {
    const p = M.trackObj(t, keys, 120, 22);
    let press = 0; for (const ct of clicks) press = Math.max(press, clamp(1 - Math.abs(t - ct) / 0.12));
    return { ...p, press };
  }

  root.FILM_RT = { W, H, V, SQ, U, g, C, F, IMG, loadImages, drawGrain, bg, gridTex, dotTex, font, text, measure, label,
    kinetic, wrap, rrect, shadow, noShadow, screen, cursor, ripple, cursorAt };
})(window);
