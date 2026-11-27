# 咱做伙來圖書館行踏｜動態繪本版

台語散文〈咱做伙來圖書館行踏〉（作者：張浩盛，本土語輔導團「本土語02」）的畫面重製版。
聲音（台語旁白與配樂）沿用原片，畫面改成剪紙拼貼風的紙偶動畫，共三段。

**線上看：https://pokemonida99.github.io/library-picturebook/**
（點畫面播放，下方可切換第一、二、三段，一段播完會自動接下一段）

成品影片（1080p mp4）放在 [Releases](https://github.com/pokemonida99/library-picturebook/releases)。

## 這個版本怎麼做的

- 背景與角色：用 GPT 生成剪紙拼貼風插圖。背景是沒有人的空景；人物另外生成洋紅底的「兩格姿勢圖」，再用程式去背、切格。
- 動畫：全部用程式（Canvas）做。紙偶一秒動 12 格、換姿勢、走位；鏡頭慢推；撕紙翻頁轉場；光斑、落葉、愛心、亮點等特效；字幕做成紙條。
- 聲音：原片音軌整軌照搬，不重新編碼。字幕文字與時間都照原片。

## 檔案

| 位置 | 內容 |
|---|---|
| `index.html` | 播放頁，`?part=1｜2｜3` 選段 |
| `js/data_p1～3.js` | 每段的字幕與時間 |
| `js/scenes_p1～3.js` | 每段的分鏡：背景、鏡頭、紙偶走位、特效 |
| `js/engine.js` | 動畫引擎 |
| `assets/plates/` | 背景原圖（png，出片用）；`assets/plates_web/` 是網頁播放用的小檔 |
| `assets/sheets/`、`assets/sprites/` | 紙偶姿勢圖（洋紅底原圖）與去背切好的格 |
| `chars/` | 角色設定圖 |
| `prompts/`、`tools/prompts.py` | 生圖提示詞 |
| `src/audio_p1～3.m4a` | 原片聲音 |

## 重做流程

1. 提示詞：`python3 tools/prompts.py`
2. 生圖：`tools/genall.sh <key>...`（`lp*` 是背景，其餘是洋紅底紙偶圖；用的是 ChatGPT 桌面版內建的 codex CLI）
3. 去背切格：`python3 tools/cut.py <名> <欄> [列]`，再跑 `python3 tools/anchors.py`
4. 檢查紙偶的腳有沒有被字幕蓋到：`node tools/feet.mjs 2`
5. 看畫面：`node export.mjs stills --part=2 3 6 11 ...` → `out/stills/p2_sheet_N.jpg`
6. 出片：`node export.mjs film part2 --part=2`（需要 `puppeteer-core`、本機的 Google Chrome 與 ffmpeg）

## 權利說明

- 文章、台語旁白錄音與配樂屬原作者與原製作單位所有，這裡只為呈現重製畫面而沿用。
- 字型：霞鶩文楷 TC（LXGW WenKai TC），SIL Open Font License 1.1。
- 插圖由 AI 生成，圖中的圖書館、街景、港邊都是示意，不是實景。
