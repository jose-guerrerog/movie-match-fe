import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }[size];
  
  return (
    <div className="flex justify-center items-center my-8">
      <div className={`${sizeClass} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
};