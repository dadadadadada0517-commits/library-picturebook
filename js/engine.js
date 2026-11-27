'use strict';
// 剪紙偶動畫引擎：每一格只由時間 t 決定（可逐格輸出）
const W = 1920, H = 1080;
const PAL = { cream: '#EEE3CC', paper: '#F3EAD6', indigo: '#365A6B', brick: '#B75B45', mustard: '#C29B43', char: '#403B34', sea: '#3F8E96' };
const FONT = '"WenKai","Noto Sans TC",sans-serif';
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const CA = mk(), CB = mk();
const IMG = {}; let ANCH = {};
const lerp = (a, b, u) => a + (b - a) * u, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), ease = u => u * u * (3 - 2 * u);
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const TAU = Math.PI * 2, STEP = 12;                      // 紙偶一秒動 12 格（逐格動畫感）

function keyAt(keys, t) {
  const n = keys.length; if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
  for (let i = 0; i < n - 1; i++) {
    const [t0, a] = keys[i], [t1, b] = keys[i + 1];
    if (t < t1) { const u0 = (t - t0) / (t1 - t0), u = b.lin ? u0 : ease(u0), o = {}; for (const k in a) o[k] = (typeof a[k] === 'number' && typeof b[k] === 'number') ? lerp(a[k], b[k], u) : a[k]; return o; }
  }
}

// ───────── 紙偶 ─────────
function frameOf(it, t) {
  let f = it.frame || 0;
  if (it.pose) for (const [pt, v] of it.pose) if (t >= pt) f = v;
  if (Array.isArray(f)) f = f[Math.floor(t * (it.fps || 3)) % f.length];
  return f;
}
function drawSprite(g, it, t, cam, idx) {
  if ((it.t0 != null && t < it.t0) || (it.t1 != null && t >= it.t1)) return;
  const tq = Math.floor(t * STEP) / STEP, step = Math.floor(t * STEP);
  const k = keyAt(it.keys, tq), k2 = keyAt(it.keys, tq + 0.1);
  const fi = frameOf(it, tq), names = it.imgs || (it.img ? [it.img] : null);
  const n0 = names ? names[0] : it.spr + '_0', n1 = names ? names[fi % names.length] : it.spr + '_' + fi, im0 = IMG[n0], im = IMG[n1] || im0; if (!im0) return;
  const s = (k.h || it.h) / im0.height;
  const moving = Math.abs(k2.x - k.x) + Math.abs(k2.y - k.y) > 0.5;
  const bob = it.bob ? -Math.abs(Math.sin(tq * (it.fps || 3) * Math.PI)) * it.bob * (moving || it.bobAlways ? 1 : 0) : 0;
  const jx = (hash(step * 7.1 + idx * 13) - 0.5) * (it.jit ?? 1.6), jr = (hash(step * 3.3 + idx * 5) - 0.5) * (it.jr ?? 0.7) * Math.PI / 180;
  const sway = it.sway ? Math.sin(tq * TAU / it.sway[1] + idx) * it.sway[0] * Math.PI / 180 : 0;
  const breathe = it.breathe ? 1 + Math.sin(tq * TAU / 3.2 + idx) * it.breathe : 1;
  g.save();
  if (it.depth) g.translate((W / 2 - cam.x) * (it.depth - 1), (H / 2 - cam.y) * (it.depth - 1));
  if (it.clip) { g.beginPath(); g.rect(...it.clip); g.clip(); }
  if (it.clipCircle) { g.beginPath(); g.arc(it.clipCircle[0], it.clipCircle[1], it.clipCircle[2], 0, TAU); g.clip(); }
  g.translate(k.x + jx, k.y + bob); g.rotate(jr + sway + (k.r || 0) * Math.PI / 180); g.scale((it.flip ? -1 : 1) * s, s * breathe);
  g.globalAlpha = k.a ?? 1;
  if (it.shadow !== false) { g.shadowColor = 'rgba(50,35,20,.32)'; g.shadowBlur = 9; g.shadowOffsetX = 5; g.shadowOffsetY = 7; }
  const ctr = it.anchor === 'center';
  g.drawImage(im, ctr ? -im.width / 2 : -(ANCH[n1] ?? im.width / 2), ctr ? -im.height / 2 : -im.height);
  g.restore();
}

