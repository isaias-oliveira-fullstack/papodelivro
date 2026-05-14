export type Theme = "light" | "dark";
export type ModalSize = "sm" | "md" | "lg" | "xl" | "x2";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Book {
  id?: number | string;
  title: string;
  author: string;
  category?: string;
  cover_url?: string;
  full_cover_url?: string;
  slug?: string;
  summary?: string | null;
  summary_id?: number | string;
  summary_status?: string | null;
  submitted_by?: string | null;
  status?: string;
  user_id?: number | string;
  isPlaceholder?: boolean;
  averageRating?: number;
  reviewsCount?: number;
}

export interface User {
  id?: number | string;
  name: string;
  email?: string;
  role?: 'admin' | 'user' | string;
}

export interface Review {
  id?: number | string;
  rating: Rating;
  content: string;
  userId?: number | string;
  user?: User;
  book?: Book;
  createdAt?: string;
}

export interface Summary {
  id?: number | string;
  title: string;
  author: string;
  category?: string;
  content?: string;
  status?: string;
  slug?: string;
  cover_url?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<User>;
  signOut: () => void;
  signUp: (data: SignUpData) => Promise<void>;
  updateUser: (user: User) => void;
}
