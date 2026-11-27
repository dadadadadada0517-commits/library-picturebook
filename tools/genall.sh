#!/bin/zsh
# 用法：tools/genall.sh key1 key2 ...（同時最多 3 張；已有的跳過）
cd "$(dirname "$0")/.."
one(){ k=$1; case $k in lp*) d=assets/plates;; *) d=assets/sheets;; esac
  [ -f $d/$k.png ] && { echo "skip $k"; return; }
  ./gen.sh prompts/$k.txt $d/$k.png $(cat prompts/$k.refs); }
for k in "$@"; do
  while [ $(jobs -r | wc -l) -ge 3 ]; do sleep 2; done
  one $k &
done; wait; echo ALLDONE
