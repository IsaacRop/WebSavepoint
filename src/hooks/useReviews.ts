"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PaginatedResponse, Review } from "@/types";

interface ReviewsState {
  reviews: Review[];
  next: string | null;
  isLoading: boolean;
  error: string | null;
}

type Filter =
  | { game: string }
  | { user: string }
  | { game: string; user: string };

function buildEndpoint(filter: Filter): string {
  const params = new URLSearchParams(filter as Record<string, string>);
  return `/api/reviews/?${params.toString()}`;
}

export function useReviews(filter: Filter) {
  const endpoint = buildEndpoint(filter);
  const [state, setState] = useState<ReviewsState>({
    reviews: [],
    next: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ reviews: [], next: null, isLoading: true, error: null });
    api
      .get<PaginatedResponse<Review>>(endpoint)
      .then((data) => {
        if (!cancelled)
          setState({ reviews: data.results, next: data.next, isLoading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            reviews: [],
            next: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Erro.",
          });
      });
    return () => { cancelled = true; };
  }, [endpoint]);

  const loadMore = useCallback(async () => {
    if (!state.next) return;
    const url = new URL(state.next);
    const data = await api.get<PaginatedResponse<Review>>(url.pathname + url.search);
    setState((s) => ({ ...s, reviews: [...s.reviews, ...data.results], next: data.next }));
  }, [state.next]);

  const createReview = useCallback(
    async (gameId: string, rating: number, body: string, containsSpoiler: boolean) => {
      const review = await api.post<Review>("/api/reviews/", {
        game: gameId,
        rating,
        body,
        contains_spoiler: containsSpoiler,
      });
      setState((s) => ({ ...s, reviews: [review, ...s.reviews] }));
      return review;
    },
    []
  );

  const updateReview = useCallback(
    async (reviewId: string, rating: number, body: string, containsSpoiler: boolean) => {
      const updated = await api.patch<Review>(`/api/reviews/${reviewId}/`, {
        rating,
        body,
        contains_spoiler: containsSpoiler,
      });
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) => (r.id === reviewId ? updated : r)),
      }));
      return updated;
    },
    []
  );

  const deleteReview = useCallback(async (reviewId: string) => {
    await api.delete(`/api/reviews/${reviewId}/`);
    setState((s) => ({ ...s, reviews: s.reviews.filter((r) => r.id !== reviewId) }));
  }, []);

  const toggleLike = useCallback(async (reviewId: string, currentlyLiked: boolean) => {
    // Optimistic update
    setState((s) => ({
      ...s,
      reviews: s.reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              liked_by_me: !currentlyLiked,
              likes_count: currentlyLiked ? r.likes_count - 1 : r.likes_count + 1,
            }
          : r
      ),
    }));
    try {
      if (currentlyLiked) {
        await api.delete(`/api/reviews/${reviewId}/like/`);
      } else {
        await api.post(`/api/reviews/${reviewId}/like/`, {});
      }
    } catch {
      // Revert on error
      setState((s) => ({
        ...s,
        reviews: s.reviews.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                liked_by_me: currentlyLiked,
                likes_count: currentlyLiked ? r.likes_count + 1 : r.likes_count - 1,
              }
            : r
        ),
      }));
    }
  }, []);

  return { ...state, loadMore, createReview, updateReview, deleteReview, toggleLike };
}
