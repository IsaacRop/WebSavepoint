"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Game, PaginatedResponse } from "@/types";

type Ordering = "-rating" | "-release_year" | "title";

interface DiscoverState {
  games: Game[];
  next: string | null;
  loading: boolean;
  isSearchMode: boolean;
}

export function useDiscover() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQueryState] = useState(searchParams.get("q") ?? "");
  const [genres, setGenres] = useState<string[]>(
    searchParams.get("genre") ? [searchParams.get("genre")!] : []
  );
  const [platform, setPlatformState] = useState(searchParams.get("platform") ?? "");
  const [ordering, setOrderingState] = useState<Ordering>(
    (searchParams.get("ordering") as Ordering) ?? "-rating"
  );

  const [state, setState] = useState<DiscoverState>({
    games: [],
    next: null,
    loading: true,
    isSearchMode: false,
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Push current filter state to URL
  const syncUrl = useCallback(
    (q: string, gs: string[], pl: string, ord: Ordering) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (gs.length === 1) params.set("genre", gs[0]);
      if (pl) params.set("platform", pl);
      if (ord !== "-rating") params.set("ordering", ord);
      router.replace(`/games${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
    },
    [router]
  );

  // Fetch with current params
  const fetch = useCallback(
    async (q: string, gs: string[], pl: string, ord: Ordering) => {
      setState((s) => ({ ...s, loading: true }));
      try {
        if (q.length >= 2) {
          // IGDB search — flat array
          const results = await api.get<Game[]>(
            `/api/games/search/?q=${encodeURIComponent(q)}`
          );
          // Client-side filter for genre/platform
          const filtered = results.filter((g) => {
            const genreMatch =
              gs.length === 0 ||
              gs.some((genre) =>
                g.genres.some((gg) => gg.toLowerCase().includes(genre.toLowerCase()))
              );
            const platMatch =
              !pl ||
              g.platforms.some((p) => p.toLowerCase().includes(pl.toLowerCase()));
            return genreMatch && platMatch;
          });
          setState({ games: filtered, next: null, loading: false, isSearchMode: true });
        } else {
          // Browse DB
          const params = new URLSearchParams({ ordering: ord, page_size: "20" });
          if (gs.length > 0) params.set("genre", gs[0]);
          if (pl) params.set("platform", pl);
          const data = await api.get<PaginatedResponse<Game>>(`/api/games/?${params.toString()}`);
          setState({ games: data.results, next: data.next, loading: false, isSearchMode: false });
        }
      } catch {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  // Initial load (reads from URL)
  useEffect(() => {
    fetch(query, genres, platform, ordering);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search on query change
  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        syncUrl(q, genres, platform, ordering);
        fetch(q, genres, platform, ordering);
      }, 400);
    },
    [genres, platform, ordering, fetch, syncUrl]
  );

  const toggleGenre = useCallback(
    (genre: string) => {
      const next = genres.includes(genre)
        ? genres.filter((g) => g !== genre)
        : [...genres, genre];
      setGenres(next);
      syncUrl(query, next, platform, ordering);
      fetch(query, next, platform, ordering);
    },
    [genres, query, platform, ordering, fetch, syncUrl]
  );

  const setPlatform = useCallback(
    (pl: string) => {
      const next = platform === pl ? "" : pl;
      setPlatformState(next);
      syncUrl(query, genres, next, ordering);
      fetch(query, genres, next, ordering);
    },
    [platform, query, genres, ordering, fetch, syncUrl]
  );

  const setOrdering = useCallback(
    (ord: Ordering) => {
      setOrderingState(ord);
      syncUrl(query, genres, platform, ord);
      fetch(query, genres, platform, ord);
    },
    [query, genres, platform, fetch, syncUrl]
  );

  const loadMore = useCallback(async () => {
    if (!state.next) return;
    const url = new URL(state.next);
    const data = await api.get<PaginatedResponse<Game>>(url.pathname + url.search);
    setState((s) => {
      const seen = new Set(s.games.map((g) => g.id));
      const fresh = data.results.filter((g) => !seen.has(g.id));
      return { ...s, games: [...s.games, ...fresh], next: data.next };
    });
  }, [state.next]);

  return {
    query,
    setQuery,
    genres,
    toggleGenre,
    platform,
    setPlatform,
    ordering,
    setOrdering,
    games: state.games,
    loading: state.loading,
    isSearchMode: state.isSearchMode,
    hasMore: Boolean(state.next),
    loadMore,
  };
}
