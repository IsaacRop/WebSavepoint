"use client";

import Link from "next/link";
import { useFeed } from "@/hooks/useFeed";
import { FeedItem } from "@/components/feed/FeedItem";
import { Button } from "@/components/ui/Button";

export default function FeedPage() {
  const { items, next, isLoading, isEmpty, error, loadMore } = useFeed();

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-10">
      <div className="max-w-2xl">
        <h1 className="font-sans text-3xl font-medium text-ink mb-1">Diário</h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-50 mb-8">
          Atividade dos seus amigos
        </p>

        {isLoading && (
          <p className="font-mono text-xs text-ink-50 uppercase tracking-widest">
            Carregando...
          </p>
        )}

        {error && (
          <p className="font-mono text-xs text-terra uppercase tracking-widest">{error}</p>
        )}

        {isEmpty && !isLoading && (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <FlagIcon />
            <div>
              <p className="font-sans text-lg font-medium text-ink">
                Nada por aqui ainda.
              </p>
              <p className="font-sans text-sm text-ink-50 mt-1">
                Siga outros jogadores para ver o feed.
              </p>
            </div>
            <Link
              href="/games"
              className="font-mono uppercase tracking-widest text-sm px-5 py-2.5 bg-terra text-paper-50 border border-terra transition-all duration-[200ms] hover:bg-terra-dark"
            >
              Descobrir Jogadores
            </Link>
          </div>
        )}

        {items.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}

        {next && (
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={loadMore}>
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FlagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-ink-10" aria-hidden>
      <path d="M4 3v18M4 3h12l-3 5.25L16 13H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
