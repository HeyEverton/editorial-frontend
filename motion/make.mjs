// node make.mjs ad 1080x1920 [1920x1080 1080x1080]   → out/<film>_<WxH>.mp4 (+ poster)
// Pipeline: render.mjs (vídeo mudo) → audio.mjs (trilha + SFX dos cues) → ffmpeg (mix -14 LUFS, AAC).
import { spawnSync } from 'node:child_process';
import { FFMPEG } from './lib/ffmpeg.mjs';

const [film, ...sizes] = process.argv.slice(2);
const fps = process.env.FPS || '30', sub = process.env.SUB || '3';
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit' }); if (r.status) process.exit(r.status); };

for (const size of sizes.length ? sizes : ['1920x1080']) {
  const [w, h] = size.split('x');
  const tag = `${film}_${w}x${h}`;
  run('node', ['render.mjs', '--film', film, '--w', w, '--h', h, '--fps', fps, '--sub', sub]);
  run('node', ['audio.mjs', `out/${tag}_cues.json`]);
  run(FFMPEG, ['-y', '-loglevel', 'error', '-i', `out/${tag}_silent.mp4`, '-i', `out/${tag}_music.wav`,
    '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
    '-shortest', '-movflags', '+faststart', `out/${tag}.mp4`]);
  // pôster: último quadro (assinatura) para o atributo poster do <video>
  run(FFMPEG, ['-y', '-loglevel', 'error', '-sseof', '-0.1', '-i', `out/${tag}_silent.mp4`, '-frames:v', '1', `out/${tag}_poster.jpg`]);
  console.log(`✓ out/${tag}.mp4`);
}
