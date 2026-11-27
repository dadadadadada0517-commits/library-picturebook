// node export.mjs stills 5 15.2 20 ...     → out/stills/t_xxx.jpg ＋ 拼成 sheet_N.jpg
// node export.mjs clip <a> <b> [檔名]        → out/<檔名>.mp4（a～b 秒，配原片聲音，聲音不重新編碼）
// node export.mjs film [檔名]                → 全片
// 每個指令都可加 --part=2 選哪一段（預設 1）
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
// 需要 puppeteer-core：在這個資料夾 npm i puppeteer-core，或用環境變數 PUPPETEER_FROM 指到已經裝好它的資料夾
const require = createRequire(process.env.PUPPETEER_FROM ? path.resolve(process.env.PUPPETEER_FROM) + '/' : import.meta.url); const puppeteer = require('puppeteer-core');
const ROOT = path.dirname(new URL(import.meta.url).pathname), OUT = path.join(ROOT, 'out'); fs.mkdirSync(path.join(OUT, 'stills'), { recursive: true });
const PART = (process.argv.find(a => a.startsWith('--part=')) || '--part=1').split('=')[1];
const [mode, ...args] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.m4a': 'audio/mp4' };
const server = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); }).listen(0);
const port = server.address().port, VW = 1920, VH = 1080;
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', `--window-size=${VW},${VH}`] });
const page = await browser.newPage(); await page.setViewport({ width: VW, height: VH });
page.on('console', m => console.log('[page]', m.text())); page.on('pageerror', e => console.log('[error]', e.message));
await page.goto(`http://localhost:${port}/index.html?capture&part=${PART}`); await page.waitForFunction('window.ready === true', { timeout: 120000 });
const DUR = await page.evaluate('DUR');
const frame = (t, q) => page.evaluate((t, q) => window.capture(t, q).split(',')[1], t, q);
if (mode === 'stills') {
  const files = []; for (const a of args) { const t = +a, f = path.join(OUT, 'stills', `p${PART}_t_${t.toFixed(2).padStart(6, '0')}.jpg`); fs.writeFileSync(f, Buffer.from(await frame(t, 0.88), 'base64')); files.push(f); }
  const per = 3, cw = 640, ch = 360;
  for (let i = 0; i * per * 3 < files.length; i++) { const fs2 = files.slice(i * per * 3, i * per * 3 + per * 3); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...fs2.flatMap(f => ['-i', f]), '-filter_complex', fs2.map((_, k) => `[${k}:v]scale=${cw}:${ch}[v${k}]`).join(';') + ';' + (fs2.length > 1 ? fs2.map((_, k) => `[v${k}]`).join('') + `xstack=inputs=${fs2.length}:layout=${fs2.map((_, k) => `${(k % per) * cw}_${Math.floor(k / per) * ch}`).join('|')}:fill=black` : '[v0]copy'), '-q:v', '3', path.join(OUT, 'stills', `p${PART}_sheet_${i}.jpg`)].filter(Boolean)); }
  console.log('stills', files.length);
} else {
  const a = mode === 'film' ? 0 : +args[0], b = mode === 'film' ? DUR : +args[1], name = (mode === 'film' ? args[0] : args[2]) || (mode === 'film' ? 'film' : `clip_${a}_${b}`);
  const out = path.join(OUT, name + '.mp4'), fps = 30, n = Math.ceil((b - a) * fps), t0 = Date.now();
  // 全片：聲音整軌照搬，不裁不重編
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', ...(mode === 'film' ? [] : ['-ss', String(a), '-t', String(b - a)]), '-i', path.join(ROOT, `src/audio_p${PART}.m4a`), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'copy', ...(mode === 'film' ? [] : ['-shortest']), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) { const buf = Buffer.from(await frame(a + i / fps, 0.95), 'base64'); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (i % 300 === 0) console.log(`frame ${i}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('wrote', out);
}
await browser.close(); server.close();
