# my-agent

個人PM管理・ナレッジベースシステム。複数プロジェクトのドキュメントをMDX形式で管理するNext.jsアプリ。

---

## ディレクトリ構成

```
my-agent/
├── app/                        # Next.js App Router
│   ├── [pj]/                   # プロジェクト別ページ
│   │   ├── [...slug]/
│   │   │   └── page.tsx        # MDXページ（動的ルーティング）
│   │   ├── layout.tsx          # プロジェクトレイアウト（サイドバー付き）
│   │   └── page.tsx            # プロジェクトトップページ
│   ├── layout.tsx              # ルートレイアウト（認証含む）
│   ├── page.tsx                # ホームページ（ログイン or PJ一覧）
│   └── globals.css
├── components/
│   ├── PJSidebar.tsx           # サイドバーナビゲーション
│   └── MDXContent.tsx          # MDXレンダラー
├── lib/
│   └── mdx.ts                  # MDX読み込み・ナビゲーション生成
├── content/                    # コンテンツ（ここにPJを追加する）
│   ├── pj1/                    # プロジェクト1
│   │   ├── _pj.json            # プロジェクトメタデータ
│   │   ├── 概要.mdx
│   │   └── メモ.mdx
│   └── pj2/                    # プロジェクト2
│       ├── _pj.json
│       ├── 概要.mdx
│       └── メモ.mdx
├── .env.local                  # 環境変数（要作成）
├── .env.example                # 環境変数のサンプル
└── CLAUDE.md                   # Claude Code向けプロジェクトルール
```

---

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、値を設定する。

```bash
cp .env.example .env.local
```

```env
PASSWORD=your_password_here          # ログインパスワード
CHATWORK_API_TOKEN=your_token_here   # Chatwork APIトークン（任意）
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く。

---

## 使い方

### ログイン

トップページでパスワードを入力してログイン（`.env.local` の `PASSWORD` に設定した値）。

### プロジェクトの追加

1. `content/` 以下にディレクトリを作成（ディレクトリ名がURLになる）
2. `_pj.json` を作成してプロジェクト情報を定義
3. MDXファイルを追加

```bash
content/
└── my-new-project/
    ├── _pj.json
    └── 概要.mdx
```

#### `_pj.json` のフォーマット

```json
{
  "name": "プロジェクト名",
  "description": "プロジェクトの説明",
  "phase": "進行中",
  "role": "PM",
  "joinDate": "2026-01-01",
  "status": "active",
  "color": "#6366f1"
}
```

| フィールド | 説明 |
|-----------|------|
| `name` | サイドバーに表示されるプロジェクト名 |
| `description` | プロジェクトの説明文 |
| `phase` | 現在のフェーズ（例: 計画中 / 進行中 / 完了） |
| `role` | 自分の役割 |
| `joinDate` | 参加日（YYYY-MM-DD） |
| `status` | `active` または `archived` |
| `color` | サイドバーのアクセントカラー（CSSカラーコード） |

### MDXファイルの書き方

ファイル先頭にフロントマターを記述する。

```mdx
---
title: ページタイトル
description: ページの説明
tags: [タグ1, タグ2]
date: 2026-01-01
---

## 見出し

本文をここに書く。
```

> **注意:** HTMLコメント `<!-- -->` は使用不可。MDXコメント `{/* */}` を使用する。

### サブディレクトリ

MDXファイルはサブディレクトリ内に入れることもできる。ディレクトリ構造がそのままサイドバーのツリーとURLに反映される。

```
content/my-project/
├── _pj.json
├── 概要.mdx          → /my-project/概要
└── 設計/
    ├── 要件定義.mdx  → /my-project/設計/要件定義
    └── DB設計.mdx    → /my-project/設計/DB設計
```

---

## 技術スタック

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- gray-matter
