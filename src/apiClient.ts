// Web API 呼び出し用のユーティリティ関数と型定義
import { useState, useCallback } from "react";

export type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  body?: unknown;
  timeoutMs?: number;
  retries?: number;
};

export type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function buildUrl(
  baseUrl: string,
  queryParams?: Record<string, string | number | boolean>
): string {
  if (!queryParams) return baseUrl;
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    params.append(key, String(value));
  });
  return `${baseUrl}?${params.toString()}`;
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10000
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), timeoutMs);
    fetch(url, options)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 0,
  timeoutMs = 10000
): Promise<Response> {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs);
    } catch (err) {
      lastError = err;
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastError;
}

export function useApi<T = unknown>(
  initialUrl: string,
  initialOptions?: FetchOptions
) {
  const [url, setUrl] = useState(initialUrl);
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = useCallback(
    async (options?: FetchOptions) => {
      setState({ data: null, loading: true, error: null });
      const mergedOptions = { ...initialOptions, ...options };
      const fullUrl = buildUrl(url, mergedOptions.queryParams);
      const fetchOptions: RequestInit = {
        method: mergedOptions.method || "GET",
        headers: mergedOptions.headers,
        body: mergedOptions.body
          ? JSON.stringify(mergedOptions.body)
          : undefined,
      };
      if (fetchOptions.body) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          "Content-Type": "application/json",
        };
      }
      try {
        const res = await fetchWithRetry(
          fullUrl,
          fetchOptions,
          mergedOptions.retries ?? 0,
          mergedOptions.timeoutMs ?? 10000
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setState({ data: json, loading: false, error: null });
        return json;
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error });
        throw error;
      }
    },
    [url, initialOptions]
  );

  return { ...state, callApi, setUrl };
}
