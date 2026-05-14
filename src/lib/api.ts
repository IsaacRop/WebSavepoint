const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("savepoint_access")
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      message = err.detail ?? err.message ?? JSON.stringify(err);
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint);
  },
  post<T>(endpoint: string, body: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  patch<T>(endpoint: string, body: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
  delete(endpoint: string): Promise<void> {
    return apiFetch<void>(endpoint, { method: "DELETE" });
  },
};
