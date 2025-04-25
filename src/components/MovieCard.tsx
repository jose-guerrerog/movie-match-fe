import React from 'react';
import { Movie } from '@/services/api';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  selected?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, selected = false }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  // Format the genres to display at most 3
  const displayGenres = movie.genres.slice(0, 3);
  const extraGenres = movie.genres.length > 3 ? movie.genres.length - 3 : 0;

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md overflow-hidden 
                 transition-transform hover:scale-105 cursor-pointer
                 ${selected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Movie title */}
        <h3 className="font-semibold text-lg truncate" title={movie.title}>
          {movie.title}
        </h3>
        
        {/* Year if available */}
        {movie.year && (
          <p className="text-sm text-gray-600">{movie.year}</p>
        )}
        
        {/* Genres */}
        <div className="mt-2 flex flex-wrap gap-1">
          {displayGenres.map((genre) => (
            <span 
              key={genre} 
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {genre}
            </span>
          ))}
          {extraGenres > 0 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
              +{extraGenres}
            </span>
          )}
        </div>
      </div>
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          ✓
        </div>
      )}
    </div>
  );
};
