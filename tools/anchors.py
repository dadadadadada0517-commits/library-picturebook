# 算每格紙偶的「腳底中心」當定位點（換姿勢時身體才不會左右跳）→ assets/sprites/anchors.json
import glob, os, json, numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = {}
for f in sorted(glob.glob(f'{ROOT}/assets/sprites/*.png')):
    a = np.asarray(Image.open(f).getchannel('A')) > 80; h = a.shape[0]
    xs = np.where(a[int(h * 0.90):].any(axis=0))[0]
    out[os.path.basename(f)[:-4]] = round(float((xs[0] + xs[-1]) / 2), 1) if len(xs) else a.shape[1] / 2
json.dump(out, open(f'{ROOT}/assets/sprites/anchors.json', 'w'), indent=0)
print(len(out), 'anchors')
