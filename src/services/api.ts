// API base URL - adjust this for your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

/**
 * API service for movie recommendations
 */
const api = {
  /**
   * Get a list of movies with pagination and search
   */
  async fetchMovies(page = 1, limit = 20, search = ''): Promise<MoviesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await fetch(`${API_BASE_URL}/movies?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Get recommendations for a movie
   */
  async getRecommendations(
    movieId: number,
    method: 'content' | 'collaborative' | 'hybrid' = 'hybrid',
    count = 5
  ): Promise<RecommendationsResponse> {
    const params = new URLSearchParams({
      movie_id: movieId.toString(),
      count: count.toString(),
      method,
    });
    
    const response = await fetch(`${API_BASE_URL}/recommend?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Get dataset statistics
   */
  async getStats(): Promise<StatsResponse> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  },
  
  /**
   * Prepare data (trigger backend data preparation)
   */
  async prepareData(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/prepare`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
};

export default api;