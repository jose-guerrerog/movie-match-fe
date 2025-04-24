import React from 'react';
import { RecommendationMethod } from '@/types';

interface RecommendationMethodSelectorProps {
  value: RecommendationMethod;
  onChange: (method: RecommendationMethod) => void;
}

export const RecommendationMethodSelector: React.FC<RecommendationMethodSelectorProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <p className="text-sm font-medium text-gray-700">Recommendation Method:</p>
      <div className="flex space-x-2">
        <MethodButton 
          active={value === 'hybrid'} 
          onClick={() => onChange('hybrid')}
          label="Hybrid"
          description="Combines content-based and collaborative filtering"
        />
        <MethodButton 
          active={value === 'content'} 
          onClick={() => onChange('content')}
          label="Content-based"
          description="Recommends similar movies based on attributes"
        />
        <MethodButton 
          active={value === 'collaborative'} 
          onClick={() => onChange('collaborative')}
          label="Collaborative"
          description="Recommends based on user preferences"
        />
      </div>
    </div>
  );
};

interface MethodButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  description: string;
}

const MethodButton: React.FC<MethodButtonProps> = ({ active, onClick, label, description }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={description}
    >
      {label}
    </button>
  );
};
