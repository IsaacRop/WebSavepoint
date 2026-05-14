import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let isRefreshing = false;

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  // Tentar refresh automático em 401
  if (res.status === 401 && !isRetry && !isRefreshing) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE}/api/auth/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (refreshRes.ok) {
          const data = (await refreshRes.json()) as { access: string };
          saveTokens(data.access, refreshToken);
          isRefreshing = false;
          return apiFetch<T>(endpoint, options, true);
        }
      } catch {
        // refresh falhou
      }
      isRefreshing = false;
    }

    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = (await res.json()) as Record<string, unknown>;
      if (typeof err.detail === "string") message = err.detail;
      else if (typeof err.error === "string") message = err.error;
      else message = JSON.stringify(err);
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
