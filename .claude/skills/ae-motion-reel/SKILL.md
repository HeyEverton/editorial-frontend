---
name: ae-motion-reel
description: Faz vídeos motion do AE·Studio (anúncios, tutoriais, reels de produto) renderizados a partir de código, com telas reais do app. Use quando pedirem um vídeo, anúncio, reel, explainer ou filme da plataforma.
---

# AE·Studio motion reel

Pipeline em `motion/` (leia `motion/CLAUDE.md` primeiro — regras da casa).

## Insumos a confirmar
Objetivo do filme, duração, formatos (9:16 / 1:1 / 16:9), referência (quadro, vídeo ou pasta),
trilha (sintetizar ou arquivo).

## Pipeline
1. App rodando em `localhost:3000` (`npx vite --port 3000` na raiz) → `cd motion && node capture.mjs`
   (telas reais + `assets/layout.json` com coordenadas dos elementos).
2. Trilha fornecida? `python beats.py faixa.wav > beats.json`. Senão `audio.mjs` sintetiza a 120 BPM.
3. Escreva/atualize `docs/shotlists.md` no grid de batidas. Mostre e espere OK.
4. Construa `films/<nome>.html` com `window.seek(t)` usando `lib/motion.js` + `lib/film.js`
   (copie a estrutura de `films/ad.html` para multi-formato, `films/tutorial.html` para passo a passo).
5. `node render.mjs --film <nome> --w W --h H --stills beat` → `node critique.mjs stills <nome>_<W>x<H>`
   → critique com `prompts/critique-pass.txt` → corrija. 3 rodadas no mínimo.
6. `node make.mjs <nome> 1080x1920 1080x1080 1920x1080` → `out/<nome>_<WxH>.mp4` + pôster.
7. `node critique.mjs video out/<arquivo>.mp4`. Entregue mp4, pôster e o que melhoraria a seguir.

## Regras duras
- Só UI real do produto. Nunca invente telas.
- Sem Math.random, timers ou transições CSS no render.
- Proibido: rótulos de canto, título centralizado em gradiente, tudo em fade.
