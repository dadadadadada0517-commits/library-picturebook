// 《咱做伙來圖書館行踏》part3：9 幕。座標都是 1920×1080。
const LEAF = ['#7C9A5B', '#A6B36A', '#C29B43'];
const pop = (img, x, y, h, t0, extra = {}) => ({ img, anchor: 'center', t0, keys: [[t0, { x, y: y + 90, h: h * 0.2, a: 0 }], [t0 + 0.45, { x, y: y - 12, h: h * 1.08, a: 1 }], [t0 + 0.7, { x, y, h, a: 1 }]], sway: [2.5, 3.2], ...extra });
const CIRCLES = [[223, 117, 69], [848, 117, 69], [1288, 125, 69], [1783, 113, 70], [95, 268, 77], [530, 173, 69], [723, 310, 70], [1071, 220, 69], [1543, 194, 71], [1797, 309, 81], [956, 398, 69], [96, 634, 70], [350, 565, 74], [908, 582, 69], [1499, 548, 76], [285, 775, 69], [619, 658, 70], [806, 780, 70], [1142, 742, 77], [1587, 738, 70], [1819, 792, 70], [515, 805, 70], [1373, 802, 70], [181, 978, 70]];
const ROUTE = [[285, 775], [619, 658], [908, 582], [1142, 742], [1499, 548], [1797, 309]];
const SCENES = [
  { // 1 分館內底：囡仔頓印仔，集章冊頂頭熟似無仝圖書館的特色
    id: 'stamp', t0: 0, t1: 10.3, feet: 925, plate: 'lp11_small_library_fix',
    cam: [[0, { x: 1000, z: 1.16 }], [10.3, { x: 940, z: 1.06 }]],
    layers: [
      { fx: 'dapples', area: [500, 680, 1000, 300], n: 9, a: 0.18 },
      { spr: 'm3_greet', h: 545, frame: 1, keys: [[0, { x: 560 }]], breathe: 0.004 },
      { spr: 'k3_stamp', h: 420, pose: [[0, 0], [2.8, 1], [5.2, 0], [7.0, 1]], keys: [[0, { x: 1080 }]], breathe: 0.003, jit: 1.8 },
      pop('props4_7', 1380, 330, 150, 2.9),
      pop('props4_5', 1560, 480, 150, 4.4),
      pop('props4_4', 1330, 560, 110, 5.8, { t1: 99 }),
      pop('props4_7', 820, 300, 130, 7.1),
      { fx: 'sparkle', area: [760, 200, 900, 460], n: 16, size: 13, t0: 2.9, color: '#FFF3C4' },
      { fx: 'hearts', x: 1080, y: 420, n: 5, t0: 3.0, size: 15, spread: 260 },
      { fx: 'dust', area: [300, 150, 1400, 600], n: 18, a: 0.7 },
    ],
  },
  { // 2 逐个圖書館攏有適合囡仔閱讀的邊仔角
    id: 'corner', t0: 10.3, t1: 19.4, feet: 925, plate: 'lp07_kids_section',
    cam: [[10.3, { x: 960, z: 1.06 }], [19.4, { x: 960, z: 1.2 }]],
    layers: [
      { fx: 'dapples', area: [400, 640, 1100, 300], n: 10, a: 0.18 },
      { spr: 'k4_floor', h: 360, pose: [[0, 0], [12.6, 1], [14.2, 0], [15.8, 1], [17.4, 0]], keys: [[10.3, { x: 940 }]], breathe: 0.004, jit: 1.6 },
      pop('props3_3', 1330, 420, 170, 12.8),
      pop('props3_4', 560, 470, 150, 14.3),
      pop('props3_5', 960, 250, 120, 15.8),
      pop('props3_2', 1560, 640, 150, 17.0),
      { fx: 'sparkle', area: [300, 160, 1300, 520], n: 18, size: 12, color: '#FFF3C4' },
      { fx: 'hearts', x: 940, y: 500, n: 4, t0: 12.6, size: 14, spread: 240, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'petals', area: [600, 60, 800, 360], n: 5, size: 10, speed: 28, colors: LEAF },
    ],
  },
  { // 3 港邊：結合在地的自然佮人文景緻
    id: 'harbor', t0: 19.4, t1: 26.6, feet: 925, plate: 'lp13_harbor',
    cam: [[19.4, { x: 860, z: 1.05 }], [26.6, { x: 1010, z: 1.1 }]],
    layers: [
      { img: 'props1_5', h: 60, anchor: 'center', keys: [[19, { x: 420, y: 150 }], [26.8, { x: 560, y: 150, lin: 1 }]], jit: 0, jr: 0, shadow: false },
      { fx: 'sparkle', area: [0, 400, 1150, 150], n: 20, size: 11 },
      { imgs: ['props1_2', 'props1_3'], pose: [[0, [0, 1]]], fps: 3.6, h: 62, anchor: 'center', keys: [[19.6, { x: -60, y: 300 }], [26.8, { x: 1200, y: 170, lin: 1 }]] },
      { imgs: ['props1_2', 'props1_3'], pose: [[0, [1, 0]]], fps: 3.6, h: 44, anchor: 'center', keys: [[21, { x: -60, y: 340 }], [26.8, { x: 800, y: 230, lin: 1 }]] },
      { spr: 'f2_walk', h: 510, pose: [[0, [0, 1]]], fps: 3.2, bob: 8, keys: [[19.0, { x: -220 }], [26.8, { x: 1130, lin: 1 }]] },
      { fx: 'wind', area: [0, 250, 1200, 300], n: 3 },
    ],
  },
  { // 4 閣加上特色好料的：檨仔冰
    id: 'ice', t0: 26.6, t1: 29.7, feet: 925, plate: 'lp13_harbor', tr: 'fade', trDur: 0.6,
    cam: [[26.6, { x: 1120, z: 1.24 }], [29.7, { x: 1120, z: 1.34 }]],
    layers: [
      { fx: 'sparkle', area: [0, 400, 1150, 150], n: 20, size: 11 },
      { spr: 'f5_ice', h: 540, pose: [[0, 0], [27.8, 1]], keys: [[26.6, { x: 1110 }]], breathe: 0.004 },
      pop('props4_2', 1420, 420, 170, 27.0),
      { fx: 'hearts', x: 1110, y: 400, n: 5, t0: 27.6, size: 15, spread: 280, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'sparkle', area: [1310, 300, 220, 220], n: 6, size: 12, t0: 27.2, color: '#FFE9A8' },
    ],
  },
  { // 5 地圖：成做一條行讀的路線
    id: 'route', t0: 29.7, t1: 33.7, plate: 'lp09_stamp_map',
    cam: [[29.7, { x: 960, y: 540, z: 1.0 }], [33.7, { x: 980, y: 520, z: 1.08 }]],
    layers: [
      { fx: 'stamps', list: CIRCLES, imgs: ['props4_5', 'props4_7', 'props4_5'], t0: 0, every: 0 },
      ...ROUTE.slice(0, -1).map((p, i) => ({ fx: 'route', from: p, to: ROUTE[i + 1], bend: 50, t0: 30.0 + i * 0.55, dur: 0.55, color: '#B8402E', outline: '#F7F0E0', w: 12, dash: [2, 26] })),
      pop('props4_4', 619, 540, 110, 30.5),
      pop('props4_2', 1142, 610, 130, 31.6),
      pop('props1_1', 1499, 430, 90, 32.2),
      { fx: 'sparkle', area: [0, 0, 1920, 900], n: 20, size: 12 },
    ],
  },
  { // 6 這个時陣你若來揣我，我無的確有佇厝裡
    id: 'home', t0: 33.7, t1: 39.3, plate: 'lp01_home_fix',
    cam: [[33.7, { x: 960, y: 560, z: 1.06 }], [39.3, { x: 820, y: 600, z: 1.4 }]],
    layers: [
      { fx: 'glow', x: 420, y: 130, r: 260, a: 0.35, per: 4 },
      { fx: 'dapples', area: [700, 640, 1100, 380], n: 12, a: 0.22 },
      { fx: 'dust', area: [600, 150, 1100, 650], n: 26, a: 0.8 },
      { fx: 'sparkle', area: [640, 590, 220, 100], n: 6, size: 13, t0: 36.6 },
      { fx: 'petals', area: [760, 120, 760, 480], n: 5, size: 10, speed: 26, colors: LEAF },
    ],
  },
  { // 7 我凡勢是欲去圖書館的路裡
    id: 'onway', t0: 39.3, t1: 44.9, plate: 'lp03_sidewalk',
    cam: [[39.3, { x: 960, y: 610, z: 1.05 }], [44.9, { x: 950, y: 520, z: 1.24 }]],
    layers: [
      { fx: 'glow', x: 930, y: 420, r: 300, a: 0.3, per: 3 },
      { spr: 'f7_back', pose: [[0, [0, 1]]], fps: 3, bob: 6, keys: [[39.3, { x: 960, y: 945, h: 450 }], [45.1, { x: 948, y: 790, h: 270, lin: 1 }]] },
      { fx: 'dapples', area: [150, 600, 1500, 440], n: 14, a: 0.22 },
      { fx: 'petals', area: [0, 60, 1920, 960], n: 12, size: 12, speed: 46, colors: LEAF },
    ],
  },
  { // 8 諸位佮意閱讀的好朋友，來高雄一定愛來踅圖書館
    id: 'greet', t0: 44.9, t1: 51.6, feet: 925, plate: 'lp03_sidewalk', tr: 'fade', trDur: 0.7,
    cam: [[44.9, { x: 940, z: 1.1 }], [51.6, { x: 960, z: 1.22 }]],
    layers: [
      { fx: 'dapples', area: [150, 680, 1500, 360], n: 14, a: 0.22 },
      { spr: 'f6_greet', h: 550, pose: [[0, 0], [46.6, 1], [47.8, 0], [49.0, 1], [50.2, 0]], keys: [[44.9, { x: 960 }]], breathe: 0.004 },
      { fx: 'hearts', x: 960, y: 330, n: 6, t0: 45.6, size: 16, spread: 360, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'sparkle', area: [500, 150, 920, 300], n: 12, size: 12 },
      { fx: 'petals', area: [0, 60, 1920, 960], n: 14, size: 12, speed: 46, colors: LEAF },
    ],
  },
  { // 9 暗頭仔的圖書館：閱讀的風氣傳承到後一代
    id: 'dusk', t0: 51.6, t1: 64.1, plate: 'lp14_library_dusk',
    cam: [[51.6, { x: 960, y: 570, z: 1.04 }], [64.1, { x: 955, y: 500, z: 1.2 }]],
    layers: [
      { spr: 'f7_back', pose: [[0, [0, 1]], [58.4, 0]], fps: 2.6, bob: 6, keys: [[51.6, { x: 960, y: 940, h: 430 }], [58.4, { x: 952, y: 830, h: 290, lin: 1 }], [64.2, { x: 952, y: 830, h: 290 }]] },
      { fx: 'tint', color: '#6C7FB0', op: 'multiply', keys: [[51, { a: 0.2 }], [58, { a: 0.42 }]] },
      { fx: 'glow', x: 950, y: 330, r: 760, a: 0.34, per: 5, color: '255,214,130' },
      { fx: 'glow', x: 192, y: 508, r: 190, a: 0.5, per: 3 }, { fx: 'glow', x: 1808, y: 476, r: 190, a: 0.5, per: 3.6 },
      { fx: 'sparkle', area: [0, 0, 1920, 210], n: 16, size: 9, color: '#FFF3C4' },
      { fx: 'dust', area: [100, 480, 1700, 420], n: 26, a: 0.9, color: '#FFE39A' },
      { fx: 'hearts', x: 952, y: 500, n: 4, t0: 58.8, size: 14, spread: 240, colors: ['#C29B43', '#E9C46A', '#F0D9A0'] },
    ],
  },
];
for (const sc of SCENES) {
  if (!sc.feet) continue;
  for (const [, c] of sc.cam) c.y = sc.feet - 392 / c.z;
  for (const L of sc.layers) if (L.spr && !L.clip && !L.clipCircle && !L.free) for (const [, k] of L.keys) k.y = sc.feet;
}
