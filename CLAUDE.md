# /Users/yo/claude — ワークスペース構造

## ディレクトリ構成

```
/Users/yo/claude/
├── [学習ノートサイト — GitHub Pages: leafhoja.github.io/study]
│   ├── index.html          ホーム
│   ├── common.css / common.js / manifest.json / icons/
│   ├── 熱力学/             熱力学講義ノート（ch0〜ch5）
│   ├── 線形代数学/         線形代数 解説ノート（s1〜s3）
│   ├── 現代経済理論/       過去問解説（2023〜2025年）
│   └── すかき演習/         微積・線形代数 演習（calculus/linear）
│
├── [その他プロジェクト — gitignore済]
│   ├── news/               ニュースアグリゲーター（Flask + SQLite + Ollama）
│   ├── スペイン語/         スペイン語学習サイト（別 git repo, デプロイ済）
│   ├── スペイン語学習/     スペイン語クイズアプリ（別 git repo, デプロイ済）
│   ├── スポ身/             体育レポート・トレーニングログ
│   └── Projects/           その他
│
└── push-all.sh             スペイン語 2リポジトリを同時 push
```

## よく使うコマンド

### 学習ノートサイトをデプロイ
```bash
git add -A && git commit -m "..." && git push
```

### ニュースアグリゲーター
```bash
cd news
python3 fetch_news.py      # 取得→スコアリング→DB保存→HTML生成
python3 server.py          # サーバー起動 → http://localhost:8765
```

### スペイン語サイトをデプロイ
```bash
bash push-all.sh
```

## 各プロジェクトの詳細
- `news/CLAUDE.md` — news アプリの仕様・制約
- `スペイン語/CLAUDE.md` — スペイン語サイトの開発ルール
- `スポ身/CLAUDE.md` — 体育レポートの課題要件
