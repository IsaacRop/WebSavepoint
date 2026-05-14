export interface User {
  id: string;
  username: string;
  email?: string;
  bio: string;
  avatar: string | null;
  created_at: string;
  followers_count?: number;
  following_count?: number;
  saves_count?: number;
  reviews_count?: number;
  is_following?: boolean;
}

export interface Game {
  id: string;
  igdb_id: number;
  title: string;
  slug: string;
  cover_url: string;
  summary: string;
  genres: string[];
  platforms: string[];
  release_year: number | null;
  rating: number | string | null;
}

export interface ReviewGame {
  id: string;
  title: string;
}

export interface ReviewUser {
  id: string;
  username: string;
}

export interface Review {
  id: string;
  user: ReviewUser;
  game: ReviewGame;
  rating: number;
  body: string;
  contains_spoiler: boolean;
  likes_count: number;
  liked_by_me: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameLog {
  id: string;
  game: Pick<Game, "id" | "title" | "cover_url" | "platforms"> & {
    rating: number | string | null;
  };
  status: "playing" | "completed" | "dropped" | "want_to_play";
  played_date: string | null;
  updated_at: string;
}

export interface GameList {
  id: string;
  user: { id: string; username: string };
  title: string;
  description: string;
  is_public: boolean;
  games_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Feed ──────────────────────────────────────────────────────────────────────

export interface FeedUser {
  id: string;
  username: string;
  avatar: string | null;
}

export interface ReviewCreatedPayload {
  game_title: string;
  game_cover_url: string;
  rating: string;
  body_preview: string;
  contains_spoiler: boolean;
}

export interface LogUpdatedPayload {
  game_title: string;
  game_cover_url: string;
  status: GameLog["status"];
}

export interface ListCreatedPayload {
  list_id: string;
  list_title: string;
  games_count: number;
}

export interface FollowPayload {
  followed_username: string;
  followed_avatar: string | null;
}

export type FeedEventType =
  | "review_created"
  | "log_updated"
  | "list_created"
  | "follow";

export interface ActivityFeedItem {
  id: string;
  user: FeedUser;
  event_type: FeedEventType;
  payload:
    | ReviewCreatedPayload
    | LogUpdatedPayload
    | ListCreatedPayload
    | FollowPayload;
  created_at: string;
}
