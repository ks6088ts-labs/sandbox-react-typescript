import { useApi } from './apiClient'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // 環境変数から初期URL取得（Viteの場合は import.meta.env.VITE_API_URL）
  const defaultApiUrl = import.meta.env.VITE_API_URL || '';
  const [inputUrl, setInputUrl] = useState(defaultApiUrl);
  // 型例: { message: string }
  const { data, loading, error, callApi, setUrl } = useApi<{ message: string }>(inputUrl);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
    setUrl(e.target.value);
  };

  const handleCallApi = async () => {
    await callApi({
      method: 'GET',
      headers: { Authorization: 'Bearer token' }, // 必要に応じて
      queryParams: { foo: 'bar' }, // 必要に応じて
      timeoutMs: 5000,
      retries: 2,
    });
  };

  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className='bg-yellow-500'>Vite + React</h1>
      <div style={{ margin: '1em 0' }}>
        <input
          type="text"
          value={inputUrl}
          onChange={handleUrlChange}
          placeholder="API URL を入力"
          style={{ width: 300 }}
        />
        <button onClick={handleCallApi} style={{ marginLeft: 8 }}>
          API 呼び出し
        </button>
      </div>
      {loading && <div>ローディング中...</div>}
      {error && <div style={{ color: 'red' }}>エラー: {error.message}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
