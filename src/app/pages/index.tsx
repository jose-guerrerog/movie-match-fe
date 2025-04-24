import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { MovieCard } from '@/components/MovieCard';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { fetchMovies, fetchStats } from '@/services/api';
import { Movie, StatsResponse } from '@/types';

const Home: NextPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 20;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch movies
        const movieData = await fetchMovies(page, limit);
        setMovies(movieData.movies);
        setTotalPages(Math.ceil(movieData.total / limit));
        
        // Fetch stats if on first page
        if (page === 1 && !stats) {
          const statsData = await fetchStats();
          setStats(statsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  return (
    <>
      <Head>
        <title>MovieMatch - Movie Recommendation System</title>
        <meta name="description" content="Find personalized movie recommendations" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        {/* Hero section */}
        <div className="bg-blue-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Welcome to MovieMatch</h1>
          <p className="text-lg mb-6">
            Discover movies you'll love with our intelligent recommendation system. 
            Browse our collection or search for your favorite films to get personalized recommendations.
          </p>
          
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-2xl font-bold">{stats.totalMovies.toLocaleString()}</p>
                <p className="text-sm">Movies</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm">Users</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-2xl font-bold">{stats.totalRatings.toLocaleString()}</p>
                <p className="text-sm">Ratings</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
                <p className="text-sm">Avg. Rating</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Movie list */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Explore Movies</h2>
          
          {loading && <LoadingSpinner size="large" />}
          
          {error && <ErrorMessage message={error} />}
          
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          )}
        </div>
      </div>
    </>
  );
};

export default Home;