// ───────── 特效（都畫在場景座標裡）─────────
function star(g, x, y, r) { g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * TAU / 8, rr = i % 2 ? r * 0.28 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); }
function petalPath(g, r) { g.beginPath(); g.moveTo(0, -r); g.quadraticCurveTo(r * 0.9, -r * 0.2, 0, r); g.quadraticCurveTo(-r * 0.9, -r * 0.2, 0, -r); g.closePath(); }
function heartPath(g, r) { g.beginPath(); g.moveTo(0, r * 0.9); g.bezierCurveTo(-r * 1.5, -r * 0.2, -r * 0.7, -r * 1.2, 0, -r * 0.4); g.bezierCurveTo(r * 0.7, -r * 1.2, r * 1.5, -r * 0.2, 0, r * 0.9); g.closePath(); }
const FX = {
  // 柔光：燈、太陽、螢幕
  glow(g, f, t) {
    const p = f.per ? Math.sin(t * TAU / f.per) : (hash(Math.floor(t * 8) + f.x) - 0.5) * 2, a = (f.a ?? 0.5) * (1 + (f.pulse ?? 0.15) * p) * fade(f, t);
    const gr = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r); gr.addColorStop(0, `rgba(${f.color || '255,214,140'},${a})`); gr.addColorStop(0.55, `rgba(${f.color || '255,214,140'},${a * 0.45})`); gr.addColorStop(1, `rgba(${f.color || '255,214,140'},0)`);
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = gr; g.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2); g.restore();
  },
  // 午後光斑
  dapples(g, f, t) {
    const [ax, ay, aw, ah] = f.area; g.save(); g.globalCompositeOperation = 'screen';
    for (let i = 0; i < (f.n || 12); i++) {
      const x = ax + hash(i * 3.1 + 1) * aw + Math.sin(t * 0.35 + i) * 30, y = ay + hash(i * 5.7 + 2) * ah + Math.cos(t * 0.28 + i * 2) * 18, r = 34 + hash(i * 9.2) * (f.r || 70);
      const a = (f.a ?? 0.2) * (0.6 + 0.4 * Math.sin(t * 0.9 + i * 1.7)) * fade(f, t);
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,232,170,${a})`); gr.addColorStop(0.7, `rgba(255,232,170,${a * 0.7})`); gr.addColorStop(1, 'rgba(255,232,170,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    } g.restore();
  },
  // 飄落的紙花瓣
  petals(g, f, t) {
    const [ax, ay, aw, ah] = f.area, cols = f.colors || [PAL.brick, '#D9806A', '#E9B7A0'], tq = Math.floor(t * STEP) / STEP;
    for (let i = 0; i < (f.n || 14); i++) {
      const sp = (f.speed || 55) * (0.6 + hash(i * 2.3) * 0.8), yy = (hash(i * 7.7) * ah + sp * tq) % ah, x = ax + hash(i * 4.1) * aw + Math.sin(tq * 0.9 + i * 2.1) * 46 + (f.drift || 0) * (yy / ah) * 200, y = ay + yy;
      const edge = Math.min(yy / 80, (ah - yy) / 80, 1), r = (f.size || 13) * (0.7 + hash(i * 1.9) * 0.6);
      g.save(); g.translate(x, y); g.rotate(tq * (1 + hash(i) * 1.5) + i); g.scale(1, 0.55 + 0.45 * Math.cos(tq * 2.2 + i)); g.globalAlpha = clamp(edge) * fade(f, t);
      g.shadowColor = 'rgba(50,35,20,.25)'; g.shadowBlur = 4; g.shadowOffsetX = 2; g.shadowOffsetY = 3; g.fillStyle = cols[i % cols.length]; petalPath(g, r); g.fill(); g.restore();
    }
  },
  // 水面、燈火的亮點
  sparkle(g, f, t) {
    const [ax, ay, aw, ah] = f.area; g.save(); g.fillStyle = f.color || '#FFF7DC';
    for (let i = 0; i < (f.n || 20); i++) {
      const life = (t * (0.35 + hash(i * 3.3) * 0.4) + hash(i * 8.1)) % 1, cyc = Math.floor(t * (0.35 + hash(i * 3.3) * 0.4) + hash(i * 8.1));
      const x = ax + hash(i * 1.7 + cyc * 9.1) * aw, y = ay + hash(i * 6.3 + cyc * 4.7) * ah, a = Math.sin(life * Math.PI) ** 2, r = (f.size || 13) * (0.5 + hash(i * 2.9) * 0.9) * (0.6 + 0.4 * a);
      g.globalAlpha = a * (f.a ?? 0.9) * fade(f, t); star(g, x, y, r);
    } g.restore();
  },
  // 冒出來的小紙愛心
  hearts(g, f, t) {
    const tq = Math.floor(t * STEP) / STEP;
    for (let i = 0; i < (f.n || 6); i++) {
      const per = f.per || 3.2, lt = ((tq - (f.t0 || 0)) - i * per / (f.n || 6)); if (lt < 0) continue; const u = (lt % per) / per, k = Math.floor(lt / per);
      const x = f.x + (hash(i * 3 + k * 7) - 0.5) * (f.spread || 160) + Math.sin(u * 5 + i) * 14, y = f.y - u * (f.rise || 190), r = (f.size || 17) * (0.7 + hash(i + k) * 0.6) * Math.min(1, u * 5);
      g.save(); g.translate(x, y); g.rotate((hash(i * 5 + k) - 0.5) * 0.6); g.globalAlpha = (1 - u) ** 0.7 * fade(f, t);
      g.shadowColor = 'rgba(50,35,20,.25)'; g.shadowBlur = 4; g.shadowOffsetX = 2; g.shadowOffsetY = 3; g.fillStyle = (f.colors || [PAL.brick, '#D9806A', PAL.mustard])[(i + k) % 3]; heartPath(g, r); g.fill(); g.restore();
    }
  },
  // 風的線條
  wind(g, f, t) {
    const [ax, ay, aw, ah] = f.area; g.save(); g.lineCap = 'round'; g.strokeStyle = f.color || 'rgba(255,249,232,.8)';
    for (let i = 0; i < (f.n || 5); i++) {
      const sp = 380 + hash(i * 2.2) * 260, span = aw + 700, x = ax + aw + 200 - ((hash(i * 9.4) * span + t * sp) % span), y = ay + hash(i * 4.4) * ah, len = 170 + hash(i * 6.1) * 160;
      g.globalAlpha = 0.75 * fade(f, t); g.lineWidth = 5 + hash(i) * 4; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x - len * 0.3, y - 16, x - len * 0.7, y + 16, x - len, y + Math.sin(t * 2 + i) * 6); g.stroke();
    } g.restore();
  },
  // 海浪紙帶
  waves(g, f, t) {
    const tq = Math.floor(t * STEP) / STEP;
    for (const [i, r] of f.rows.entries()) {
      g.save(); g.globalAlpha = (r.a ?? 0.85) * fade(f, t); g.fillStyle = r.color; g.shadowColor = 'rgba(30,40,50,.25)'; g.shadowBlur = 5; g.shadowOffsetY = -2;
      const off = tq * (r.speed || 30) * (i % 2 ? -1 : 1), x0 = r.x0 ?? -40, x1 = r.x1 ?? W + 40; g.beginPath(); g.moveTo(x0, r.y + (r.h || 60));
      for (let x = x0; x <= x1; x += 16) g.lineTo(x, r.y + Math.sin((x + off) / (r.len || 150) * TAU) * (r.amp || 9) + Math.sin((x - off * 0.6) / 53) * 2);
      g.lineTo(x1, r.y + (r.h || 60)); g.closePath(); g.fill(); g.restore();
    }
  },
  // 空氣中的小亮塵
  dust(g, f, t) {
    const [ax, ay, aw, ah] = f.area; g.save(); g.fillStyle = f.color || '#FFF3D0';
    for (let i = 0; i < (f.n || 30); i++) {
      const x = ax + (hash(i * 2.1) * aw + Math.sin(t * 0.4 + i) * 40 + t * 8) % aw, y = ay + (hash(i * 3.7) * ah + ah - (t * (8 + hash(i) * 14)) % ah) % ah;
      g.globalAlpha = (0.25 + 0.5 * Math.abs(Math.sin(t * 1.3 + i * 2.2))) * (f.a ?? 1) * fade(f, t); g.beginPath(); g.arc(x, y, 2 + hash(i * 5) * 3.5, 0, TAU); g.fill();
    } g.restore();
  },
  // 整片色調（黃昏、下雨、夜）
  tint(g, f, t) { const a = keyAt(f.keys, t).a; if (a <= 0) return; g.save(); if (f.clip) { g.beginPath(); g.rect(...f.clip); g.clip(); } g.globalCompositeOperation = f.op || 'multiply'; g.globalAlpha = a; g.fillStyle = f.color; g.fillRect(-200, -200, W + 400, H + 400); g.restore(); },
  // 雨絲（電影銀幕裡）
  rain(g, f, t) {
    const [ax, ay, aw, ah] = f.clip, a = fade(f, t); if (a <= 0) return; g.save(); g.beginPath(); g.rect(ax, ay, aw, ah); g.clip(); g.strokeStyle = 'rgba(235,240,245,.75)'; g.lineWidth = 4; g.lineCap = 'round';
    const tq = Math.floor(t * STEP) / STEP;
    for (let i = 0; i < 46; i++) { const x = ax + hash(i * 3.3) * (aw + 200) - 100, y = ay + ((hash(i * 7.1) * ah + tq * (700 + hash(i) * 300)) % (ah + 80)) - 40; g.globalAlpha = a * (0.4 + hash(i * 2) * 0.5); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 12, y + 44); g.stroke(); }
    g.restore();
  },
  // 虛線航線（地圖上慢慢縫出來）
  route(g, f, t) {
    const u = clamp((t - f.t0) / f.dur); if (u <= 0) return; const [x0, y0] = f.from, [x1, y1] = f.to, cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - (f.bend || 160);
    g.save(); g.strokeStyle = f.color || PAL.paper; g.lineWidth = f.w || 7; g.lineCap = 'round'; g.setLineDash(f.dash || [4, 22]); g.shadowColor = 'rgba(20,30,40,.3)'; g.shadowBlur = 3; g.shadowOffsetY = 2; g.beginPath();
    const n = Math.floor(60 * u); for (let i = 0; i <= n; i++) { const v = i / 60, x = (1 - v) ** 2 * x0 + 2 * (1 - v) * v * cx + v * v * x1, y = (1 - v) ** 2 * y0 + 2 * (1 - v) * v * cy + v * v * y1; i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.globalAlpha = fade(f, t); if (f.outline) { const c = g.strokeStyle, w = g.lineWidth; g.strokeStyle = f.outline; g.lineWidth = w + 10; g.stroke(); g.strokeStyle = c; g.lineWidth = w; g.shadowColor = 'transparent'; } g.stroke(); g.restore();
  },
  // 走過留下的腳印
  footprints(g, f, t) {
    g.save(); g.fillStyle = 'rgba(120,90,60,.42)';
    for (let i = 0; i < f.n; i++) { const tt = f.t0 + i * f.every; if (t < tt) break; const k = keyAt(f.keys, tt), a = clamp((t - tt) / 0.2) * clamp(1 - (t - tt - 5) / 3); g.globalAlpha = a; g.beginPath(); g.ellipse(k.x - 20, k.y + (i % 2 ? 7 : -7) + (f.dy || 0), 15, 7, -0.15, 0, TAU); g.fill(); }
    g.restore();
  },
};

// ───────── 追加特效 ─────────
Object.assign(FX, {
  // 從背景圖裁一塊畫進框裡（電視畫面）
  pic(g, f, t) { const im = IMG[f.plate]; if (!im) return; const [dx, dy, dw, dh] = f.dst, k = im.width / W; g.save(); g.beginPath(); g.roundRect(dx, dy, dw, dh, f.round || 0); g.clip(); g.globalAlpha = fade(f, t); g.drawImage(im, f.src[0] * k, f.src[1] * k, f.src[2] * k, f.src[3] * k, dx, dy, dw, dh); g.restore(); },
  // 彈出來的明信片
  cards(g, f, t) {
    const tq = Math.floor(t * STEP) / STEP;
    for (const [i, c] of f.list.entries()) {
      const u = clamp((tq - c.t0) / 0.35); if (u <= 0) continue; const im = IMG[c.plate], k = im ? im.width / W : 1, e = u < 1 ? 1.12 * ease(u) - 0.12 * ease(u) ** 3 : 1, o = fade({ t1: f.t1 }, t);
      const w = c.w, h = w * (c.src[3] / c.src[2]), b = 14;
      g.save(); g.translate(c.x + Math.sin(tq * 0.9 + i * 2) * 5, c.y + Math.cos(tq * 0.7 + i) * 6 + (1 - e) * 120); g.rotate((c.rot || 0) * Math.PI / 180 + Math.sin(tq * 0.6 + i) * 0.015); g.scale(0.3 + 0.7 * e, 0.3 + 0.7 * e); g.globalAlpha = Math.min(1, u * 2) * o;
      g.shadowColor = 'rgba(40,28,15,.4)'; g.shadowBlur = 14; g.shadowOffsetX = 4; g.shadowOffsetY = 8; g.fillStyle = '#F7F0E0'; g.fillRect(-w / 2 - b, -h / 2 - b, w + b * 2, h + b * 2.6); g.shadowColor = 'transparent';
      if (im) g.drawImage(im, c.src[0] * k, c.src[1] * k, c.src[2] * k, c.src[3] * k, -w / 2, -h / 2, w, h); g.restore();
    }
  },
  // 圓形紙片（地圖上兩邊的人）
  disc(g, f, t) { const u = clamp((t - (f.t0 || 0)) / 0.35), e = ease(u); if (u <= 0) return; g.save(); g.translate(f.x, f.y); g.scale(e, e); g.shadowColor = 'rgba(20,30,40,.45)'; g.shadowBlur = 16; g.shadowOffsetX = 4; g.shadowOffsetY = 8; g.fillStyle = f.color || PAL.paper; g.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = f.r + (hash(i * 3.3 + f.x) - 0.5) * 7; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.restore(); },
  // 對話泡泡（裡面是小圖示，不放字）
  bubble(g, f, t) {
    const tq = Math.floor(t * STEP) / STEP, u = clamp((tq - f.t0) / 0.25), o = clamp((f.t1 - tq) / 0.2); if (u <= 0 || o <= 0) return; const e = u < 1 ? 1.15 * ease(u) - 0.15 * ease(u) ** 3 : 1, r = f.r || 62;
    g.save(); g.translate(f.x, f.y + Math.sin(tq * 2 + f.x) * 4); g.scale(e, e); g.rotate((hash(f.x) - 0.5) * 0.12); g.globalAlpha = o;
    g.shadowColor = 'rgba(40,28,15,.35)'; g.shadowBlur = 10; g.shadowOffsetX = 3; g.shadowOffsetY = 6; g.fillStyle = '#F7F0E0'; g.beginPath(); g.ellipse(0, 0, r * 1.25, r, 0, 0, TAU); g.fill();
    g.beginPath(); const d = f.tail || 1; g.moveTo(d * r * 0.25, r * 0.8); g.lineTo(d * r * 0.75, r * 1.5); g.lineTo(d * r * 0.7, r * 0.6); g.closePath(); g.fill(); g.shadowColor = 'transparent';
    if (f.icon === 'heart') { g.fillStyle = PAL.brick; heartPath(g, r * 0.42); g.fill(); }
    else if (f.icon === 'note') { g.fillStyle = PAL.indigo; g.beginPath(); g.ellipse(-r * 0.18, r * 0.25, r * 0.2, r * 0.15, -0.3, 0, TAU); g.fill(); g.fillRect(-r * 0.02, -r * 0.42, r * 0.08, r * 0.68); g.beginPath(); g.moveTo(r * 0.06, -r * 0.42); g.quadraticCurveTo(r * 0.45, -r * 0.3, r * 0.34, r * 0.02); g.quadraticCurveTo(r * 0.3, -r * 0.2, r * 0.06, -r * 0.22); g.fill(); }
    else if (f.icon === 'sun') { g.fillStyle = PAL.mustard; g.beginPath(); g.arc(0, 0, r * 0.26, 0, TAU); g.fill(); for (let i = 0; i < 8; i++) { g.save(); g.rotate(i * TAU / 8); g.fillRect(-r * 0.04, -r * 0.52, r * 0.08, r * 0.17); g.restore(); } }
    else if (f.icon === 'q') { g.fillStyle = PAL.indigo; g.font = `700 ${r * 0.95}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('？', 0, 4); }
    else { g.fillStyle = PAL.indigo; for (let i = -1; i <= 1; i++) { const a = clamp(((tq - f.t0) * 3 - (i + 1) * 0.4)); g.globalAlpha = o * (0.3 + 0.7 * (Math.sin(tq * 6 - i) > 0 ? 1 : 0.4)); g.beginPath(); g.arc(i * r * 0.42, 0, r * 0.12, 0, TAU); g.fill(); } }
    g.restore();
  },
  // 熱茶的白煙
  steam(g, f, t) {
    g.save(); g.lineCap = 'round'; g.strokeStyle = 'rgba(255,250,238,.75)';
    for (let i = 0; i < (f.n || 3); i++) { const u = ((t * 0.32 + i / (f.n || 3)) % 1), x = f.x + (i - 1) * 16, y = f.y - u * (f.rise || 110); g.globalAlpha = Math.sin(u * Math.PI) * 0.8 * fade(f, t); g.lineWidth = 7; g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 14, y - 16, x - 14, y - 30, x + Math.sin(t + i) * 6, y - 48); g.stroke(); }
    g.restore();
  },
  // 片尾的整張紙
  paperbg(g, f) { g.save(); g.fillStyle = f.color || PAL.paper; g.fillRect(-100, -100, W + 200, H + 200); g.strokeStyle = 'rgba(160,135,95,.28)'; g.lineWidth = 1.5; for (let i = 0; i < 520; i++) { const x = hash(i * 1.3) * W, y = hash(i * 2.9) * H, a = hash(i * 4.1) * TAU; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 22, y + Math.sin(a) * 22); g.stroke(); } g.restore(); },
});

