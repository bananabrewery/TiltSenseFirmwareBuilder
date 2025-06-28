const API_URL: string = import.meta.env.VITE_API_URL;
const API_KEY: string = import.meta.env.VITE_API_KEY;

export function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});
  headers.set('x-api-key', API_KEY);

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}
