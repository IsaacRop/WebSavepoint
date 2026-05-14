"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ActivityFeedItem, PaginatedResponse } from "@/types";

interface FeedState {
  items: ActivityFeedItem[];
  next: string | null;
  isLoading: boolean;
  isEmpty: boolean;
  error: string | null;
}

export function useFeed() {
  const [state, setState] = useState<FeedState>({
    items: [],
    next: null,
    isLoading: true,
    isEmpty: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    api
      .get<PaginatedResponse<ActivityFeedItem>>("/api/feed/")
      .then((data) => {
        if (!cancelled)
          setState({
            items: data.results,
            next: data.next,
            isLoading: false,
            isEmpty: data.results.length === 0,
            error: null,
          });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            items: [],
            next: null,
            isLoading: false,
            isEmpty: true,
            error: err instanceof Error ? err.message : "Erro ao carregar feed.",
          });
      });
    return () => { cancelled = true; };
  }, []);

  const loadMore = useCallback(async () => {
    if (!state.next) return;
    const url = new URL(state.next);
    const path = url.pathname + url.search;
    const data = await api.get<PaginatedResponse<ActivityFeedItem>>(path);
    setState((s) => ({
      ...s,
      items: [...s.items, ...data.results],
      next: data.next,
    }));
  }, [state.next]);

  return { ...state, loadMore };
}
