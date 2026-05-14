"use client";

import { useRouter } from "next/navigation";
import type { Game } from "@/types";
import { Button } from "@/components/ui/Button";

interface Props {
  games: Game[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onQuickSave?: (game: Game) => void;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="aspect-[3/4] w-full bg-paper-200 dark:bg-night-700 rounded-sm" />
      <div className="h-3 bg-paper-200 dark:bg-night-700 rounded w-3/4" />
      <div className="h-2 bg-paper-200 dark:bg-night-700 rounded w-1/2" />
    </div>
  );
}

function GameCard({ game, onQuickSave }: { game: Game; onQuickSave?: (g: Game) => void }) {
  const router = useRouter();
  const rating = game.rating !== null ? Number(game.rating) : null;

  return (
    <article
      onClick={() => router.push(`/games/${game.id}`)}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      <div className="relative aspect-[3/4] w-full bg-paper-200 dark:bg-night-700 overflow-hidden rounded-sm">
        {game.cover_url ? (
          <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[10px] text-ink-50 uppercase">Sem capa</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-all duration-[200ms] flex items-end p-2 opacity-0 group-hover:opacity-100">
          {onQuickSave && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickSave(game); }}
              className="w-full font-mono text-[10px] uppercase tracking-widest bg-paper-50 dark:bg-night-900 text-ink dark:text-paper-100 px-2 py-1.5 hover:bg-paper-100 dark:hover:bg-night-800 transition-colors"
            >
              + Salvar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="font-sans text-sm font-medium text-ink dark:text-paper-100 leading-snug line-clamp-2 group-hover:text-terra transition-colors duration-[200ms]">
          {game.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {rating !== null && (
            <span className="font-mono text-[10px] text-ink-50 uppercase">
              ★ {rating.toFixed(0)}
            </span>
          )}
          {game.genres[0] && (
            <span className="font-mono text-[10px] text-ink-50 border border-ink-10 dark:border-night-600 px-1.5 py-0.5 uppercase">
              {game.genres[0]}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function GameGrid({ games, loading, hasMore, onLoadMore, onQuickSave }: Props) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }, (_, i) => <SkeletonCard key={i} />)
          : games.map((g) => (
              <GameCard key={g.id} game={g} onQuickSave={onQuickSave} />
            ))}
      </div>

      {hasMore && !loading && (
        <div className="mt-8 flex justify-center">
          <Button variant="secondary" onClick={onLoadMore}>
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  );
}
