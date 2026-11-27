// 《咱做伙來圖書館行踏》part1：7 幕。座標都是 1920×1080。
const LEAF = ['#7C9A5B', '#A6B36A', '#C29B43'];
const pop = (img, x, y, h, t0, extra = {}) => ({ img, anchor: 'center', t0, keys: [[t0, { x, y: y + 90, h: h * 0.2, a: 0 }], [t0 + 0.45, { x, y: y - 12, h: h * 1.08, a: 1 }], [t0 + 0.7, { x, y, h, a: 1 }]], sway: [2.5, 3.2], ...extra });
const SCENES = [
  { // 1 厝裡：椅仔頂的冊佮目鏡，人無佇咧。片名
    id: 'home', t0: 0, t1: 12.5, plate: 'lp01_home_fix',
    cam: [[0, { x: 960, y: 556, z: 1.04 }], [7.6, { x: 940, y: 566, z: 1.1 }], [12.5, { x: 800, y: 600, z: 1.46 }]],
    layers: [
      { fx: 'glow', x: 420, y: 130, r: 260, a: 0.35, per: 4 },
      { fx: 'dapples', area: [700, 640, 1100, 380], n: 12, a: 0.22 },
      { fx: 'dust', area: [600, 150, 1100, 650], n: 26, a: 0.8 },
      { fx: 'sparkle', area: [660, 590, 190, 90], n: 5, size: 13, t0: 8.6 },
      { fx: 'petals', area: [760, 120, 760, 480], n: 5, size: 10, speed: 26, colors: LEAF },
    ],
  },
  { // 2 新圖書館：佇遮看冊；後來位空空（人閣出門矣）
    id: 'library', t0: 12.5, t1: 17.8, feet: 925, plate: 'lp02_library_new',
    cam: [[12.5, { x: 960, z: 1.08 }], [17.8, { x: 960, z: 1.2 }]],
    layers: [
      { fx: 'glow', x: 1440, y: 100, r: 230, a: 0.35, per: 3.6 }, { fx: 'glow', x: 2400 / 3.2 * 1.0, y: 150, r: 200, a: 0.3, per: 4.2 },
      { fx: 'dapples', area: [500, 700, 1000, 300], n: 10, a: 0.2 },
      { spr: 'm2_read', h: 560, pose: [[0, 0], [15.2, 1]], keys: [[12.5, { x: 960 }]], breathe: 0.004, jit: 1.4 },
      { fx: 'sparkle', area: [800, 420, 300, 300], n: 9, size: 14, t0: 15.15, t1: 16.6, fin: 0.1, fout: 1 },
      { fx: 'dust', area: [300, 150, 1300, 600], n: 20, a: 0.7 },
      { fx: 'petals', area: [700, 120, 700, 420], n: 5, size: 10, speed: 30, colors: LEAF },
    ],
  },
  { // 3 欲去圖書館的路裡：行過樹仔跤，共你擛手
    id: 'sidewalk', t0: 17.8, t1: 27.5, feet: 925, plate: 'lp03_sidewalk',
    cam: [[17.8, { x: 860, z: 1.06 }], [27.5, { x: 980, z: 1.17 }]],
    layers: [
      { fx: 'dapples', area: [150, 680, 1500, 360], n: 14, a: 0.22 },
      { img: 'props2_4', h: 62, flip: true, free: 1, keys: [[17.8, { x: 1330, y: 905 }], [21.5, { x: 1330, y: 905 }], [22.4, { x: 1240, y: 905, lin: 1 }], [27.6, { x: 1240, y: 905 }]], bob: 12, fps: 4, jr: 2 },
      { spr: 'm1_walk', h: 540, pose: [[0, [0, 1]]], fps: 3, bob: 8, t1: 23.4, keys: [[17.4, { x: 180 }], [23.4, { x: 900, lin: 1 }]] },
      { spr: 'm3_greet', h: 545, t0: 23.4, pose: [[0, 1], [24.3, 0], [25.0, 1], [25.6, 0], [26.4, 1]], keys: [[23.4, { x: 900 }]], breathe: 0.004 },
      { fx: 'hearts', x: 900, y: 330, n: 3, t0: 24.6, size: 13, spread: 180, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'petals', area: [0, 60, 1920, 960], n: 12, size: 12, speed: 46, colors: LEAF },
    ],
  },
  { // 4 庄跤：少年時騎鐵馬過田岸
    id: 'country', t0: 27.5, t1: 39.6, feet: 925, plate: 'lp04_countryside',
    cam: [[27.5, { x: 820, z: 1.08 }], [39.6, { x: 1100, z: 1.08 }]],
    layers: [
      { img: 'props1_4', h: 120, anchor: 'center', keys: [[27, { x: 520, y: 150 }], [39.8, { x: 700, y: 150, lin: 1 }]], jit: 0, jr: 0, shadow: false },
      { img: 'props1_5', h: 64, anchor: 'center', keys: [[27, { x: 1500, y: 230 }], [39.8, { x: 1380, y: 230, lin: 1 }]], jit: 0, jr: 0, shadow: false },
      { imgs: ['props1_2', 'props1_3'], pose: [[0, [0, 1]]], fps: 3.2, h: 58, anchor: 'center', keys: [[28, { x: 1960, y: 330 }], [39.8, { x: 500, y: 210, lin: 1 }]], flip: true },
      { imgs: ['props1_2', 'props1_3'], pose: [[0, [1, 0]]], fps: 3.2, h: 44, anchor: 'center', keys: [[29.5, { x: 1960, y: 380 }], [39.8, { x: 800, y: 270, lin: 1 }]], flip: true },
      { fx: 'wind', area: [0, 560, 1920, 230], n: 4, color: 'rgba(240,246,214,.7)' },
      { spr: 'b1_bike', h: 430, pose: [[0, [0, 1]]], fps: 3.4, bob: 3, bobAlways: 1, keys: [[27.0, { x: 80 }], [39.9, { x: 1800, lin: 1 }]], jr: 0.5 },
      { fx: 'dust', area: [0, 500, 1920, 400], n: 16, a: 0.6, color: '#FFF6D8' },
    ],
  },
  { // 5 舊圖書館門口：鐵馬停好，行入去
    id: 'oldlib', t0: 39.6, t1: 43.6, feet: 925, plate: 'lp05_old_library_ext',
    cam: [[39.6, { x: 880, z: 1.08 }], [43.6, { x: 960, z: 1.2 }]],
    layers: [
      { spr: 'b2_walk', free: 1, pose: [[0, [0, 1]]], fps: 3.4, bob: 6, t0: 41.0, keys: [[41.0, { x: 760, y: 925, h: 400, a: 1 }], [42.7, { x: 945, y: 735, h: 300, a: 1, lin: 1 }], [43.3, { x: 945, y: 690, h: 270, a: 0, lin: 1 }]] },
      { spr: 'b1_bike', h: 430, pose: [[0, [0, 1]]], fps: 3.4, bob: 3, bobAlways: 1, t1: 41.0, keys: [[39.2, { x: -260 }], [41.0, { x: 610 }]], jr: 0.5 },
      { img: 'props3_0', h: 268, t0: 41.0, keys: [[41.0, { x: 610, y: 925 }]], jit: 0, jr: 0 },
      { fx: 'dapples', area: [0, 700, 1920, 300], n: 10, a: 0.18 },
      { fx: 'petals', area: [1250, 250, 660, 700], n: 6, size: 12, speed: 40 },
      { fx: 'petals', area: [0, 60, 900, 900], n: 5, size: 11, speed: 36, colors: LEAF },
    ],
  },
  { // 6 冊內底的世界：一樣一樣對冊裡跳出來
    id: 'atlas', t0: 43.6, t1: 51.4, feet: 925, plate: 'lp06_old_library_int',
    cam: [[43.6, { x: 940, z: 1.06 }], [51.4, { x: 1040, z: 1.16 }]],
    layers: [
      { fx: 'dapples', area: [1300, 700, 600, 300], n: 8, a: 0.24 },
      { fx: 'dust', area: [1100, 250, 800, 600], n: 26, a: 0.9 },
      { spr: 'b3_book', h: 580, pose: [[0, 0], [45.2, 1], [46.2, 0], [47.6, 1], [48.6, 0], [49.8, 1]], keys: [[43.6, { x: 860 }]], breathe: 0.004, jit: 1.6 },
      pop('props3_1', 1180, 500, 200, 45.0),
      pop('props3_2', 1430, 420, 190, 46.3),
      pop('props3_3', 1200, 250, 180, 47.6),
      pop('props3_4', 1560, 640, 170, 48.8),
      { fx: 'sparkle', area: [1000, 150, 720, 600], n: 14, size: 13, t0: 45 },
    ],
  },
  { // 7 引𤆬我去了解咱徛起的世界：海翁、帆船、星球佇冊架間泅
    id: 'wonder', t0: 51.4, t1: 62.0, feet: 925, plate: 'lp06_old_library_int', tr: 'fade', trDur: 0.7,
    cam: [[51.4, { x: 900, z: 1.3 }], [62.0, { x: 980, z: 1.08 }]],
    layers: [
      { fx: 'tint', color: '#5C7FA0', op: 'multiply', keys: [[51.4, { a: 0 }], [54.5, { a: 0.3 }]] },
      { fx: 'dapples', area: [1300, 700, 600, 300], n: 8, a: 0.24 },
      { img: 'props3_7', anchor: 'center', t0: 54.6, keys: [[54.6, { x: 400, y: 330, h: 30, a: 0, r: -10 }], [55.4, { x: 400, y: 250, h: 190, a: 1, r: 0 }], [62.2, { x: 440, y: 230, h: 200, a: 1, r: 8 }]], sway: [2, 5] },
      { img: 'props3_5', h: 250, anchor: 'center', keys: [[51.6, { x: -280, y: 470, r: 6 }], [62.4, { x: 1700, y: 300, r: -6, lin: 1 }]], sway: [3, 3.4], bob: 12, bobAlways: 1, fps: 0.6 },
      { img: 'props3_6', anchor: 'center', t0: 53.2, keys: [[53.2, { x: 1560, y: 520, h: 40, a: 0 }], [54.0, { x: 1540, y: 440, h: 230, a: 1 }], [62.2, { x: 1380, y: 420, h: 240, a: 1, lin: 1 }]], sway: [4, 2.8] },
      { imgs: ['props1_2', 'props1_3'], pose: [[0, [0, 1]]], fps: 3.4, h: 64, anchor: 'center', keys: [[55.5, { x: 1960, y: 250 }], [62.4, { x: 700, y: 140, lin: 1 }]], flip: true },
      { img: 'props3_1', h: 150, anchor: 'center', t0: 51.4, keys: [[51.4, { x: 1180, y: 500, a: 1 }], [52.4, { x: 1180, y: 460, a: 0 }]] },
      { spr: 'b3_book', h: 580, pose: [[0, 0], [55.0, 1], [56.0, 0], [57.2, 1]], keys: [[51.4, { x: 860 }]], breathe: 0.004, jit: 1.6 },
      { fx: 'glow', x: 1010, y: 640, r: 330, a: 0.4, per: 3, color: '255,236,180' },
      { fx: 'sparkle', area: [100, 80, 1700, 640], n: 30, size: 13, color: '#FFF3C4' },
      { fx: 'dust', area: [200, 150, 1500, 700], n: 26, a: 0.9 },
    ],
  },
];
// 有設 feet 的幕：地面上的紙偶腳底一律站在 feet，鏡頭高度跟著放大倍率算，腳才不會被字幕條蓋住
for (const sc of SCENES) {
  if (!sc.feet) continue;
  for (const [, c] of sc.cam) c.y = sc.feet - 392 / c.z;
  for (const L of sc.layers) if (L.spr && !L.clip && !L.clipCircle && !L.free) for (const [, k] of L.keys) k.y = sc.feet;
}
