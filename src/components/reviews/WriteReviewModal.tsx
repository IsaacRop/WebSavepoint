"use client";

import { useEffect, useRef, useState } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import type { Review } from "@/types";

interface Props {
  gameId: string;
  gameTitle: string;
  existingReview?: Review;
  onSave: (gameId: string, rating: number, body: string, containsSpoiler: boolean) => Promise<unknown>;
  onUpdate?: (reviewId: string, rating: number, body: string, containsSpoiler: boolean) => Promise<unknown>;
  onDelete?: (reviewId: string) => void;
  onClose: () => void;
}

const MAX_BODY = 2000;

export function WriteReviewModal({
  gameId, gameTitle, existingReview, onSave, onUpdate, onDelete, onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(existingReview);

  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [containsSpoiler, setContainsSpoiler] = useState(existingReview?.contains_spoiler ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit() {
    if (rating === 0) { setError("Selecione uma nota."); return; }
    setError("");
    setIsSaving(true);
    try {
      if (isEditing && existingReview && onUpdate) {
        await onUpdate(existingReview.id, rating, body, containsSpoiler);
      } else {
        await onSave(gameId, rating, body, containsSpoiler);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-ink/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-paper-50 border border-ink-10 shadow-modal w-full max-w-lg p-8 flex flex-col gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-50 mb-1">
            {isEditing ? "Editar Review" : "Nova Review"}
          </p>
          <h2 className="font-sans text-2xl font-medium italic text-ink">{gameTitle}</h2>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-50">Nota</span>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[11px] uppercase tracking-widest text-ink-50">
            Review
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY))}
            placeholder="O que você achou?"
            rows={5}
            className="font-sans text-sm text-ink bg-transparent border border-ink-10 px-4 py-3 focus:outline-none focus:border-ink transition-colors duration-[120ms] resize-none placeholder:text-ink-10"
          />
          <span className="font-mono text-[10px] text-ink-50 text-right">
            {body.length}/{MAX_BODY}
          </span>
        </div>

        {/* Spoiler */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={containsSpoiler}
            onChange={(e) => setContainsSpoiler(e.target.checked)}
            className="w-4 h-4 accent-terra"
          />
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-70">
            Contém spoilers — ocultar por padrão
          </span>
        </label>

        {error && <p className="font-mono text-[12px] text-terra">{error}</p>}

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="accent" onClick={handleSubmit} disabled={isSaving} className="flex-1">
            {isSaving
              ? "Salvando..."
              : isEditing ? "Salvar Alterações" : "Publicar Review"}
          </Button>
        </div>

        {isEditing && existingReview && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(existingReview.id)}
            className="font-mono text-[11px] uppercase tracking-widest text-terra text-center hover:underline"
          >
            Apagar review
          </button>
        )}
      </div>
    </div>
  );
}
