import React, { useState, useEffect } from 'react';
import api, { Movie, Recommendation } from '@/services/api';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationsProps {
  movie?: Movie;
  onSelectRecommendation?: (recommendation: Recommendation) => void;
}

const Recommendations: React.FC<RecommendationsProps> = ({ 
  movie, 
  onSelectRecommendation 
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load recommendations when movie changes
  useEffect(() => {
    if (!movie) {
      setRecommendations([]);
      return;
    }

    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using default method - no need to specify method parameter
        const data = await api.getRecommendations(movie.id, 6);
        setRecommendations(data.recommendations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [movie]);

  if (!movie) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a movie to see recommendations
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Recommendations for {movie.title}
        </h2>
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
      {!loading && !error && recommendations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No recommendations found for this movie.</p>
        </div>
      )}

      {/* Recommendations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onClick={onSelectRecommendation}
          />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;