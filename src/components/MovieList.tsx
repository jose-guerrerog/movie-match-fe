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

  // Load movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await api.getMovies(page, 12, search);
        setMovies(data.movies);
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

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && movies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No movies found. Try adjusting your search.</p>
        </div>
      )}

      {/* Movie grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onSelectMovie}
            selected={movie.id === selectedMovieId}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <button
            className="px-4 py-2 text-sm font-medium text-blue-500 disabled:text-gray-400"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          
          <span className="mx-4">
            Page {page} of {totalPages}
          </span>
          
          <button
            className="px-4 py-2 text-sm font-medium text-blue-500 disabled:text-gray-400"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;