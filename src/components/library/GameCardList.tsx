"use client";

import { useRouter } from "next/navigation";
import type { GameLog } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Props {
  log: GameLog;
  userRating?: number;
  onClick?: () => void;
}

const MONTHS_SHORT = ["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"];

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

function GameCover({ url, title }: { url: string; title: string }) {
  if (url) {
    return (
      <img
        src={url}
        alt={title}
        width={64}
        height={88}
        className="w-16 h-[88px] object-cover flex-shrink-0 rounded-sm"
      />
    );
  }
  return (
    <div className="w-16 h-[88px] bg-paper-200 flex-shrink-0 rounded-sm flex items-center justify-center">
      <ControllerIcon />
    </div>
  );
}

export function GameCardList({ log, userRating, onClick }: Props) {
  const router = useRouter();

  function handleClick() {
    if (onClick) { onClick(); return; }
    router.push(`/games/${log.game.id}`);
  }

  const platforms = (log.game.platforms ?? []).slice(0, 2);
  const updatedDate = formatShortDate(log.updated_at);

  return (
    <article
      onClick={handleClick}
      className="flex items-start gap-4 py-4 border-b border-ink-10 last:border-0 cursor-pointer group"
    >
      <GameCover url={log.game.cover_url} title={log.game.title} />

      <div className="flex flex-col gap-1.5 flex-1 min-w-0 pt-1">
        <h3 className="font-sans text-base font-medium text-ink leading-snug group-hover:text-terra transition-colors duration-[200ms]">
          {log.game.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={log.status} />
          {platforms.length > 0 && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
              {platforms.join(" · ")}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
            {updatedDate}
          </span>
        </div>

        {userRating !== undefined && (
          <span className="font-mono text-[11px] text-terra tracking-widest">
            {"★".repeat(userRating)}{"☆".repeat(5 - userRating)}
          </span>
        )}
      </div>
    </article>
  );
}

function ControllerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ink-10" aria-hidden>
      <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10v4M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="11" r="1" fill="currentColor" />
      <circle cx="18" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
