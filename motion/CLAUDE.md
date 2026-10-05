# Estúdio de motion — regras da casa

Vale para todo filme feito em `motion/`. Roteiros e estilo ficam em `docs/`.

## Contrato de render
- Cada filme é uma função pura do tempo: `window.seek(t)` pinta o quadro t (`films/*.html`).
- Sem transições CSS, sem `setTimeout`, sem `requestAnimationFrame` no modo render, sem estado
  carregado entre quadros. Ruído só com semente (`M.rng`), nunca `Math.random`.
- Render: `node make.mjs <filme> <WxH>...` → H.264 yuv420p CRF 16, 30 fps, 2 subquadros (motion blur).
- Fontes locais em `assets/fonts` (render determinístico, sem rede).

## UI real, nunca inventada
- Telas vêm de `node capture.mjs` (app rodando em `localhost:3000`, API simulada no Playwright).
- Coordenadas de cliques vêm de `assets/layout.json`. Recorte e anime a coisa real.
- Mudou a UI do app? Rode `capture.mjs` de novo antes de renderizar.

## Visual
- Marca AE·Studio: preto/branco editorial, papel `#F7F5F0`, tinta `#0A0A0A`.
  Playfair Display (títulos, itálico para o contraponto), Syne caixa alta espaçada (rótulos), Inter (texto).
- Um acento: dourado `#B8925A` (do preset Classic Gold). Nada de outras cores fora das telas do app.
- Proibido: título centralizado sobre gradiente, tudo entrando em fade, rótulos de canto e molduras,
  glow em UI, explosões de partículas genéricas.
- A cada 2–4 s algo novo acontece. Movimento só com molas de `lib/motion.js`
  (`snappy` UI, `ui` cards/câmera, `heavy` tipografia/logo, `playful` só onde cabe overshoot).
- Um valor com vários alvos usa `track()` (soma de uma mola por mudança), nunca reinicia a mola.
- Texto em caixa que muda: entra depois da mudança, sai antes da próxima (`swapAlpha`).
- Layout por formato (9:16, 1:1, 16:9) com função de layout — nunca recortar um 16:9 para vertical.

## Som
- Trilha e SFX sintetizados em `audio.mjs`, travados no BPM do filme (120).
- SFX nos `cues` que o próprio filme declara (`window.FILM.cues`). Mix final -14 LUFS.
- Trilha fornecida? Meça com `python beats.py faixa.wav > beats.json` e alinhe os cortes a ela.

## Loop antes de mostrar qualquer coisa
1. `node render.mjs --film <f> --w W --h H --stills beat` + `node critique.mjs stills <f>_<W>x<H>`.
2. Olhe o contact sheet. Nota 1–10 em: gancho nos 2 primeiros segundos, leitura em tela de celular,
   qualidade do movimento, variedade, fidelidade à marca, sincronia do som.
3. Corrija os 3 piores problemas. Repita até tudo ≥ 8 (ver `prompts/critique-pass.txt`).
4. Só então o render completo e `node critique.mjs video out/<arquivo>.mp4`.
