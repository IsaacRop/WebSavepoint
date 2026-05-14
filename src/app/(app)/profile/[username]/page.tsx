"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { ReviewCard } from "@/components/profile/ReviewCard";
import { StatCard } from "@/components/profile/StatCard";
import { Button } from "@/components/ui/Button";

type Tab = "reviews" | "listas" | "stats";

function Avatar({ username, avatar }: { username: string; avatar: string | null }) {
  const initials = username.slice(0, 2).toUpperCase();
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={username}
        className="w-16 h-16 rounded-full object-cover border border-ink-10"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-terra flex items-center justify-center flex-shrink-0">
      <span className="font-mono text-lg font-medium text-paper-50">{initials}</span>
    </div>
  );
}

function JoinedDate({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr);
  const month = d.toLocaleString("pt-BR", { month: "long" });
  const year = d.getFullYear();
  return <>{month} {year}</>;
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user: me } = useAuth();
  const { user, reviews, lists, reviewsNext, isLoading, error, loadMoreReviews, follow, unfollow } =
    useProfile(username);
  const [tab, setTab] = useState<Tab>("reviews");
  const [followLoading, setFollowLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-[1360px] mx-auto px-6 py-16 font-mono text-xs text-ink-50 uppercase tracking-widest">
        Carregando...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-[1360px] mx-auto px-6 py-16 font-mono text-xs text-terra uppercase tracking-widest">
        {error ?? "Perfil não encontrado."}
      </div>
    );
  }

  const isOwnProfile = me?.username === username;

  async function handleFollowToggle() {
    if (!user) return;
    setFollowLoading(true);
    try {
      if (user.is_following) await unfollow(username);
      else await follow(username);
    } finally {
      setFollowLoading(false);
    }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "reviews", label: "REVIEWS" },
    { key: "listas", label: "LISTAS" },
    { key: "stats", label: "STATS" },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-6 py-10">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
        <Avatar username={user.username} avatar={user.avatar} />
        <div className="flex flex-col gap-2 flex-1">
          <h1 className="font-sans text-3xl font-medium text-ink dark:text-paper-100">{user.username}</h1>
          {user.bio && (
            <p className="font-sans text-base text-ink-70 dark:text-paper-400 max-w-lg">{user.bio}</p>
          )}
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink-50">
            Entrou em <JoinedDate dateStr={user.created_at} />
            {" · "}
            {user.saves_count ?? 0} saves
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className="font-mono text-[11px] text-ink-50 uppercase">
              <span className="text-ink dark:text-paper-100 font-medium">{user.followers_count ?? 0}</span> seguidores
            </span>
            <span className="font-mono text-[11px] text-ink-50 uppercase">
              <span className="text-ink dark:text-paper-100 font-medium">{user.following_count ?? 0}</span> seguindo
            </span>
          </div>
        </div>

        {!isOwnProfile && (
          <Button
            variant={user.is_following ? "secondary" : "accent"}
            size="sm"
            onClick={handleFollowToggle}
            disabled={followLoading}
          >
            {user.is_following ? "SEGUINDO" : "SEGUIR"}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-ink-10 dark:border-night-600 mb-8">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              "font-mono text-[11px] uppercase tracking-widest pb-3 transition-colors duration-[120ms]",
              tab === key
                ? "text-ink dark:text-paper-100 border-b-2 border-terra"
                : "text-ink-50 hover:text-ink dark:hover:text-paper-100",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Reviews */}
      {tab === "reviews" && (
        <div className="max-w-2xl">
          {reviews.length === 0 ? (
            <p className="font-mono text-xs text-ink-50 uppercase tracking-widest">
              Nenhuma review ainda.
            </p>
          ) : (
            <>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
              {reviewsNext && (
                <div className="mt-6">
                  <Button variant="secondary" size="sm" onClick={loadMoreReviews}>
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Listas */}
      {tab === "listas" && (
        <div className="max-w-2xl">
          {lists.length === 0 ? (
            <p className="font-mono text-xs text-ink-50 uppercase tracking-widest">
              Nenhuma lista ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className="bg-paper-100 dark:bg-night-800 border border-ink-10 dark:border-night-600 p-5 flex flex-col gap-1"
                >
                  <h3 className="font-sans text-base font-medium text-ink dark:text-paper-100">{list.title}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ink-50">
                    {list.games_count} jogos
                  </p>
                  {list.description && (
                    <p className="font-sans text-sm text-ink-70 dark:text-paper-400 mt-1 line-clamp-2">
                      {list.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Stats */}
      {tab === "stats" && (
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <StatCard label="Partidas Registradas" value={user.saves_count ?? 0} />
          <StatCard label="Reviews Escritas" value={user.reviews_count ?? 0} />
          <StatCard label="Seguidores" value={user.followers_count ?? 0} />
          <StatCard label="Seguindo" value={user.following_count ?? 0} />
        </div>
      )}
    </div>
  );
}
