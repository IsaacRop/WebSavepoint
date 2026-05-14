"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { GameList, PaginatedResponse, Review, User } from "@/types";

interface ProfileData {
  user: User | null;
  reviews: Review[];
  lists: GameList[];
  reviewsNext: string | null;
  listsNext: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfile(username: string) {
  const [data, setData] = useState<ProfileData>({
    user: null,
    reviews: [],
    lists: [],
    reviewsNext: null,
    listsNext: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setData((d) => ({ ...d, isLoading: true, error: null }));

    async function load() {
      try {
        const [user, reviewsPage, listsPage] = await Promise.all([
          api.get<User>(`/api/users/${username}/`),
          api.get<PaginatedResponse<Review>>(`/api/reviews/?user=${username}`),
          api.get<PaginatedResponse<GameList>>(`/api/lists/?user=${username}`),
        ]);
        if (!cancelled) {
          setData({
            user,
            reviews: reviewsPage.results,
            lists: listsPage.results,
            reviewsNext: reviewsPage.next,
            listsNext: listsPage.next,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setData((d) => ({
            ...d,
            isLoading: false,
            error: err instanceof Error ? err.message : "Erro ao carregar perfil.",
          }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [username]);

  const loadMoreReviews = useCallback(async () => {
    if (!data.reviewsNext) return;
    const url = new URL(data.reviewsNext);
    const endpoint = url.pathname + url.search;
    const page = await api.get<PaginatedResponse<Review>>(endpoint);
    setData((d) => ({
      ...d,
      reviews: [...d.reviews, ...page.results],
      reviewsNext: page.next,
    }));
  }, [data.reviewsNext]);

  const follow = useCallback(async (username: string) => {
    await api.post(`/api/users/${username}/follow/`, {});
    setData((d) => ({
      ...d,
      user: d.user
        ? {
            ...d.user,
            is_following: true,
            followers_count: (d.user.followers_count ?? 0) + 1,
          }
        : null,
    }));
  }, []);

  const unfollow = useCallback(async (username: string) => {
    await api.delete(`/api/users/${username}/follow/`);
    setData((d) => ({
      ...d,
      user: d.user
        ? {
            ...d.user,
            is_following: false,
            followers_count: Math.max(0, (d.user.followers_count ?? 0) - 1),
          }
        : null,
    }));
  }, []);

  return { ...data, loadMoreReviews, follow, unfollow };
}
