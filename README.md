# Video Analysis App

このプロジェクトは、動画から音声の盛り上がりシーンを自動検出し、クリップを作成するアプリケーションです。

## 必要条件

- Node.js
- npm
- Python
- pip

## セットアップ手順

1. リポジトリをクローンします。

   ```bash
   git clone https://github.com/hrt-ykym/movie-clip.git
   cd movie-clip
   ```

2. Node.jsの依存関係をインストールします。

   ```bash
   npm install
   ```

3. Pythonの依存関係をインストールします。

   ```bash
   pip install -r requirements.txt
   ```

## 開発サーバーの起動

1. フロントエンドの開発サーバーを起動します。

   ```bash
   npm run dev
   ```

2. バックエンドのFlaskサーバーを起動します。

   ```bash
   python api/app.py
   ```

## 使用方法

- ブラウザで `http://localhost:3000` にアクセスして、アプリケーションを使用します。
- 動画ファイルをアップロードすると、音声の盛り上がりシーンを検出し、クリップを生成します。

## 注意事項

- アップロードする動画は5分以内にしてください。
- プライバシーを守るため、個人情報が含まれる動画はアップロードしないでください。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。
