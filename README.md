## 概要

タイマーアプリ(macOSのみ)

### 使用技術
* Nuxt.js
* Electron

## 機能
* 常駐アプリ
* カウントダウンタイマー
* 終了時の音声メッセージを再生

## プロジェクト構成

```
.
├──app
│   ├── build         ・・・ビルドした実行ファイルの出力フォルダ
│   ├── dist          ・・・renderer側の静的ファイルの出力フォルダ(nuxt generate)
│   ├── node_modules  ・・・Electronプロジェクトのモジュール
│   ├── package.json
│   └── src
│       └── main                  ・・・mainプロセス群
└── web
    ├── (Nuxt.jsの規定フォルダ群)
    ├── node_modules  ・・・Nuxt.jsプロジェクトのモジュール
    ├── nuxt.config.js
    ├── package.json
    └── tsconfig.json
```

## インストール

```bash
# appフォルダ
$ cd app
$ npm install

# webフォルダ
$ cd web
$ npm install
```

## ビルド

### 開発ビルド

```bash
# Nuxt.jsプロジェクト開発時(webフォルダ)
$ npm run dev
# ↑(ローカルサーバ) + electron開発時(appフォルダ)
$ npm run dev

# nuxt generate(webフォルダ)
$ npm run build-as-app
# electron実行(appフォルダ)
$ npm run start
```

### リリースビルド

```bash
# electron 実行ファイル作成(appフォルダ)
# Mac
$ npm run build:mac
```