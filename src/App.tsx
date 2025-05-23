import { useApi } from './apiClient'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// 汎用テーブル表示コンポーネント
function DataTable({ data }: { data: unknown }) {
  if (!data) return null;
  // 配列の場合
  if (Array.isArray(data)) {
    if (data.length === 0) return <div>データなし</div>;
    const columns = Object.keys(data[0] ?? {});
    return (
      <table border={1} style={{ borderCollapse: 'collapse', margin: '1em 0' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={{ padding: '0.5em' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(data as Record<string, unknown>[]).map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col} style={{ padding: '0.5em' }}>{String(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  // オブジェクトの場合
  if (typeof data === 'object') {
    return (
      <table border={1} style={{ borderCollapse: 'collapse', margin: '1em 0' }}>
        <tbody>
          {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
            <tr key={key}>
              <th style={{ padding: '0.5em', textAlign: 'left' }}>{key}</th>
              <td style={{ padding: '0.5em' }}>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  // それ以外（プリミティブ型）はそのまま表示
  return <div>{String(data)}</div>;
}

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
      {data && <DataTable data={data} />}
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
