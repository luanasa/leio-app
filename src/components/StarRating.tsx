import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                     transition-transform duration-150 ${readonly ? '' : 'focus:outline-none'}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-gray-900 text-gray-900'
                : 'text-gray-300 hover:text-gray-600'
            } transition-colors duration-150`}
          />
        </button>
      ))}
    </div>
  );
};