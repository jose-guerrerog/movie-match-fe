'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieCard } from '@/components/MovieCard';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { fetchMovies } from '@/services/api';
import { Movie } from '@/types';

export function SearchContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const limit = 20;

  useEffect(() => {
    // Reset page when search query changes
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const search = async () => {
      if (!searchQuery) {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const movieData = await fetchMovies(page, limit, searchQuery);
        
        setMovies(movieData.movies);
        setTotalResults(movieData.total);
        setTotalPages(Math.ceil(movieData.total / limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search movies');
      } finally {
        setLoading(false);
      }
    };
    
    search();
  }, [searchQuery, page]);

  const handlePageChange = (newPage: number) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Search Results: "{searchQuery}"
      </h1>
      
      {loading && <LoadingSpinner size="large" />}
      
      {error && <ErrorMessage message={error} />}
      
      {!loading && !error && (
        <>
          {totalResults > 0 ? (
            <>
              <p className="mb-6 text-gray-600">
                Found {totalResults} {totalResults === 1 ? 'movie' : 'movies'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
              
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg">
              <p className="text-lg">
                {searchQuery 
                  ? `No movies found matching "${searchQuery}". Try a different search term.` 
                  : 'Enter a search term to find movies.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}