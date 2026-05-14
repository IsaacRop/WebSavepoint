"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
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
            Entrar
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-paper-100 border border-ink-10 p-8 flex flex-col gap-5 shadow-card"
        >
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="font-mono text-[12px] text-terra">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-1"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center mt-6 font-mono text-xs text-ink-50">
          Sem conta?{" "}
          <Link href="/register" className="text-ink underline underline-offset-4">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}
