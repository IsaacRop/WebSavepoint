"use client";

import Link from "next/link";
import { useState } from "react";
import { relativeTime } from "@/lib/date";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type {
  ActivityFeedItem,
  FollowPayload,
  ListCreatedPayload,
  LogUpdatedPayload,
  ReviewCreatedPayload,
} from "@/types";

interface Props {
  item: ActivityFeedItem;
}

function Avatar({ username, avatar }: { username: string; avatar: string | null }) {
  if (avatar) {
    return <img src={avatar} alt={username} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />;
  }
  return (
    <div className="w-8 h-8 rounded-full bg-terra flex-shrink-0 flex items-center justify-center">
      <span className="font-mono text-[10px] font-medium text-paper-50">
        {username.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

function UserLine({ username, avatar, time }: { username: string; avatar: string | null; time: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar username={username} avatar={avatar} />
      <Link href={`/profile/${username}`} className="font-sans text-sm font-medium text-ink hover:text-terra transition-colors">
        {username}
      </Link>
      <span className="font-mono text-[10px] text-ink-50 uppercase">{time}</span>
    </div>
  );
}

// ── Review Created ─────────────────────────────────────────────────────────────

function ReviewCreatedItem({ item }: { item: ActivityFeedItem }) {
  const p = item.payload as ReviewCreatedPayload;
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const rating = Math.round(Number(p.rating));

  return (
    <div className="flex flex-col gap-3">
      <UserLine username={item.user.username} avatar={item.user.avatar} time={relativeTime(item.created_at)} />

      <div className="flex gap-3 pl-10">
        {p.game_cover_url && (
          <img src={p.game_cover_url} alt={p.game_title} className="w-10 h-14 object-cover flex-shrink-0 rounded-sm" />
        )}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
            JOGOU{" "}
            <span className="text-ink">{p.game_title}</span>
          </p>
          <span className="font-mono text-[12px] text-terra tracking-widest">
            {"★".repeat(rating)}{"☆".repeat(5 - rating)}
          </span>
          {p.body_preview && (
            <div className="relative">
              <p
                className={[
                  "font-sans text-sm text-ink-70 leading-relaxed line-clamp-3",
                  p.contains_spoiler && !spoilerRevealed ? "blur-sm select-none" : "",
                ].join(" ")}
              >
                {p.body_preview}
              </p>
              {p.contains_spoiler && !spoilerRevealed && (
                <button
                  onClick={() => setSpoilerRevealed(true)}
                  className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-ink bg-paper-50/60"
                >
                  CONTÉM SPOILERS · CLIQUE PARA VER
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Log Updated ────────────────────────────────────────────────────────────────

function LogUpdatedItem({ item }: { item: ActivityFeedItem }) {
  const p = item.payload as LogUpdatedPayload;
  return (
    <div className="flex flex-col gap-3">
      <UserLine username={item.user.username} avatar={item.user.avatar} time={relativeTime(item.created_at)} />
      <div className="flex items-center gap-3 pl-10">
        {p.game_cover_url && (
          <img src={p.game_cover_url} alt={p.game_title} className="w-8 h-11 object-cover flex-shrink-0 rounded-sm" />
        )}
        <p className="font-sans text-sm text-ink-70">
          registrou{" "}
          <span className="font-medium text-ink">{p.game_title}</span>
          {" "}como{" "}
          <StatusBadge status={p.status} />
        </p>
      </div>
    </div>
  );
}

// ── List Created ───────────────────────────────────────────────────────────────

function ListCreatedItem({ item }: { item: ActivityFeedItem }) {
  const p = item.payload as ListCreatedPayload;
  return (
    <div className="flex flex-col gap-2">
      <UserLine username={item.user.username} avatar={item.user.avatar} time={relativeTime(item.created_at)} />
      <div className="pl-10">
        <p className="font-sans text-sm text-ink-70">
          criou a lista{" "}
          <Link href={`/lists/${p.list_id}`} className="font-medium text-ink hover:text-terra transition-colors">
            &ldquo;{p.list_title}&rdquo;
          </Link>
          {" "}
          <span className="font-mono text-[10px] text-ink-50 uppercase">
            · {p.games_count} {p.games_count === 1 ? "jogo" : "jogos"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Follow ─────────────────────────────────────────────────────────────────────

function FollowItem({ item }: { item: ActivityFeedItem }) {
  const p = item.payload as FollowPayload;
  return (
    <div className="flex flex-col gap-2">
      <UserLine username={item.user.username} avatar={item.user.avatar} time={relativeTime(item.created_at)} />
      <p className="pl-10 font-sans text-sm text-ink-70">
        passou a seguir{" "}
        <Link href={`/profile/${p.followed_username}`} className="font-medium text-ink hover:text-terra transition-colors">
          {p.followed_username}
        </Link>
      </p>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function FeedItem({ item }: Props) {
  return (
    <div className="py-5 border-b border-ink-10 last:border-0">
      {item.event_type === "review_created" && <ReviewCreatedItem item={item} />}
      {item.event_type === "log_updated" && <LogUpdatedItem item={item} />}
      {item.event_type === "list_created" && <ListCreatedItem item={item} />}
      {item.event_type === "follow" && <FollowItem item={item} />}
    </div>
  );
}
