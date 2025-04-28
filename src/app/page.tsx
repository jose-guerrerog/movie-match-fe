'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import api, { Movie, Recommendation, StatsResponse } from '@/services/api';

// Lazy load components
const MovieList = lazy(() => import('@/components/MovieList'));
const Recommendations = lazy(() => import('@/components/Recommendations'));

// Skeleton loaders
const StatsSkeleton = () => (
  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow p-4 text-center">
        <div className="h-8 bg-gray-200 rounded-full w-16 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
      </div>
    ))}
  </div>
);

const MovieListSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 h-32"></div>
      ))}
    </div>
  </div>
);

const RecommendationsSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>
    <div className="bg-white rounded-lg p-4 h-48"></div>
  </div>
);

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | undefined>(undefined);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load dataset stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const data = await api.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Handle movie selection
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    
    // Scroll to recommendations section on mobile
    if (window.innerWidth < 768) {
      document.getElementById('recommendations')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Handle recommendation selection
  const handleSelectRecommendation = (recommendation: Recommendation) => {
    setSelectedMovie(recommendation);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800">MovieMatch</h1>
        <p className="text-gray-600 mt-2">
          Find your next favorite movie with our intelligent recommendation system
        </p>
        
        {/* Dataset stats with Suspense fallback */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : stats && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalMovies.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Movies</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalRatings.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Ratings</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Movies list with Suspense */}
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Browse Movies</h2>
          <Suspense fallback={<MovieListSkeleton />}>
            <MovieList 
              onSelectMovie={handleSelectMovie} 
              selectedMovieId={selectedMovie?.id}
            />
          </Suspense>
        </div>
        
        {/* Recommendations with Suspense */}
        <div id="recommendations" className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <Suspense fallback={<RecommendationsSkeleton />}>
            <Recommendations
              movie={selectedMovie}
              onSelectRecommendation={handleSelectRecommendation}
            />
          </Suspense>
        </div>
      </div>
      
      <footer className="mt-16 pt-8 border-t text-center text-gray-500 text-sm">
        <p>MovieMatch - Movie Recommendation System © 2025</p>
        <p className="mt-2">
          Using MovieLens dataset - 
          <a href="https://grouplens.org/datasets/movielens/" 
             className="text-blue-500 hover:underline"
             rel="noopener noreferrer"
             target="_blank">
            GroupLens Research
          </a>
        </p>
      </footer>
    </main>
  );
}