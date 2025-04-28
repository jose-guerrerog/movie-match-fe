import React, { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import api, { Movie } from '@/services/api';

interface MovieListProps {
  onSelectMovie?: (movie: Movie) => void;
  selectedMovieId?: number;
}

const MovieList: React.FC<MovieListProps> = ({ 
  onSelectMovie,
  selectedMovieId
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load movies with reduced initial count
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use smaller initial page size to load faster
        const limit = page === 1 ? 6 : 12;
        const data = await api.getMovies(page, limit, search);
        
        if (page === 1) {
          setMovies(data.movies);
        } else {
          setMovies(prev => [...prev, ...data.movies]);
        }
        
        setTotalPages(Math.ceil(data.total / data.limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [page, search]);

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to update search after typing stops
    const timeout = setTimeout(() => {
      setSearch(query);
      setPage(1); // Reset to first page on new search
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Simplified loading indicator
  const LoadingIndicator = () => (
    <div className="flex justify-center my-4">
      <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div>
      {/* Search input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for movies..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No movies found. Try adjusting your search.</p>
        </div>
      )}

      {/* Movie grid with simplified layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onSelectMovie}
            selected={movie.id === selectedMovieId}
          />
        ))}
      </div>

      {/* Initial loading state */}
      {loading && page === 1 && <LoadingIndicator />}

      {/* Load more button instead of pagination */}
      {!loading && page < totalPages && (
        <button
          className="w-full mt-6 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
          onClick={() => setPage(page + 1)}
        >
          Load More Movies
        </button>
      )}

      {/* Loading indicator for "load more" */}
      {loading && page > 1 && <LoadingIndicator />}
    </div>
  );
};

export default MovieList;