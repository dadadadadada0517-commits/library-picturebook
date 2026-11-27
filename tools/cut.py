# 把洋紅底的紙偶圖去背並切成一格一格
# 用法：python3 tools/cut.py <sheet名> <欄數> [列數=1]   → assets/sprites/<名>_<i>.png
import sys, os, numpy as np
from PIL import Image, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def key(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g                      # 洋紅程度
    alpha = 1 - np.clip((m - 28) / (120 - 28), 0, 1)
    bg = np.median(a[:12, :12].reshape(-1, 3), axis=0)
    al = np.clip(alpha, 0.02, 1)[..., None]
    rgb = np.clip((a - (1 - al) * bg) / al, 0, 255)  # 把邊緣混到的洋紅扣掉
    # 邊緣再壓一下洋紅殘色
    spill = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None) * (alpha < 0.98)
    rgb[..., 0] -= spill; rgb[..., 2] -= spill
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    im2 = Image.fromarray(out, 'RGBA')
    # alpha 收 1px，去掉剪影外圈的細邊
    al2 = im2.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    im2.putalpha(al2)
    return im2


def runs(proj, n, mingap=10):
    idx = np.where(proj)[0]
    if len(idx) == 0: return []
    rs = []; s = idx[0]; p = idx[0]
    for i in idx[1:]:
        if i - p > mingap: rs.append([s, p]); s = i
        p = i
    rs.append([s, p])
    rs = [r for r in rs if r[1] - r[0] > 6]
    while len(rs) > n:                              # 合併間隔最小的兩段
        gaps = [rs[i + 1][0] - rs[i][1] for i in range(len(rs) - 1)]
        i = int(np.argmin(gaps)); rs[i] = [rs[i][0], rs[i + 1][1]]; del rs[i + 1]
    return rs


def main():
    name, cols = sys.argv[1], int(sys.argv[2]); rows = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    im = key(Image.open(f'{ROOT}/assets/sheets/{name}.png'))
    A = np.asarray(im.getchannel('A')) > 60
    os.makedirs(f'{ROOT}/assets/sprites', exist_ok=True)
    k = 0
    for (y0, y1) in runs(A.any(axis=1), rows):
        for (x0, x1) in runs(A[y0:y1 + 1].any(axis=0), cols):
            sub = A[y0:y1 + 1, x0:x1 + 1]; ys = np.where(sub.any(axis=1))[0]
            box = (max(0, x0 - 6), max(0, y0 + ys[0] - 6), min(im.width, x1 + 7), min(im.height, y0 + ys[-1] + 7))
            im.crop(box).save(f'{ROOT}/assets/sprites/{name}_{k}.png'); k += 1
    print(name, k, 'frames')


main()
