// Localiza o ffmpeg: $FFMPEG, PATH, ou a instalação do winget (Gyan.FFmpeg).
import { execSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function find() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return 'ffmpeg'; } catch {}
  const base = join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (existsSync(base)) {
    for (const d of readdirSync(base).filter((d) => d.startsWith('Gyan.FFmpeg'))) {
      for (const v of readdirSync(join(base, d))) {
        const p = join(base, d, v, 'bin', 'ffmpeg.exe');
        if (existsSync(p)) return p;
      }
    }
  }
  throw new Error('ffmpeg não encontrado. Instale com: winget install Gyan.FFmpeg');
}
export const FFMPEG = find();
export const FFPROBE = FFMPEG.replace(/ffmpeg(\.exe)?$/, (m, e) => 'ffprobe' + (e || ''));
