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
  is_following?: boolean;
}

export interface Game {
  id: string;
  igdb_id: number;
  name: string;
  cover_url: string;
  summary: string;
  genres: string[];
  platforms: string[];
  first_release_date: string | null;
  rating: number | null;
}

export interface Review {
  id: string;
  user: Pick<User, "id" | "username" | "avatar">;
  game: Pick<Game, "id" | "name" | "cover_url">;
  rating: number;
  body: string;
  contains_spoiler: boolean;
  likes_count: number;
  liked_by_me: boolean;
  created_at: string;
}

export interface GameLog {
  id: string;
  game: Pick<Game, "id" | "name" | "cover_url" | "rating">;
  status: "playing" | "completed" | "dropped" | "want_to_play";
  updated_at: string;
}

export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}
