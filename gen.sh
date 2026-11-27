#!/bin/zsh
# 用法：./gen.sh <提示詞檔> <輸出 png> [參考圖...]
# 用 ChatGPT.app 內建 codex 生一張圖，只取自己那個 thread 的圖
CODEX=/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex
P="$(cat "$1")"; OUT="$2"; shift 2
LOG="${OUT%.png}.jsonl"
REFS=(); for r in "$@"; do REFS+=(-i "$r"); done
"$CODEX" exec --json --skip-git-repo-check "Generate one image with your image generation tool: $P Do not run any shell commands." "${REFS[@]}" < /dev/null > "$LOG" 2> "${OUT%.png}.err"
TID=$(grep -o '"thread_id":"[^"]*"' "$LOG" | head -1 | cut -d'"' -f4)
IMG=$(ls -t ~/.codex/generated_images/$TID/*.png 2>/dev/null | head -1)
if [ -n "$IMG" ]; then cp "$IMG" "$OUT"; echo "ok $OUT"; else echo "FAIL $OUT (thread $TID)"; fi
