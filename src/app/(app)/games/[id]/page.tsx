"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useReviews } from "@/hooks/useReviews";
import { api } from "@/lib/api";
import type { Game, GameLog, PaginatedResponse, Review } from "@/types";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";
import { LogGameModal } from "@/components/library/LogGameModal";
import { DeleteLogModal } from "@/components/library/DeleteLogModal";

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [userLog, setUserLog] = useState<GameLog | null>(null);
  const [gameLoading, setGameLoading] = useState(true);

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const { reviews, next, isLoading: reviewsLoading, loadMore, createReview, updateReview, deleteReview, toggleLike } =
    useReviews({ game: id });

  // Load game + user's log
  useEffect(() => {
    let cancelled = false;
    setGameLoading(true);
    Promise.all([
      api.get<Game>(`/api/games/${id}/`),
      api.get<PaginatedResponse<GameLog>>(`/api/logs/?game=${id}`),
    ])
      .then(([g, logsPage]) => {
        if (!cancelled) {
          setGame(g);
          setUserLog(logsPage.results[0] ?? null);
          setGameLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setGameLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const myReview = reviews.find((r) => r.user.id === user?.id);

  async function handleAddLog(gameId: string, status: GameLog["status"], playedDate?: string) {
    const log = await api.post<GameLog>("/api/logs/", {
      game: gameId,
      status,
      ...(playedDate ? { played_date: playedDate } : {}),
    });
    setUserLog(log);
    return log;
  }

  async function handleUpdateLog(logId: string, status: GameLog["status"], playedDate?: string) {
    const log = await api.patch<GameLog>(`/api/logs/${logId}/`, {
      status,
      ...(playedDate !== undefined ? { played_date: playedDate } : {}),
    });
    setUserLog(log);
    return log;
  }

  if (gameLoading) {
    return (
      <div className="max-w-[1360px] mx-auto px-6 py-16 font-mono text-xs text-ink-50 uppercase tracking-widest">
        Carregando...
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-[1360px] mx-auto px-6 py-16 font-mono text-xs text-terra uppercase tracking-widest">
        Jogo não encontrado.
      </div>
    );
  }

  const igdbRating = game.rating !== null ? Number(game.rating) : null;

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-10">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-8 mb-12">
        {/* Cover */}
        <div className="flex-shrink-0">
          {game.cover_url ? (
            <img
              src={game.cover_url}
              alt={game.title}
              className="w-40 sm:w-48 aspect-[3/4] object-cover rounded-sm shadow-card"
            />
          ) : (
            <div className="w-40 sm:w-48 aspect-[3/4] bg-paper-200 dark:bg-night-700 rounded-sm flex items-center justify-center">
              <span className="font-mono text-[10px] text-ink-50 uppercase">Sem capa</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-50 mb-1">
              {[
                game.genres[0],
                game.release_year,
              ].filter(Boolean).join(" · ")}
            </p>
            <h1 className="font-sans text-4xl font-medium text-ink dark:text-paper-100 leading-tight">{game.title}</h1>
            {game.summary && (
              <p className="font-sans text-sm text-ink-70 dark:text-paper-400 mt-2 leading-relaxed line-clamp-3">
                {game.summary}
              </p>
            )}
          </div>

          {/* Platforms */}
          {game.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {game.platforms.map((p) => (
                <span key={p} className="font-mono text-[10px] uppercase tracking-widest text-ink-50 border border-ink-10 dark:border-night-600 px-2 py-0.5">
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* IGDB rating */}
          {igdbRating !== null && (
            <div className="flex items-center gap-2">
              <StarRating value={igdbRating / 20} readOnly size="sm" />
              <span className="font-mono text-[10px] text-ink-50 uppercase">
                IGDB {igdbRating.toFixed(0)}
              </span>
            </div>
          )}

          {/* User log status */}
          {userLog && (
            <div>
              <StatusBadge status={userLog.status} />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Button variant="accent" size="sm" onClick={() => setLogModalOpen(true)}>
              {userLog ? "Atualizar Save" : "+ Registrar Partida"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Reviews
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <section id="reviews-section">
        <div className="flex items-center justify-between mb-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink dark:text-paper-100">
            Reviews
          </p>
          {!myReview && (
            <Button variant="secondary" size="sm" onClick={() => setReviewModalOpen(true)}>
              + Escrever Review
            </Button>
          )}
        </div>

        {reviewsLoading && (
          <p className="font-mono text-xs text-ink-50 uppercase tracking-widest">Carregando...</p>
        )}

        {!reviewsLoading && reviews.length === 0 && (
          <p className="font-mono text-xs text-ink-50 uppercase tracking-widest">
            Nenhuma review ainda.
          </p>
        )}

        <div className="max-w-2xl">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={user?.id}
              onLike={toggleLike}
              onEdit={(r) => { setEditingReview(r); setReviewModalOpen(true); }}
              onDelete={(rid) => setDeletingReviewId(rid)}
            />
          ))}

          {next && (
            <div className="mt-6">
              <Button variant="secondary" size="sm" onClick={loadMore}>
                Carregar mais
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Log modal */}
      {logModalOpen && (
        <LogGameModal
          existingLog={userLog ?? undefined}
          onSave={handleAddLog}
          onUpdate={userLog ? (id, s, d) => handleUpdateLog(id, s, d) : undefined}
          onClose={() => setLogModalOpen(false)}
        />
      )}

      {/* Review modal */}
      {reviewModalOpen && (
        <WriteReviewModal
          gameId={game.id}
          gameTitle={game.title}
          existingReview={editingReview ?? undefined}
          onSave={createReview}
          onUpdate={editingReview ? (rid, r, b, s) => updateReview(rid, r, b, s) : undefined}
          onDelete={(rid) => { setDeletingReviewId(rid); setReviewModalOpen(false); }}
          onClose={() => { setReviewModalOpen(false); setEditingReview(null); }}
        />
      )}

      {/* Delete review confirm */}
      {deletingReviewId && (
        <DeleteLogModal
          gameTitle="esta review"
          onConfirm={async () => {
            await deleteReview(deletingReviewId);
            setDeletingReviewId(null);
          }}
          onCancel={() => setDeletingReviewId(null)}
        />
      )}
    </div>
  );
}
