import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookCard } from './BookCard';
import { Book } from '../types/Book';
import { loadBooks, getAllMonths, getBooksByMonth } from '../utils/storage';

export const BookGallery: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    const allBooks = loadBooks();
    const months = getAllMonths();
    setAvailableMonths(months);
    
    if (months.length > 0 && !selectedMonth) {
      setSelectedMonth(months[0]);
    }
    
    const filteredBooks = selectedMonth ? getBooksByMonth(selectedMonth) : allBooks;
    setBooks(filteredBooks);
  }, [selectedMonth]);

  const formatMonthYear = (monthYear: string) => {
    const date = new Date(monthYear);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-6xl font-light text-gray-900 mb-2 tracking-tight">
              leio.
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            {availableMonths.length > 0 && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border-0 bg-transparent text-gray-600 text-sm uppercase tracking-wider focus:outline-none cursor-pointer hover:text-gray-900 transition-colors"
              >
                <option value="">All Books</option>
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonthYear(month)}
                  </option>
                ))}
              </select>
            )}
            
            <Link
              to="/add-book"
              className="text-sm uppercase tracking-wider text-gray-600 hover:text-gray-900 transition-colors duration-200 border-b border-transparent hover:border-gray-900"
            >
              Add Book
            </Link>
          </div>
        </header>

        {/* Books Masonry Grid */}
        {books.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-light text-gray-800 mb-6 tracking-tight">
                Start Your Collection
              </h3>
              <p className="text-gray-600 mb-12 leading-relaxed">
                {selectedMonth 
                  ? `No books found for ${formatMonthYear(selectedMonth)}. Add your first book for this month.`
                  : 'Begin documenting your reading journey by adding your first book.'
                }
              </p>
              <Link
                to="/add-book"
                className="inline-flex items-center gap-3 text-gray-900 border border-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Add Your First Book
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};