"use client";

import Link from "next/link";
import { useState } from "react";
import { relativeTime } from "@/lib/date";
import { StarRating } from "@/components/ui/StarRating";
import type { Review } from "@/types";

interface Props {
  review: Review;
  currentUserId?: string;
  onLike?: (reviewId: string, currentlyLiked: boolean) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
  showGame?: boolean;
}

export function ReviewCard({ review, currentUserId, onLike, onEdit, onDelete, showGame = false }: Props) {
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isOwner = currentUserId === review.user.id;

  return (
    <article className="py-5 border-b border-ink-10 last:border-0 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-terra flex-shrink-0 flex items-center justify-center">
            <span className="font-mono text-[10px] font-medium text-paper-50">
              {review.user.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <Link
              href={`/profile/${review.user.username}`}
              className="font-sans text-sm font-medium text-ink hover:text-terra transition-colors"
            >
              {review.user.username}
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
              {relativeTime(review.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StarRating value={review.rating} readOnly size="sm" />
          {isOwner && (onEdit || onDelete) && (
            <OptionsMenu
              onEdit={() => onEdit?.(review)}
              onDelete={() => onDelete?.(review.id)}
            />
          )}
        </div>
      </div>

      {/* Game link (no feed) */}
      {showGame && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-50 pl-10">
          {review.game.title}
        </p>
      )}

      {/* Body */}
      {review.body && (
        <div className="relative pl-10">
          {review.contains_spoiler && !spoilerRevealed ? (
            <div className="relative">
              <p className="font-sans text-sm text-ink-70 leading-relaxed blur-sm select-none line-clamp-3">
                {review.body}
              </p>
              <button
                onClick={() => setSpoilerRevealed(true)}
                className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-ink bg-paper-50/70"
              >
                CONTÉM SPOILERS · CLIQUE PARA VER
              </button>
            </div>
          ) : (
            <>
              <p className={[
                "font-sans text-sm text-ink-70 leading-relaxed",
                !expanded ? "line-clamp-3" : "",
              ].join(" ")}>
                {review.body}
              </p>
              {review.body.length > 200 && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="font-mono text-[10px] uppercase tracking-widest text-terra mt-1 hover:underline"
                >
                  {expanded ? "↑ RECOLHER" : "↓ LER MAIS"}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pl-10 flex items-center gap-4">
        <button
          onClick={() => onLike?.(review.id, review.liked_by_me)}
          disabled={!onLike || isOwner}
          className={[
            "font-mono text-[10px] uppercase tracking-widest transition-colors duration-[120ms]",
            review.liked_by_me ? "text-terra" : "text-ink-50 hover:text-terra",
            (!onLike || isOwner) ? "cursor-default" : "cursor-pointer",
          ].join(" ")}
        >
          {review.liked_by_me ? "♥" : "♡"} {review.likes_count} {review.likes_count === 1 ? "CURTIDA" : "CURTIDAS"}
        </button>
      </div>
    </article>
  );
}

function OptionsMenu({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-lg text-ink-50 hover:text-ink leading-none"
        aria-label="Opções"
      >
        ⋯
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-paper-100 border border-ink-10 shadow-hairline z-10">
          {onEdit && (
            <button
              onClick={() => { setOpen(false); onEdit(); }}
              className="block w-full text-left px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink hover:bg-paper-200"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => { setOpen(false); onDelete(); }}
              className="block w-full text-left px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-terra hover:bg-paper-200"
            >
              Apagar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
