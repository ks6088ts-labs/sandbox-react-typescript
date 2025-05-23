# Vite

- [Getting Started](https://vite.dev/guide/)

```shell
# Setup a new React + TypeScript project with Vite and SWC
pnpm create vite sandbox-react-typescript --template react-swc-ts
cd sandbox-react-typescript
git init
gh repo create

# Install dependencies
pnpm install

# Run the development server
pnpm run dev
```

# Tailwind CSS

- [Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)

```shell
$ pnpm add tailwindcss @tailwindcss/vite
```

# 生成 AI を活用した開発

HTTP API 呼び出しコードをフロントエンドアプリに追加する

```prompt
HTTP で Web API を呼び出す実装を適切な設計で追加してください。実装は以下の条件を満たしてください

- Web API の URL は環境変数から取得すること
- Web API の URL はフロントエンドから設定できること
- Web API のレスポンスは JSON 形式であること
- Web API の呼び出し中は、ローディング状態のアイコンを表示すること
- Web API のレスポンスを適切な型に変換すること
- Web API の呼び出しは非同期で行うこと
- Web API の呼び出しに失敗した場合は、適切なエラーハンドリングを行うこと
- Web API の呼び出しは、必要に応じてリトライ機能を実装すること
- Web API の呼び出しは、必要に応じてタイムアウトを設定すること
- Web API の呼び出しは、必要に応じて認証情報をヘッダーに含めること
- Web API の呼び出しは、必要に応じてクエリパラメータを設定すること
- Web API の呼び出しは、必要に応じてリクエストボディを設定すること
```

API のレスポンスをモックする

```prompt
json-server を使ったモックAPIサーバを追加して。
```

モック API サーバーにフロントエンドアプリを接続する

```shell
# .env ファイルを作成
echo "VITE_API_URL=http://localhost:3001/posts" > .env

# モック API サーバーを起動
pnpm run mock:api

# フロントエンドアプリを起動
pnpm run dev
```

API 呼び出し結果の JSON をテーブル形式で表示する

```prompt
API 呼び出しの返り値をきれいにテーブル形式で表示して
```
