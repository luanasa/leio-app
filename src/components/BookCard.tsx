import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types/Book';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRatingText = (rating: number) => {
    if (rating === 5) return 'Masterpiece';
    if (rating === 4) return 'Excellent';
    if (rating === 3) return 'Good Read';
    if (rating === 2) return 'Average';
    return 'Disappointing';
  };

  // Generate random heights for masonry effect
  const heights = ['h-64', 'h-72', 'h-80', 'h-96'];
  const randomHeight = heights[Math.floor(Math.random() * heights.length)];

  return (
    <Link to={`/book/${book.id}`} className="group block break-inside-avoid mb-6">
      <div
        className={`relative ${randomHeight} overflow-hidden bg-gray-200 transition-all duration-500 ease-out group-hover:shadow-2xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-all duration-500 ease-out ${
            isHovered ? 'bg-opacity-40' : 'bg-opacity-0'
          }`}
        />

        {/* Content overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500 ease-out ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-white">
            <h3 className="text-xl font-light mb-1 tracking-tight">
              {book.title}
            </h3>
            <p className="text-sm opacity-90 mb-2">
              {book.author}
            </p>
            <p className="text-xs uppercase tracking-wider opacity-75">
              {getRatingText(book.rating)}
            </p>
          </div>
        </div>

        {/* Bottom gradient for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
};