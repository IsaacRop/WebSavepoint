"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Game } from "@/types";

interface Props {
  onClose: () => void;
}

export function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 2) { setResults([]); return; }

    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await api.get<Game[]>(`/api/games/search/?q=${encodeURIComponent(query)}`);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  function handleSelect(game: Game) {
    onClose();
    router.push(`/games/${game.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.length >= 2) {
      onClose();
      router.push(`/games?q=${encodeURIComponent(query)}`);
    }
  }

  function handleViewAll() {
    onClose();
    router.push(`/games?q=${encodeURIComponent(query)}`);
  }

  const showDropdown = results.length > 0 || isLoading;

  return (
    <div ref={containerRef} className="relative w-72">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar jogos..."
        className="w-full font-sans text-sm text-ink bg-paper-100 border border-ink-10 px-3 py-1.5 focus:outline-none focus:border-ink transition-colors duration-[120ms] placeholder:text-ink-10"
      />
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-paper-100 border border-ink-10 shadow-card z-50 max-h-80 overflow-y-auto">
          {isLoading && (
            <p className="px-4 py-3 font-mono text-xs text-ink-50">Buscando...</p>
          )}
          {results.map((game) => (
            <button
              key={game.id}
              onClick={() => handleSelect(game)}
              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-paper-200 transition-colors duration-[120ms] text-left"
            >
              {game.cover_url ? (
                <img
                  src={game.cover_url}
                  alt={game.title}
                  className="w-8 h-10 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-10 bg-ink-10 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-sans text-sm text-ink truncate">{game.title}</p>
                {game.platforms.length > 0 && (
                  <p className="font-mono text-[10px] text-ink-50 truncate uppercase">
                    {game.platforms.slice(0, 2).join(" · ")}
                  </p>
                )}
              </div>
            </button>
          ))}
          {results.length > 0 && (
            <button
              onClick={handleViewAll}
              className="flex items-center justify-center w-full px-3 py-2.5 border-t border-ink-10 hover:bg-paper-200 transition-colors duration-[120ms]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
                Ver todos os resultados →
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
