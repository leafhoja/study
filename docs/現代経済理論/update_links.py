#!/usr/bin/env python3
"""
現代経済理論 — 過去問ページ 授業リンク更新スクリプト
=======================================================
使い方:
  python3 update_links.py

やること:
  lecture_map.json の exam_links を読み取り、
  各年度の過去問ページ（*kakomon.html）の該当問題に
  「→ 第N回」というリンクバッジを自動挿入・更新する。

新しい授業回（第1〜3回や第12〜13回）のノートを作ったとき:
  1. lecture_map.json の lectures セクションに講師名・トピックを記入
  2. lecture_map.json の exam_links の各年度に
     「"問題番号": 授業回番号」を追加（必ず2問または0問）
  3. このスクリプトを実行

新しい年度の過去問ページを追加したとき:
  1. 過去問ページ（例: 2026kakomon.html）を作成
  2. lecture_map.json の kakomon_files に追加
  3. lecture_map.json の exam_links に新年度の問題→授業回マッピングを追加
  4. このスクリプトを実行
"""

import json
import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MAP_FILE   = os.path.join(SCRIPT_DIR, 'lecture_map.json')


def load_map():
    with open(MAP_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def update_kakomon(filepath, year, mapping):
    if not os.path.exists(filepath):
        print(f'[SKIP] ファイルが存在しません: {filepath}')
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changed = []

    for qnum_str, lec_num in sorted(mapping.items(), key=lambda x: int(x[0])):
        qnum = int(qnum_str)
        lec  = int(lec_num)
        new_link = f'<a href="授業/第{lec}回.html" class="lec-ref-link">→ 第{lec}回</a>'

        # マッチ対象: badge + q-topic span + 既存リンク（あれば）を一括置換
        # → 冪等（何度実行しても重複しない）
        pattern = (
            rf'(<div class="q-num-badge">{qnum}</div>'
            rf'.*?<span class="q-topic">.*?</span>)'
            rf'(?:<a[^>]*class="lec-ref-link"[^>]*>.*?</a>)?'
        )

        def replacer(m, link=new_link):
            return m.group(1) + link

        new_content = re.sub(pattern, replacer, content, count=1, flags=re.DOTALL)
        if new_content != content:
            content = new_content
            changed.append(f'Q{qnum}→第{lec}回')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'[OK] {year}: {", ".join(changed)}  ({os.path.basename(filepath)})')
    else:
        print(f'[--] {year}: 変更なし')


def main():
    data = load_map()
    base = SCRIPT_DIR
    kakomon_files = data.get('kakomon_files', {})
    exam_links    = data.get('exam_links', {})

    if not exam_links:
        print('exam_links が空です。lecture_map.json を確認してください。')
        sys.exit(1)

    for year, mapping in sorted(exam_links.items()):
        filename = kakomon_files.get(year)
        if not filename:
            print(f'[WARN] {year}: kakomon_files に登録されていません。スキップ。')
            continue
        filepath = os.path.join(base, filename)
        update_kakomon(filepath, year, mapping)

    print('\n完了。変更を確認してから git push してください。')


if __name__ == '__main__':
    main()
