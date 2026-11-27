// 檢查每一幕紙偶的腳會不會被字幕條蓋到（螢幕 y 超過 952 就列出來）
import fs from 'node:fs'; import vm from 'node:vm';
const ctx = { W: 1920, H: 1080, console }; vm.createContext(ctx);
ctx.clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
vm.runInContext(fs.readFileSync(new URL(`../js/scenes_p${process.argv[2] || 1}.js`, import.meta.url), 'utf8').replace('const SCENES', 'var SCENES'), ctx);
const lerp = (a, b, u) => a + (b - a) * u;
function keyAt(keys, t) { const n = keys.length; if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1]; for (let i = 0; i < n - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (t < t1) { const u = (t - t0) / (t1 - t0), o = {}; for (const k in a) o[k] = typeof a[k] === 'number' && typeof b[k] === 'number' ? lerp(a[k], b[k], u) : a[k]; return o; } } }
for (const sc of ctx.SCENES) { let worst = 0, who = '';
  for (const L of sc.layers) { if (L.fx || L.anchor === 'center' || L.clip || L.clipCircle || !(L.spr)) continue;
    for (let t = Math.max(sc.t0, L.t0 ?? 0); t <= Math.min(sc.t1, L.t1 ?? 999); t += 0.25) { const k = keyAt(L.keys, t), c = {...keyAt(sc.cam, t)}; c.y=Math.max(540/c.z,Math.min(1080-540/c.z,c.y)); const y = (k.y - c.y) * c.z + 540; if (y > worst) { worst = y; who = L.spr + '@' + t.toFixed(1); } } }
  // 鏡頭有沒有拍到背景外面
  let edge = '';
  console.log(sc.id.padEnd(11), worst.toFixed(0).padStart(5), worst > 952 ? '✗ ' + who : 'ok', edge); }
