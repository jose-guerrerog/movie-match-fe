'use client'

import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { RecommendationCard } from '@/components/RecommendationCard';
import { RecommendationMethodSelector } from '@/components/RecommendationMethod';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { fetchRecommendations } from '@/services/api';
import { 
  Movie, 
  MovieRecommendation, 
  RecommendationMethod
} from '@/types';

const MovieDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<RecommendationMethod>('hybrid');

  useEffect(() => {
    const fetchData = async () => {
      if (!id || isNaN(Number(id))) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetchRecommendations(Number(id), method);
        setMovie(response.baseMovie);
        setRecommendations(response.recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, method]);

  const handleMethodChange = (newMethod: RecommendationMethod) => {
    setMethod(newMethod);
  };

  return (
    <>
      <Head>
        <title>{movie ? `${movie.title} - MovieMatch` : 'Movie Details - MovieMatch'}</title>
        <meta 
          name="description" 
          content={movie ? `Get recommendations similar to ${movie.title}` : 'Movie details and recommendations'} 
        />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        {loading && <LoadingSpinner size="large" />}
        
        {error && <ErrorMessage message={error} />}
        
        {!loading && !error && movie && (
          <>
            {/* Movie details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
              
              <div className="mb-4">
                {movie.year && <span className="text-gray-600 mr-4">Year: {movie.year}</span>}
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">Recommended Movies</h2>
                <RecommendationMethodSelector value={method} onChange={handleMethodChange} />
              </div>
              
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((recommendation) => (
                    <RecommendationCard 
                      key={recommendation.id} 
                      recommendation={recommendation} 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No recommendations found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MovieDetail;