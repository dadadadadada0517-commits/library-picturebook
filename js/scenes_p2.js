// 《咱做伙來圖書館行踏》part2：11 幕。座標都是 1920×1080。
const LEAF = ['#7C9A5B', '#A6B36A', '#C29B43'];
const pop = (img, x, y, h, t0, extra = {}) => ({ img, anchor: 'center', t0, keys: [[t0, { x, y: y + 90, h: h * 0.2, a: 0 }], [t0 + 0.45, { x, y: y - 12, h: h * 1.08, a: 1 }], [t0 + 0.7, { x, y, h, a: 1 }]], sway: [2.5, 3.2], ...extra });
const CIRCLES = [[223, 117, 69], [848, 117, 69], [1288, 125, 69], [1783, 113, 70], [95, 268, 77], [530, 173, 69], [723, 310, 70], [1071, 220, 69], [1543, 194, 71], [1797, 309, 81], [956, 398, 69], [96, 634, 70], [350, 565, 74], [908, 582, 69], [1499, 548, 76], [285, 775, 69], [619, 658, 70], [806, 780, 70], [1142, 742, 77], [1587, 738, 70], [1819, 792, 70], [515, 805, 70], [1373, 802, 70], [181, 978, 70]];
const NIGHT = [{ fx: 'glow', x: 160, y: 220, r: 520, a: 0.42, per: 4 }, { fx: 'sparkle', area: [1344, 40, 440, 360], n: 8, size: 7, color: '#FFE9A8' }];
const SCENES = [
  { // 1 暗時厝裡：三个人做伙看繪本
    id: 'sofa', t0: 0, t1: 12.2, feet: 925, plate: 'lp08_home_night',
    cam: [[0, { x: 900, z: 1.06 }], [12.2, { x: 860, z: 1.2 }]],
    layers: [
      ...NIGHT,
      { img: 'props4_4', h: 120, free: 1, keys: [[0, { x: 1560, y: 900 }]], jit: 0, jr: 0 },
      { spr: 'f1_sofa', h: 610, pose: [[0, 0], [4.2, 1], [6.0, 0], [7.6, 1], [9.4, 0], [10.6, 1]], keys: [[0, { x: 820 }]], breathe: 0.003, jit: 1.6 },
      pop('props4_3', 1330, 800, 200, 5.0),
      { fx: 'sparkle', area: [1220, 600, 240, 200], n: 7, size: 12, t0: 5.2, color: '#FFE9A8' },
      { fx: 'hearts', x: 820, y: 330, n: 5, t0: 7.4, size: 15, spread: 280 },
      { fx: 'dust', area: [100, 200, 900, 500], n: 16, a: 0.6 },
    ],
  },
  { // 2 囡仔家己坐佇塗跤看，看甲足煞心
    id: 'floor', t0: 12.2, t1: 16.3, feet: 925, plate: 'lp08_home_night', tr: 'fade', trDur: 0.7,
    cam: [[12.2, { x: 1290, z: 1.2 }], [16.3, { x: 1330, z: 1.3 }]],
    layers: [
      ...NIGHT,
      { spr: 'k4_floor', h: 350, pose: [[0, 0], [13.6, 1], [15.2, 0]], keys: [[12.2, { x: 1150 }]], breathe: 0.004, jit: 1.6 },
      { img: 'props4_3', h: 200, free: 1, anchor: 'center', keys: [[12, { x: 1600, y: 820 }]], jit: 0.5, jr: 0.4 },
      pop('props3_2', 1520, 560, 120, 13.0),
      pop('props3_4', 1700, 600, 110, 14.0),
      { fx: 'sparkle', area: [1420, 460, 380, 300], n: 9, size: 12, color: '#FFE9A8' },
      { fx: 'hearts', x: 1150, y: 520, n: 3, t0: 13.4, size: 13, spread: 180 },
    ],
  },
  { // 3 歇睏日：囡仔央阿爸𤆬𪜶去圖書館，三个人出門
    id: 'ask', t0: 16.3, t1: 24.6, feet: 925, plate: 'lp01_home_fix',
    cam: [[16.3, { x: 1100, z: 1.08 }], [24.6, { x: 1220, z: 1.16 }]],
    layers: [
      { fx: 'dapples', area: [700, 640, 1100, 380], n: 12, a: 0.2 },
      { spr: 'f4_amazed', free: 1, h: 450, t1: 21.0, pose: [[0, 0], [17.2, 1], [18.3, 0], [19.2, 1], [20.2, 0]], bob: 5, bobAlways: 1, fps: 2.4, keys: [[16.3, { x: 1330, y: 795 }]] },
      { spr: 'f2_walk', free: 1, h: 450, t0: 21.0, pose: [[0, [0, 1]]], fps: 3.2, bob: 8, keys: [[21.0, { x: 1330, y: 795 }], [24.8, { x: 2250, y: 795, lin: 1 }]] },
      { fx: 'bubble', x: 1600, y: 300, t0: 17.0, t1: 20.8, icon: 'note', tail: -1, r: 58 },
      { fx: 'hearts', x: 1330, y: 320, n: 4, t0: 19.0, t1: 21.4, size: 14, spread: 240, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'dust', area: [600, 150, 1100, 650], n: 20, a: 0.7 },
    ],
  },
  { // 4 食飯桌：規家伙仔有仝款的話題
    id: 'dinner', t0: 24.6, t1: 30.5, feet: 925, plate: 'lp08_home_night',
    cam: [[24.6, { x: 960, z: 1.12 }], [30.5, { x: 960, z: 1.24 }]],
    layers: [
      ...NIGHT,
      { fx: 'tint', color: '#F0C080', op: 'multiply', keys: [[24, { a: 0.18 }], [31, { a: 0.18 }]] },
      { spr: 'f3_dinner', h: 520, pose: [[0, 0], [26.4, 1], [27.6, 0], [28.6, 1]], keys: [[24.6, { x: 960 }]], breathe: 0.003, jit: 1.6 },
      { fx: 'steam', x: 950, y: 610, rise: 90 },
      { fx: 'bubble', x: 690, y: 330, t0: 25.2, t1: 26.6, icon: 'note', tail: 1 },
      { fx: 'bubble', x: 1240, y: 340, t0: 26.7, t1: 28.0, icon: 'sun', tail: -1 },
      { fx: 'bubble', x: 960, y: 270, t0: 28.1, t1: 29.6, icon: 'heart', tail: 1 },
      { fx: 'hearts', x: 960, y: 380, n: 5, t0: 28.4, size: 15, spread: 320 },
    ],
  },
  { // 5 高雄市圖書館總館起好了後：行過樹仔跤，去總館
    id: 'main', t0: 30.5, t1: 37.6, plate: 'lp03_sidewalk',
    cam: [[30.5, { x: 960, y: 600, z: 1.05 }], [37.6, { x: 950, y: 500, z: 1.3 }]],
    layers: [
      { fx: 'glow', x: 930, y: 420, r: 300, a: 0.35, per: 3 },
      { fx: 'sparkle', area: [760, 250, 360, 240], n: 9, size: 11 },
      { spr: 'f7_back', pose: [[0, [0, 1]]], fps: 3, bob: 6, keys: [[30.5, { x: 960, y: 945, h: 450 }], [37.8, { x: 945, y: 760, h: 230, lin: 1 }]] },
      { fx: 'dapples', area: [150, 600, 1500, 440], n: 14, a: 0.22 },
      { fx: 'petals', area: [0, 60, 1920, 960], n: 12, size: 12, speed: 46, colors: LEAF },
    ],
  },
  { // 6 囡仔區：歇睏常在來𨑨迌的所在
    id: 'kids', t0: 37.6, t1: 43.0, feet: 925, plate: 'lp07_kids_section',
    cam: [[37.6, { x: 900, z: 1.06 }], [43.0, { x: 1000, z: 1.16 }]],
    layers: [
      { fx: 'dapples', area: [400, 640, 1100, 300], n: 10, a: 0.18 },
      { spr: 'm2_read', h: 540, frame: 0, keys: [[37.6, { x: 520 }]], breathe: 0.004, jit: 1.2 },
      { spr: 'k2_shelf', h: 450, pose: [[0, 0], [39.6, 1], [41.0, 0], [42.0, 1]], keys: [[37.6, { x: 1180 }]], breathe: 0.003, bob: 4, bobAlways: 1, fps: 1.6 },
      { fx: 'hearts', x: 1180, y: 420, n: 4, t0: 39.6, size: 14, spread: 220, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'sparkle', area: [300, 160, 1300, 260], n: 12, size: 11 },
      { fx: 'petals', area: [600, 60, 800, 360], n: 5, size: 10, speed: 28, colors: LEAF },
    ],
  },
  { // 7 我本底嘛毋知高雄到底有偌濟間圖書館
    id: 'puzzle', t0: 43.0, t1: 51.6, feet: 925, plate: 'lp02_library_new',
    cam: [[43.0, { x: 960, z: 1.08 }], [51.6, { x: 990, z: 1.2 }]],
    layers: [
      { fx: 'glow', x: 1440, y: 100, r: 230, a: 0.35, per: 3.6 },
      { fx: 'dapples', area: [500, 700, 1000, 300], n: 10, a: 0.2 },
      { spr: 'm4_map', h: 480, pose: [[0, 0], [47.0, 1], [48.0, 0], [50.2, 1]], keys: [[43.0, { x: 940 }]], breathe: 0.004, jit: 1.4 },
      { fx: 'bubble', x: 1120, y: 330, t0: 44.0, t1: 46.9, icon: 'q', tail: -1, r: 60 },
      { fx: 'bubble', x: 1140, y: 340, t0: 48.2, t1: 50.1, icon: 'q', tail: -1, r: 60 },
      { fx: 'bubble', x: 760, y: 360, t0: 48.6, t1: 50.1, icon: 'q', tail: 1, r: 46 },
      { fx: 'dust', area: [300, 150, 1300, 600], n: 20, a: 0.7 },
    ],
  },
  { // 8 集章地圖：一間一間頓落去，原來有六十一个分館
    id: 'map', t0: 51.6, t1: 61.0, plate: 'lp09_stamp_map',
    cam: [[51.6, { x: 960, y: 540, z: 1.0 }], [61.0, { x: 960, y: 520, z: 1.07 }]],
    layers: [
      { fx: 'stamps', list: CIRCLES, imgs: ['props4_5', 'props4_7', 'props4_5'], t0: 52.2, every: 0.2 },
      { fx: 'sparkle', area: [0, 0, 1920, 900], n: 22, size: 12, t0: 53 },
      { fx: 'badge', x: 1330, y: 500, r: 190, text: '61', sub: '个分館', t0: 56.8, t1: 61.4 },
      { fx: 'hearts', x: 1330, y: 300, n: 5, t0: 57.2, size: 15, spread: 340, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
    ],
  },
  { // 9 社區活動中心：真濟小型分館佇樓尾頂
    id: 'center', t0: 61.0, t1: 68.2, feet: 925, plate: 'lp10_community_center_fix',
    cam: [[61.0, { x: 900, z: 1.04 }], [68.2, { x: 1000, z: 1.12 }]],
    layers: [
      { fx: 'glow', x: 860, y: 190, r: 420, a: 0.4, per: 2.4, t0: 64.6, fin: 1 },
      { fx: 'sparkle', area: [440, 130, 860, 130], n: 14, size: 13, t0: 64.8 },
      { imgs: ['props1_2', 'props1_3'], pose: [[0, [0, 1]]], fps: 3.4, h: 56, anchor: 'center', keys: [[61.5, { x: 1960, y: 150 }], [68.4, { x: 600, y: 60, lin: 1 }]], flip: true },
      { spr: 'f2_walk', h: 500, t1: 65.4, pose: [[0, [0, 1]]], fps: 3.2, bob: 8, keys: [[60.6, { x: -200 }], [65.4, { x: 760, lin: 1 }]] },
      { spr: 'f4_amazed', h: 500, t0: 65.4, pose: [[0, 0], [67.0, 1]], keys: [[65.4, { x: 760 }]], breathe: 0.004 },
      { fx: 'bubble', x: 1010, y: 420, t0: 65.8, t1: 68.0, icon: 'q', tail: -1, r: 54 },
      { fx: 'petals', area: [0, 60, 700, 800], n: 6, size: 11, speed: 38, colors: LEAF },
    ],
  },
  { // 10 集章冊：為著欲頓印仔
    id: 'stamp', t0: 68.2, t1: 73.0, tr: 'drop', trDur: 0.8,
    cam: [[68.2, { x: 960, y: 540, z: 1.0 }], [73.0, { x: 960, y: 530, z: 1.06 }]],
    layers: [
      { fx: 'paperbg', color: '#E9DDBF' },
      { img: 'props4_1', h: 620, anchor: 'center', keys: [[68, { x: 960, y: 500, r: -2 }]], jit: 0, jr: 0 },
      { fx: 'stamps', list: [[1144, 291, 60]], imgs: ['props4_7'], t0: 69.45, every: 1 },
      { fx: 'stamps', list: [[1144, 469, 60]], imgs: ['props4_7'], t0: 70.95, every: 1 },
      { fx: 'stamps', list: [[780, 643, 60]], imgs: ['props4_7'], t0: 72.25, every: 1 },
      { img: 'props4_0', h: 300, keys: [[68.2, { x: 1500, y: 330, r: 8 }], [69.15, { x: 1144, y: 250, r: 0 }], [69.4, { x: 1144, y: 332, r: 0 }], [69.75, { x: 1144, y: 210, r: -4 }], [70.65, { x: 1144, y: 410, r: 0 }], [70.9, { x: 1144, y: 510, r: 0 }], [71.2, { x: 1100, y: 390, r: -4 }], [71.95, { x: 780, y: 590, r: 0 }], [72.2, { x: 780, y: 684, r: 0 }], [72.55, { x: 760, y: 540, r: -6 }], [73.2, { x: 700, y: 480, r: -8 }]], jit: 0.6, jr: 0.3 },
      { fx: 'sparkle', area: [1040, 190, 220, 200], n: 5, size: 13, t0: 69.45, t1: 70.6, fin: 0.1, fout: 0.8 },
      { fx: 'sparkle', area: [1040, 370, 220, 200], n: 5, size: 13, t0: 70.95, t1: 72.1, fin: 0.1, fout: 0.8 },
      { fx: 'sparkle', area: [680, 540, 220, 200], n: 5, size: 13, t0: 72.25, fin: 0.1 },
    ],
  },
  { // 11 行入去：厝尾頂竟然有圖書館
    id: 'rooftop', t0: 73.0, t1: 83.2, feet: 925, plate: 'lp11_small_library_fix',
    cam: [[73.0, { x: 880, z: 1.05 }], [83.2, { x: 1000, z: 1.16 }]],
    layers: [
      { fx: 'dapples', area: [500, 680, 1000, 300], n: 9, a: 0.18 },
      { spr: 'f2_walk', h: 500, t1: 75.8, pose: [[0, [0, 1]]], fps: 3.2, bob: 8, keys: [[72.6, { x: -260 }], [75.8, { x: 640, lin: 1 }]] },
      { spr: 'f4_amazed', h: 500, t0: 75.8, pose: [[0, 0], [78.0, 1], [79.4, 0], [80.6, 1], [82.0, 0]], keys: [[75.8, { x: 640 }]], breathe: 0.004 },
      pop('props4_4', 1250, 430, 130, 77.2),
      pop('props4_3', 1500, 520, 170, 78.4),
      pop('props3_1', 1330, 250, 130, 79.6),
      { fx: 'sparkle', area: [900, 150, 900, 560], n: 20, size: 13, t0: 76.4, color: '#FFF3C4' },
      { fx: 'hearts', x: 660, y: 380, n: 5, t0: 78.0, size: 15, spread: 280, colors: ['#C29B43', '#E9C46A', '#B75B45'] },
      { fx: 'dust', area: [300, 150, 1400, 600], n: 20, a: 0.7 },
    ],
  },
];
for (const sc of SCENES) {
  if (!sc.feet) continue;
  for (const [, c] of sc.cam) c.y = sc.feet - 392 / c.z;
  for (const L of sc.layers) if (L.spr && !L.clip && !L.clipCircle && !L.free) for (const [, k] of L.keys) k.y = sc.feet;
}
