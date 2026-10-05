# AE·Studio — estúdio de motion

Filmes do produto renderizados a partir de código: `window.seek(t)` → Playwright → ffmpeg.
Regras: [CLAUDE.md](CLAUDE.md). Roteiros: [docs/shotlists.md](docs/shotlists.md).

## Requisitos
Node 22+, ffmpeg (`winget install Gyan.FFmpeg`), Python com `numpy librosa soundfile` (só para `beats.py`).
`npm i` nesta pasta instala o Playwright (o Chromium já fica em cache).

## Uso
```bash
# 1. telas reais (app rodando em :3000 na raiz: npx vite --port 3000)
node capture.mjs

# 2. prévia ao vivo: abra films/ad.html?w=1080&h=1920 no navegador

# 3. crítica antes do render
node render.mjs --film ad --w 1080 --h 1920 --stills beat
node critique.mjs stills ad_1080x1920

# 4. render final (vídeo + trilha + SFX + mix -14 LUFS)
node make.mjs ad 1080x1920 1080x1080 1920x1080
node make.mjs tutorial 1920x1080

# 5. crítica do vídeo final
node critique.mjs video out/ad_1080x1920.mp4
```

| Arquivo | Papel |
|---|---|
| `films/ad.html` | Anúncio 24 s, layout adaptável 9:16 / 1:1 / 16:9 |
| `films/tutorial.html` | "Ver como funciona" 50 s, 16:9 |
| `lib/motion.js` | molas em forma fechada, `track`, `indicator`, `swapAlpha`, ruído com semente |
| `lib/film.js` | canvas, tipografia cinética, câmera sobre screenshots, cursor |
| `audio.mjs` | trilha a 120 BPM + SFX sintetizados a partir dos cues do filme |
| `capture.mjs` | captura do app com API simulada + `assets/layout.json` |

Saídas finais publicadas em `public/videos/ae_*`.