// ───────── 集章地圖用 ─────────
Object.assign(FX, {
  // 圓圈裡一个一个蓋上章、冒出小圖書館
  stamps(g, f, t) {
    const tq = Math.floor(t * STEP) / STEP;
    f.list.forEach(([x, y, r], i) => {
      const u = clamp((tq - f.t0 - i * f.every) / 0.3); if (u <= 0) return; const im = IMG[f.imgs[i % f.imgs.length]]; if (!im) return;
      const e = u < 1 ? 1.25 * ease(u) - 0.25 * ease(u) ** 3 : 1, h = r * 1.75 * e, w = h * im.width / im.height;
      g.save(); g.translate(x, y); g.rotate((hash(i * 3.7) - 0.5) * 0.35); g.globalAlpha = Math.min(1, u * 2);
      g.shadowColor = 'rgba(50,35,20,.3)'; g.shadowBlur = 6; g.shadowOffsetX = 3; g.shadowOffsetY = 4; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore();
    });
  },
  // 圓形紙牌上的大字（例：61）
  badge(g, f, t) {
    const tq = Math.floor(t * STEP) / STEP, u = clamp((tq - f.t0) / 0.35), o = clamp((f.t1 - tq) / 0.3); if (u <= 0 || o <= 0) return; const e = u < 1 ? 1.2 * ease(u) - 0.2 * ease(u) ** 3 : 1;
    g.save(); g.translate(f.x, f.y + Math.sin(tq * 1.6) * 5); g.scale(e, e); g.rotate(-0.06); g.globalAlpha = o;
    g.shadowColor = 'rgba(40,28,15,.42)'; g.shadowBlur = 18; g.shadowOffsetX = 5; g.shadowOffsetY = 9; g.fillStyle = f.color || PAL.brick; g.beginPath(); for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU, r = f.r + (hash(i * 2.9 + f.x) - 0.5) * 9; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.shadowColor = 'transparent';
    g.strokeStyle = '#F6EEDB'; g.lineWidth = 5; g.setLineDash([3, 14]); g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, f.r - 18, 0, TAU); g.stroke();
    g.fillStyle = '#F8F1E0'; g.font = `700 ${f.r * 1.05}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(f.text, 0, f.sub ? -f.r * 0.12 : 6);
    if (f.sub) { g.font = `700 ${f.r * 0.3}px ${FONT}`; g.fillText(f.sub, 0, f.r * 0.52); }
    g.restore();
  },
});
function fade(f, t) { let a = 1; if (f.t0 != null && !f.dur) a *= clamp((t - f.t0) / (f.fin || 0.6)); if (f.t1 != null) a *= clamp((f.t1 - t) / (f.fout || 0.6)); return a; }

// ───────── 場景 ─────────
function drawScene(g, sc, t) {
  const cam = { ...keyAt(sc.cam, t) }; cam.x = clamp(cam.x, W / 2 / cam.z, W - W / 2 / cam.z); cam.y = clamp(cam.y, H / 2 / cam.z, H - H / 2 / cam.z);   // 不拍到背景外面
  g.save(); g.fillStyle = sc.bg || PAL.cream; g.fillRect(0, 0, W, H);
  g.translate(W / 2, H / 2); g.scale(cam.z, cam.z); g.translate(-cam.x, -cam.y);
  const p = IMG[sc.plate]; if (p) g.drawImage(p, 0, 0, W, H);
  (sc.layers || []).forEach((L, i) => { if (L.fx) { if ((L.t0 == null || t >= L.t0 - 0.01) && (L.t1 == null || t < L.t1 + 0.01)) FX[L.fx](g, L, t); } else drawSprite(g, L, t, cam, i); });
  g.restore();
}

function tornEdge(g, x, seed, dir) {                      // 撕紙邊：回傳路徑（右邊是新的一頁）
  g.beginPath(); g.moveTo(dir > 0 ? W + 60 : -60, -20);
  for (let y = -20; y <= H + 20; y += 36) g.lineTo(x + (hash(y * 0.37 + seed) - 0.5) * 44 + Math.sin(y / 190 + seed) * 26, y);
  g.lineTo(dir > 0 ? W + 60 : -60, H + 20); g.closePath();
}
function composite(t) {
  let i = SCENES.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SCENES.length - 1;
  const sc = SCENES[i], nx = SCENES[i + 1], pv = SCENES[i - 1];
  let a = sc, b = null, u = 0, tr = null;
  if (nx && t > sc.t1 - (nx.trDur ?? 0.8) / 2) { a = sc; b = nx; tr = nx.tr || 'wipe'; u = (t - (sc.t1 - (nx.trDur ?? 0.8) / 2)) / (nx.trDur ?? 0.8); }
  else if (pv && t < sc.t0 + (sc.trDur ?? 0.8) / 2) { a = pv; b = sc; tr = sc.tr || 'wipe'; u = (t - (sc.t0 - (sc.trDur ?? 0.8) / 2)) / (sc.trDur ?? 0.8); }
  drawScene(ctx, a, t); if (!b) return;
  const gb = CB.getContext('2d'); drawScene(gb, b, t); const e = ease(clamp(u)), seed = b.t0;
  ctx.save();
  if (tr === 'fade') { ctx.globalAlpha = e; ctx.drawImage(CB, 0, 0); }
  else if (tr === 'drop') {                              // 新的一張紙從上面放下來
    const y = -(1 - e) * (H + 80), r = (1 - e) * (hash(seed) - 0.5) * 0.08; ctx.translate(W / 2, H / 2 + y); ctx.rotate(r); ctx.shadowColor = 'rgba(30,20,10,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.drawImage(CB, -W / 2, -H / 2);
  } else {                                               // 翻頁：撕紙邊從右掃到左（或反過來）
    const dir = tr === 'wipeR' ? -1 : 1, x = dir > 0 ? lerp(W + 80, -80, e) : lerp(-80, W + 80, e);
    ctx.save(); tornEdge(ctx, x - dir * 14, seed, dir); ctx.fillStyle = 'rgba(30,20,10,.28)'; ctx.filter = 'blur(14px)'; ctx.fill(); ctx.restore();
    ctx.save(); tornEdge(ctx, x - dir * 7, seed + 3, dir); ctx.fillStyle = '#F7F0E0'; ctx.fill(); ctx.restore();   // 紙的白邊
    tornEdge(ctx, x, seed, dir); ctx.clip(); ctx.drawImage(CB, 0, 0);
  }
  ctx.restore();
}

// ───────── 文字：都做成紙條 ─────────
function paperStrip(g, w, h, seed, color) {
  g.save(); g.shadowColor = 'rgba(40,28,15,.38)'; g.shadowBlur = 12; g.shadowOffsetX = 3; g.shadowOffsetY = 6; g.fillStyle = color; g.beginPath();
  const j = k => (hash(seed * 3.7 + k) - 0.5) * 7;
  g.moveTo(-w / 2 + j(1), -h / 2 + j(2)); g.lineTo(-w * 0.1, -h / 2 + j(3) * 0.6); g.lineTo(w * 0.2, -h / 2 + j(4) * 0.6); g.lineTo(w / 2 + j(5), -h / 2 + j(6));
  g.lineTo(w / 2 + j(7), h / 2 + j(8)); g.lineTo(w * 0.15, h / 2 + j(9) * 0.6); g.lineTo(-w * 0.25, h / 2 + j(10) * 0.6); g.lineTo(-w / 2 + j(11), h / 2 + j(12)); g.closePath(); g.fill(); g.restore();
  g.save(); g.clip(); g.globalAlpha = 0.5; g.strokeStyle = 'rgba(160,135,95,.35)'; g.lineWidth = 1;        // 紙纖維
  for (let i = 0; i < Math.floor(w / 26); i++) { const x = -w / 2 + hash(seed + i * 2.2) * w, y = -h / 2 + hash(seed + i * 5.1) * h, a = hash(seed + i) * TAU; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14); g.stroke(); }
  g.restore();
}
function drawSubs(g, t) {
  for (const [a, b, txt] of SUBS) {
    if (t < a - 0.06 || t > b + 0.14) continue; const u = clamp((t - a + 0.06) / 0.2), o = clamp((b + 0.14 - t) / 0.16);
    g.save(); g.font = `700 54px ${FONT}`; const tw = g.measureText(txt).width, w = tw + 92, h = 92;
    g.translate(W / 2, 1006 + (1 - ease(u)) * 16); g.rotate((hash(a) - 0.5) * 0.014); g.globalAlpha = Math.min(u, o);
    paperStrip(g, w, h, a, PAL.paper); g.fillStyle = PAL.char; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 3); g.restore();
  }
}
function drawLyrics(g, t) {
  for (const [a, b, txt] of LYRICS) {
    if (t < a - 0.35 || t > b + 0.3) continue; const u = clamp((t - a + 0.35) / 0.4), o = clamp((b + 0.3 - t) / 0.3), fs = 46, st = 55;
    const chars = [...txt]; let hh = 0; const ys = chars.map(c => { const y = hh; hh += c === ' ' ? 30 : st; return y; }); const h = hh + 120, w = 92, x = 1808, top = 70;
    g.save(); g.translate(x, top - 30); g.rotate(Math.sin(t * 0.9 + a) * 0.012 + (1 - ease(u)) * -0.05); g.translate(0, 30 - (1 - ease(u)) * 60); g.globalAlpha = Math.min(u, o);
    g.save(); g.translate(0, h / 2); paperStrip(g, w, h, a + 0.5, PAL.indigo); g.restore();
    g.fillStyle = PAL.paper; g.beginPath(); g.arc(0, 30, 9, 0, TAU); g.fill();                                   // 打洞
    g.strokeStyle = PAL.mustard; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 30); g.quadraticCurveTo(14, -10, 4, -60); g.stroke();   // 掛繩
    g.font = `700 ${fs}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#F6EEDB';
    const n = chars.filter(c => c !== ' ').length, per = Math.min(0.22, (b - a) * 0.5 / n); let k = 0;
    chars.forEach((c, i) => { if (c === ' ') return; const cu = clamp((t - a - k * per) / 0.18); k++; g.globalAlpha = Math.min(u, o) * cu; g.fillText(c, 0, 78 + ys[i] + fs / 2 + (1 - cu) * 8); });
    g.restore();
  }
}
function drawTitle(g, t, a, b, cy = 300, sc = 1) {
  if (t < a || t > b + 0.4) return; const n = TITLE.length, ts = 150 * sc, gap = 14 * sc, tw = n * ts + (n - 1) * gap, cols = [PAL.brick, PAL.mustard, PAL.indigo, PAL.paper, PAL.brick, PAL.mustard, PAL.indigo, PAL.brick];
  const o = clamp((b + 0.4 - t) / 0.4);
  TITLE.forEach((c, i) => {
    const u = clamp((t - a - i * 0.13) / 0.22); if (u <= 0) return; const e = ease(u), x = W / 2 - tw / 2 + ts / 2 + i * (ts + gap), y = cy + (hash(i * 3.1) - 0.5) * 22 * sc;
    g.save(); g.translate(x, y - (1 - e) * 40); g.rotate((hash(i * 7.7) - 0.5) * 0.14); g.scale(1.25 - 0.25 * e, 1.25 - 0.25 * e); g.globalAlpha = e * o;
    paperStrip(g, ts, ts, i + 20, cols[i % cols.length]); g.fillStyle = cols[i % cols.length] === PAL.paper ? PAL.char : '#F8F1E0'; g.font = `700 ${Math.round(104 * sc)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(c, 0, c === 'ê' ? -2 * sc : 5 * sc); g.restore();
  });
}
function drawLabel(g, t, a, b, txt, cx, cy, fs = 44, color = PAL.paper, ink = PAL.char) {
  if (t < a || t > b + 0.3) return; const u = clamp((t - a) / 0.3), o = clamp((b + 0.3 - t) / 0.3);
  g.save(); g.font = `700 ${fs}px ${FONT}`; const tw = g.measureText(txt).width; g.translate(cx, cy - (1 - ease(u)) * 18); g.rotate((hash(a * 2) - 0.5) * 0.02); g.globalAlpha = Math.min(u, o);
  paperStrip(g, tw + fs * 1.6, fs * 1.9, a + 9, color); g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 0, 3); g.restore();
}

// 紙張顆粒（整片蓋一層，讓畫面像同一張紙）
const GRAIN = (() => { const c = document.createElement('canvas'); c.width = 480; c.height = 270; const g = c.getContext('2d'), d = g.createImageData(480, 270); for (let i = 0; i < 480 * 270; i++) { const v = 205 + hash(i * 0.731) * 50; d.data[i * 4] = v; d.data[i * 4 + 1] = v * 0.985; d.data[i * 4 + 2] = v * 0.95; d.data[i * 4 + 3] = 255; } g.putImageData(d, 0, 0); return c; })();
function finish(g) {
  g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.22; g.imageSmoothingEnabled = true; g.drawImage(GRAIN, 0, 0, W, H); g.restore();
  const v = g.createRadialGradient(W / 2, H / 2, H * 0.55, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, 'rgba(60,40,20,.22)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
}

function render(t) {
  t = clamp(t, 0, DUR - 0.001);
  composite(t);
  finish(ctx);
  drawLyrics(ctx, t); drawSubs(ctx, t);
  for (const [a, b, cy] of TITLES) drawTitle(ctx, t, a, b, cy);
  for (const [a, b, txt, y] of CREDITS) drawLabel(ctx, t, a, b, txt, W / 2, y || 120, y ? 56 : 44);
  if (typeof OVERLAY === 'function') OVERLAY(ctx, t);
  const fi = typeof FADE_IN === 'number' && !FADE_IN ? 1 : clamp(t / (typeof FADE_IN === 'number' ? FADE_IN : 0.8)), fo = typeof FADE_OUT === 'number' && !FADE_OUT ? 1 : clamp((DUR - t) / (typeof FADE_OUT === 'number' ? FADE_OUT : 1.2)), k = Math.min(fi, fo); if (k < 1) { ctx.fillStyle = `rgba(30,22,15,${1 - k})`; ctx.fillRect(0, 0, W, H); }
}

// ───────── 載入與播放 ─────────
async function boot() {
  const CAP = location.search.includes('capture'), PD = CAP ? 'assets/plates/' : 'assets/plates_web/', PE = CAP ? '.png' : '.jpg';   // 網頁播放用小檔 jpg；出片用原始 png
  const names = new Set(); for (const s of SCENES) { if (s.plate) names.add(PD + s.plate + PE); for (const p of s.extra || []) names.add(PD + p + PE); for (const L of s.layers || []) { if (L.spr) for (let i = 0; i < (L.n || 2); i++) names.add('assets/sprites/' + L.spr + '_' + i + '.png'); for (const n of L.imgs || (L.img ? [L.img] : [])) names.add('assets/sprites/' + n + '.png'); } }
  ANCH = await fetch('assets/sprites/anchors.json').then(r => r.json()).catch(() => ({}));
  await Promise.all([...names].map(src => new Promise(res => { const im = new Image(); im.onload = () => { IMG[src.split('/').pop().replace(/\.(png|jpg)$/, '')] = im; res(); }; im.onerror = () => { console.log('缺圖 ' + src); res(); }; im.src = src; })));
  await document.fonts.load(`700 54px "WenKai"`, '咱做伙來圖書館行踏𪜶𨑨𤆬'); await document.fonts.ready;
  window.capture = (t, q) => { render(t); return cv.toDataURL('image/jpeg', q || 0.92); };
  if (location.search.includes('capture')) { window.ready = true; return; }
  const au = document.getElementById('au'), bar = document.getElementById('bar');
  // 聲音比畫面短的段（第三段最後 4 秒沒有聲音）：聲音播完後用時鐘把畫面走完
  let endedAt = 0, done = false; const next = () => { const n = +(typeof PART === 'undefined' ? 1 : PART) + 1; if (n <= 3) location.href = `?part=${n}&auto`; };
  const now = () => endedAt ? Math.min(DUR, au.duration + (performance.now() - endedAt) / 1000) : au.currentTime;
  const loop = () => { const t = now(); render(t); bar.value = t; if (endedAt && t >= DUR - 0.01 && !done) { done = true; next(); } requestAnimationFrame(loop); }; loop();
  cv.onclick = () => au.paused ? au.play() : au.pause(); bar.oninput = () => { au.currentTime = +bar.value; };
  bar.max = DUR; const hint = document.getElementById('hint'); if (hint) hint.onclick = cv.onclick;
  // 一段播完自動接下一段
  au.onended = () => { endedAt = performance.now(); }; au.onseeking = au.onplay = () => { endedAt = 0; done = false; if (hint) hint.style.display = 'none'; };
  if (location.search.includes('auto')) au.play().catch(() => { if (hint) hint.style.display = ''; });
  const m = location.search.match(/[?&]t=([\d.]+)/); if (m) { const tt = +m[1]; au.readyState ? au.currentTime = tt : au.addEventListener('loadedmetadata', () => { au.currentTime = tt; }, { once: true }); }
  window.ready = true;
}
