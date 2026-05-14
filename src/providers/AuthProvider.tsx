"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  saveTokens,
} from "@/lib/auth";
import type { User } from "@/types";

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login(email: string, password: string): Promise<void>;
  register(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<void>;
  logout(): Promise<void>;
}

interface AuthResponse extends User {
  access: string;
  refresh: string;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hidratar user se houver token válido no mount
  useEffect(() => {
    async function hydrate() {
      const token = getAccessToken();
      if (!token || isTokenExpired(token)) {
        clearTokens();
        setIsLoading(false);
        return;
      }
      try {
        const me = await api.get<User>("/api/users/me/");
        setUser(me);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>("/api/auth/login/", {
      email,
      password,
    });
    saveTokens(data.access, data.refresh);
    const { access: _a, refresh: _r, ...userData } = data;
    setUser(userData as User);
    router.push("/feed");
  }, [router]);

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      passwordConfirm: string
    ) => {
      const data = await api.post<AuthResponse>("/api/auth/register/", {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      saveTokens(data.access, data.refresh);
      const { access: _a, refresh: _r, ...userData } = data;
      setUser(userData as User);
      router.push("/feed");
    },
    [router]
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        await api.post<void>("/api/auth/logout/", { refresh_token: refresh });
      }
    } catch {
      // mesmo com erro, limpar localmente
    }
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return ctx;
}
