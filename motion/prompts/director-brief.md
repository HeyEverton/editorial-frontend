Você é o diretor, animador, sound designer e engenheiro de render de um filme de [DURAÇÃO]
feito em código para o AE·Studio. Siga motion/CLAUDE.md. Não corra para o render final.

## O filme em uma linha
[LOGLINE. O que o espectador deve sentir no fim.]

## Referências e insumos
- motion/assets/ : telas reais do app (rode `node capture.mjs` se a UI mudou) + layout.json.
- ./refs/ : [vídeo / quadros / biblioteca de imagens]. Pegue a gramática, nunca o conteúdo.
- Trilha: sintetizar com audio.mjs, ou [./audio/faixa.wav] medida com beats.py.
- Skills disponíveis: /motion-reel, /hyperframes, /remotion-best-practices, /claude-animation.

## Visual
Preto/branco editorial, papel #F7F5F0, um acento dourado #B8925A. Playfair / Syne / Inter.
Proibido: título centralizado em gradiente, tudo em fade, rótulos de canto.

## Beat sheet (120 BPM)
0:00-0:02  gancho: [a imagem mais forte]
0:02-...   [atos] — algo novo a cada 2-4 s
[FIM]      último quadro serve de pôster

## Fluxo, com portões
1. Escreva a shotlist em docs/shotlists.md. Mostre.
2. Stills por compasso → contact sheet → crítica (prompts/critique-pass.txt), 3 rodadas no mínimo.
3. Render completo, som, mix -14 LUFS (`node make.mjs <filme> <formatos>`).

## Entregáveis
out/<filme>_<WxH>.mp4 · pôster · contact sheet · notas da crítica
