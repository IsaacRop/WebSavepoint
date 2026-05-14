const ACCESS_KEY = "savepoint_access";
const REFRESH_KEY = "savepoint_refresh";

// ── localStorage ──────────────────────────────────────────────────────────────

export function saveTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  setCookie(ACCESS_KEY, access);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  deleteCookie(ACCESS_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

// ── Cookie helpers (para middleware Next.js) ──────────────────────────────────

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
}

// ── JWT decode (sem biblioteca) ───────────────────────────────────────────────

interface JWTPayload {
  user_id: string;
  exp: number;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
}
