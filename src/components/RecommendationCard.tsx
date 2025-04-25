import React, { useState } from 'react';
import { Recommendation } from '@/services/api';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onClick?: (recommendation: Recommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onClick 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(recommendation);
    }
  };
  
  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Movie title */}
        <h3 className="font-semibold text-lg truncate" title={recommendation.title}>
          {recommendation.title}
        </h3>
        
        {/* Year if available */}
        {recommendation.year && (
          <p className="text-sm text-gray-600">{recommendation.year}</p>
        )}
        
        {/* Genres */}
        <div className="mt-2 flex flex-wrap gap-1">
          {recommendation.genres.slice(0, 3).map((genre) => (
            <span 
              key={genre} 
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {genre}
            </span>
          ))}
          {recommendation.genres.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              +{recommendation.genres.length - 3}
            </span>
          )}
        </div>
        
        {/* Explanation toggle */}
        <button
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          onClick={toggleExpanded}
        >
          {expanded ? 'Hide explanation' : 'Why recommended?'}
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        
        {/* Explanation */}
        {expanded && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
            {recommendation.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
