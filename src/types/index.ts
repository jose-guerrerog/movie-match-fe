export interface Movie {
  id: number;
  title: string;
  genres: string[];
  year?: string;
}

export interface MovieRecommendation extends Movie {
  explanation: string;
}

export interface RecommendationResponse {
  baseMovie: Movie;
  recommendations: MovieRecommendation[];
  method: RecommendationMethod;
}

export interface MovieListResponse {
  total: number;
  page: number;
  limit: number;
  movies: Movie[];
}

export interface StatsResponse {
  totalMovies: number;
  totalUsers: number;
  totalRatings: number;
  avgRating: number;
  uniqueGenres: number;
}

export type RecommendationMethod = 'content' | 'collaborative' | 'hybrid';