// node critique.mjs stills ad_1080x1920      → out/critique/<tag>_beats.png (um quadro por compasso)
// node critique.mjs video out/ad_1080x1920.mp4 [--at 4.2]
//   → contact (2 fps), strip (12 quadros em torno de --at), phone (360 px de largura), loop_check
// Depois: abrir as imagens e pontuar com prompts/critique-pass.txt.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { basename } from 'node:path';
import { FFMPEG } from './lib/ffmpeg.mjs';

const [mode, target] = process.argv.slice(2);
const at = (() => { const i = process.argv.indexOf('--at'); return i > 0 ? process.argv[i + 1] : '4'; })();
mkdirSync('out/critique', { recursive: true });
const ff = (args) => { const r = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' }); if (r.status) process.exit(r.status); };

if (mode === 'stills') {
  const dir = `out/stills/${target}`;
  const files = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
  const n = files.length;
  writeFileSync(`${dir}/list.txt`, files.map((f) => `file '${resolve(dir, f).split('\\').join('/')}'`).join('\n'));
  const vertical = /x(\d+)/.exec(target) && +/x(\d+)/.exec(target)[1] > +/_(\d+)x/.exec(target)[1];
  const cols = vertical ? 6 : 4, rows = Math.ceil(n / cols);
  ff(['-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`, '-vf', `scale=${vertical ? 300 : 480}:-1,tile=${cols}x${rows}:padding=6:color=gray`, '-frames:v', '1', `out/critique/${target}_beats.png`]);
  console.log(`→ out/critique/${target}_beats.png`);
} else if (mode === 'video') {
  const tag = basename(target, '.mp4');
  ff(['-i', target, '-vf', 'fps=2,scale=270:-1,tile=8x6', '-frames:v', '1', `out/critique/${tag}_contact.png`]);
  ff(['-ss', String(+at - 0.2), '-i', target, '-vf', 'scale=320:-1,tile=12x1', '-frames:v', '1', `out/critique/${tag}_strip.png`]);
  ff(['-i', target, '-vf', 'fps=1,scale=360:-1,tile=6x4', '-frames:v', '1', `out/critique/${tag}_phone.png`]);
  ff(['-stream_loop', '1', '-i', target, '-c', 'copy', `out/critique/${tag}_loop_check.mp4`]);
  console.log(`→ out/critique/${tag}_{contact,strip,phone}.png`);
} else {
  console.log('uso: node critique.mjs stills <tag> | video <arquivo.mp4> [--at s]');
}
