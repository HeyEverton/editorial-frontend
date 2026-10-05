// node render.mjs --film ad --w 1080 --h 1920 --fps 30 --sub 3 --shutter 0.5 [--from 0 --to 5] [--stills beat]
//   --stills beat   → um PNG por compasso (contact sheet) em out/stills/<film>_<WxH>/, sem vídeo
//   --stills 1.5,3  → PNGs nesses tempos
// Saídas: out/<film>_<WxH>_silent.mp4 + out/<film>_<WxH>_cues.json (para o audio.mjs)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { FFMPEG } from './lib/ffmpeg.mjs';

const argv = process.argv;
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 ? argv[i + 1] : d; };
const FILM = arg('film', 'ad');
const W = +arg('w', 1920), H = +arg('h', 1080);
const FPS = +arg('fps', 30), SUB = +arg('sub', 3);
// obturador 180°: os subquadros cobrem só metade do intervalo do quadro (blur curto, sem 'visão dupla')
const SHUTTER = +arg('shutter', 0.5);
const STILLS = arg('stills', null);
const tag = `${FILM}_${W}x${H}`;
mkdirSync('out', { recursive: true });

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => { console.error('pageerror:', e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(`films/${FILM}.html`).href + `?w=${W}&h=${H}&render=1`);
await page.evaluate(() => window.READY);
await page.evaluate(() => document.fonts.ready);
const meta = await page.evaluate(() => ({ dur: window.FILM.dur, bpm: window.FILM.bpm, cues: window.FILM.cues, mood: window.FILM.mood }));
writeFileSync(`out/${tag}_cues.json`, JSON.stringify(meta, null, 1));
const DUR = meta.dur;
const T0 = +arg('from', 0), T1 = +arg('to', DUR);

const grab = () => page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });

if (STILLS) {
  const dir = `out/stills/${tag}`; mkdirSync(dir, { recursive: true });
  const bar = 4 * 60 / meta.bpm;
  const times = STILLS === 'beat'
    ? Array.from({ length: Math.ceil(DUR / bar) }, (_, i) => +(i * bar + bar * 0.75).toFixed(2)).filter((t) => t < DUR)
    : STILLS.split(',').map(Number);
  for (const t of times) {
    await page.evaluate((tt) => window.seek(tt), t);
    writeFileSync(`${dir}/t${String(t.toFixed(2)).padStart(6, '0')}.png`, await grab());
  }
  console.log(`stills: ${times.length} em ${dir}`);
  await browser.close();
  process.exit();
}

// tmix faz a média de SUB subquadros consecutivos (motion blur); select mantém o último de cada grupo
const vf = SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB` : 'null';
const outFile = T0 === 0 && T1 === DUR ? `out/${tag}_silent.mp4` : `out/${tag}_${T0}-${T1}_silent.mp4`;
const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), '-i', '-',
  '-vf', vf, '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', outFile],
  { stdio: ['pipe', 'inherit', 'inherit'] });

const start = Math.round(T0 * FPS * SUB), total = Math.round(T1 * FPS * SUB);
const t0 = Date.now();
for (let i = start; i < total; i++) {
  const f = Math.floor(i / SUB), k = i % SUB;
  await page.evaluate((t) => window.seek(t), f / FPS + (k / SUB) * SHUTTER / FPS);
  const png = await grab();
  if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % (FPS * SUB) === 0) process.stdout.write(`\r${tag}: ${(i / (FPS * SUB)).toFixed(0)}s / ${T1}s  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log(`\n→ ${outFile}`);
