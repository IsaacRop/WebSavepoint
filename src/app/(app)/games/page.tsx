"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useDiscover } from "@/hooks/useDiscover";
import { SearchInput } from "@/components/discover/SearchInput";
import { FilterChip } from "@/components/discover/FilterChip";
import { GameGrid } from "@/components/discover/GameGrid";
import { LogGameModal } from "@/components/library/LogGameModal";
import { useLibrary } from "@/hooks/useLibrary";
import type { Game } from "@/types";

const GENRES = ["Action", "RPG", "Adventure", "Strategy", "Shooter", "Platformer", "Puzzle", "Horror", "Sports", "Racing"];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];
const ORDERINGS = [
  { value: "-rating" as const, label: "Melhor avaliado" },
  { value: "-release_year" as const, label: "Mais recente" },
  { value: "title" as const, label: "A–Z" },
];

function DiscoverPageContent() {
  const {
    query, setQuery,
    genres, toggleGenre,
    platform, setPlatform,
    ordering, setOrdering,
    games, loading, isSearchMode,
    hasMore, loadMore,
  } = useDiscover();

  const { addLog } = useLibrary("all");

  const [quickSaveGame, setQuickSaveGame] = useState<Game | null>(null);

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-medium text-ink dark:text-paper-100">Descobrir</h1>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-50 mt-1">
          {isSearchMode ? `Resultados para "${query}"` : "Explore o catálogo"}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Genres */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50 mr-1">Gênero</span>
          {GENRES.map((g) => (
            <FilterChip
              key={g}
              label={g}
              active={genres.includes(g.toLowerCase())}
              onClick={() => toggleGenre(g.toLowerCase())}
            />
          ))}
        </div>

        {/* Platforms + Ordering */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50 mr-1">Plataforma</span>
            {PLATFORMS.map((pl) => (
              <FilterChip
                key={pl}
                label={pl}
                active={platform.toLowerCase() === pl.toLowerCase()}
                onClick={() => setPlatform(pl.toLowerCase())}
              />
            ))}
          </div>

          {!isSearchMode && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50">Ordenar</span>
              <div className="flex gap-1">
                {ORDERINGS.map((o) => (
                  <FilterChip
                    key={o.value}
                    label={o.label}
                    active={ordering === o.value}
                    onClick={() => setOrdering(o.value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <GameGrid
        games={games}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onQuickSave={setQuickSaveGame}
      />

      {/* Quick-save modal */}
      {quickSaveGame && (
        <LogGameModal
          initialGame={quickSaveGame}
          onSave={addLog}
          onClose={() => setQuickSaveGame(null)}
        />
      )}
    </div>
  );
}

function DiscoverSkeleton() {
  return (
    <div className="max-w-[1360px] mx-auto px-6 py-10">
      <div className="mb-8 animate-pulse">
        <div className="h-8 bg-paper-200 dark:bg-night-700 rounded w-32" />
        <div className="h-3 bg-paper-200 dark:bg-night-700 rounded w-48 mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2 animate-pulse">
            <div className="aspect-[3/4] w-full bg-paper-200 dark:bg-night-700 rounded-sm" />
            <div className="h-3 bg-paper-200 dark:bg-night-700 rounded w-3/4" />
            <div className="h-2 bg-paper-200 dark:bg-night-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverSkeleton />}>
      <DiscoverPageContent />
    </Suspense>
  );
}
