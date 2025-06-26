const API_URL: string = import.meta.env.VITE_API_URL;

export function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${path}`, options);
}
