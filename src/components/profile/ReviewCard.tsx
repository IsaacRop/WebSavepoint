import type { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="font-mono text-[11px] text-terra tracking-widest">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString("pt-BR", {
    month: "short",
    year: "numeric",
  });

  return (
    <article className="flex gap-4 py-4 border-b border-ink-10 dark:border-night-600 last:border-0">
      {/* Placeholder cover — review game só tem id+title */}
      <div className="w-12 h-16 bg-ink-10 dark:bg-night-700 flex-shrink-0 flex items-end justify-center pb-1">
        <span className="font-mono text-[8px] text-ink-50 text-center px-1 leading-tight line-clamp-2">
          {review.game.title}
        </span>
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h3 className="font-sans text-base font-medium text-ink dark:text-paper-100 leading-snug">
          {review.game.title}
        </h3>
        <div className="flex items-center gap-3">
          <Stars rating={review.rating} />
          <span className="font-mono text-[10px] text-ink-50 uppercase">{date}</span>
        </div>
        {review.body && (
          <p className="font-sans text-sm text-ink-70 dark:text-paper-400 leading-relaxed line-clamp-2 mt-0.5">
            {review.contains_spoiler ? "[SPOILER] " : ""}
            {review.body}
          </p>
        )}
        <p className="font-mono text-[10px] text-ink-50 uppercase mt-1">
          ♡ {review.likes_count} curtidas
        </p>
      </div>
    </article>
  );
}
