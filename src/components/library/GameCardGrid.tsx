"use client";

import { useRouter } from "next/navigation";
import type { GameLog } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface Props {
  log: GameLog;
  onClick?: () => void;
}

export function GameCardGrid({ log, onClick }: Props) {
  const router = useRouter();

  function handleClick() {
    if (onClick) { onClick(); return; }
    router.push(`/games/${log.game.id}`);
  }

  return (
    <article
      onClick={handleClick}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      {/* Poster 3:4 */}
      <div className="relative aspect-[3/4] w-full bg-paper-200 overflow-hidden rounded-sm">
        {log.game.cover_url ? (
          <img
            src={log.game.cover_url}
            alt={log.game.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ControllerIcon />
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-all duration-[200ms] flex items-end p-2">
          <StatusBadge status={log.status} />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="font-sans text-sm font-medium text-ink leading-snug line-clamp-2 group-hover:text-terra transition-colors duration-[200ms]">
          {log.game.title}
        </h3>
        {log.game.rating !== null && (
          <span className="font-mono text-[10px] text-ink-50 uppercase">
            IGDB {log.game.rating.toFixed(0)}
          </span>
        )}
      </div>
    </article>
  );
}

function ControllerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-ink-10" aria-hidden>
      <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10v4M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="11" r="1" fill="currentColor" />
      <circle cx="18" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
