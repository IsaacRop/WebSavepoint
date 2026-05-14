"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function FeedPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-8 font-mono text-xs text-ink-50 uppercase tracking-widest">
        Carregando...
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-ink-50 uppercase mb-1">
          Bem-vindo de volta
        </p>
        <h1 className="font-sans text-3xl font-medium text-ink">
          Olá, {user?.username ?? "jogador"}
        </h1>
      </div>
      <Button variant="secondary" size="sm" onClick={logout} className="self-start">
        Sair
      </Button>
    </div>
  );
}
