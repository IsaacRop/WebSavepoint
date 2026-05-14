"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { GameLog, PaginatedResponse } from "@/types";

type Status = GameLog["status"] | "all";

interface LibraryState {
  logs: GameLog[];
  next: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useLibrary(statusFilter: Status = "all") {
  const [state, setState] = useState<LibraryState>({
    logs: [],
    next: null,
    isLoading: true,
    error: null,
  });

  const endpoint =
    statusFilter === "all"
      ? "/api/logs/"
      : `/api/logs/?status=${statusFilter}`;

  useEffect(() => {
    let cancelled = false;
    setState({ logs: [], next: null, isLoading: true, error: null });

    api
      .get<PaginatedResponse<GameLog>>(endpoint)
      .then((data) => {
        if (!cancelled)
          setState({ logs: data.results, next: data.next, isLoading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            logs: [],
            next: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Erro ao carregar biblioteca.",
          });
      });

    return () => { cancelled = true; };
  }, [endpoint]);

  const loadMore = useCallback(async () => {
    if (!state.next) return;
    const url = new URL(state.next);
    const path = url.pathname + url.search;
    const data = await api.get<PaginatedResponse<GameLog>>(path);
    setState((s) => ({ ...s, logs: [...s.logs, ...data.results], next: data.next }));
  }, [state.next]);

  const addLog = useCallback(
    async (gameId: string, status: GameLog["status"], playedDate?: string) => {
      const log = await api.post<GameLog>("/api/logs/", {
        game: gameId,
        status,
        ...(playedDate ? { played_date: playedDate } : {}),
      });
      if (statusFilter === "all" || statusFilter === status) {
        setState((s) => ({ ...s, logs: [log, ...s.logs] }));
      }
      return log;
    },
    [statusFilter]
  );

  const updateLog = useCallback(
    async (logId: string, status: GameLog["status"], playedDate?: string) => {
      const updated = await api.patch<GameLog>(`/api/logs/${logId}/`, {
        status,
        ...(playedDate !== undefined ? { played_date: playedDate } : {}),
      });
      setState((s) => ({
        ...s,
        logs: s.logs
          .map((l) => (l.id === logId ? updated : l))
          .filter((l) => statusFilter === "all" || l.status === statusFilter),
      }));
      return updated;
    },
    [statusFilter]
  );

  const deleteLog = useCallback(async (logId: string) => {
    await api.delete(`/api/logs/${logId}/`);
    setState((s) => ({ ...s, logs: s.logs.filter((l) => l.id !== logId) }));
  }, []);

  return { ...state, loadMore, addLog, updateLog, deleteLog };
}
