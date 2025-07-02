// API base URL - adjust this for your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Movie interface
export interface Movie {
  id: number;
  title: string;
  genres: string[];
  year?: string | null;
}

// Recommendation interface
export interface Recommendation extends Movie {
  explanation: string;
}

// API response interfaces
export interface MoviesResponse {
  total: number;
  page: number;
  limit: number;
  movies: Movie[];
}

export interface RecommendationsResponse {
  baseMovie: Movie;
  recommendations: Recommendation[];
  method: 'content' | 'collaborative' | 'hybrid';
}

export interface StatsResponse {
  totalMovies: number;
  totalUsers: number;
  totalRatings: number;
  avgRating: number;
  uniqueGenres: number;
}

export const fetchMovies = async (page = 1, limit = 6, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/movies?${params}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchRecommendations = async (
  movieId: number,
  count = 5
) => {
  const params = new URLSearchParams({
    movie_id: movieId.toString(),
    count: count.toString()
  });
  
  const response = await fetch(`${API_BASE_URL}/api/v1/recommend?${params}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

export const fetchStats = async() => {
  const response = await fetch(`${API_BASE_URL}/api/v1/stats`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

export const prepareData = async (message: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/prepare`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
};

/**
 * API service for movie recommendations
 */
const api = {
  getMovies: fetchMovies,
  getRecommendations: fetchRecommendations,
  getStats: fetchStats,
  prepareData,
};

export default api;