"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  password_confirm?: string;
}

function parseApiErrors(message: string): FieldErrors {
  try {
    const parsed = JSON.parse(message) as Record<string, string[] | string>;
    const result: FieldErrors = {};
    for (const [key, value] of Object.entries(parsed)) {
      result[key as keyof FieldErrors] = Array.isArray(value)
        ? value[0]
        : value;
    }
    return result;
  } catch {
    return {};
  }
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [globalError, setGlobalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setGlobalError("");
    setFieldErrors({});
    setIsLoading(true);
    try {
      await register(username, email, password, passwordConfirm);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar conta.";
      const parsed = parseApiErrors(message);
      if (Object.keys(parsed).length > 0) {
        setFieldErrors(parsed);
      } else {
        setGlobalError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-screen bg-paper-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs tracking-[0.25em] text-ink-50 uppercase mb-2">
            SavePoint
          </p>
          <h1 className="font-sans text-3xl font-medium text-ink">
            Criar conta
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-paper-100 border border-ink-10 p-8 flex flex-col gap-5 shadow-card"
        >
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={fieldErrors.username}
            autoComplete="username"
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            autoComplete="email"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirmar Senha"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            error={fieldErrors.password_confirm}
            autoComplete="new-password"
            required
          />

          {globalError && (
            <p className="font-mono text-[12px] text-terra">{globalError}</p>
          )}

          <Button
            type="submit"
            variant="accent"
            className="w-full mt-1"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center mt-6 font-mono text-xs text-ink-50">
          Já tem conta?{" "}
          <Link href="/login" className="text-ink underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
