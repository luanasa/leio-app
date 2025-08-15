import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Book } from '../types/Book';
import { loadBooks, getBooksByMonth } from '../utils/storage';
import { StarRating } from './StarRating';

export const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [monthBooks, setMonthBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    const books = loadBooks();
    const foundBook = books.find(b => b.id === id);
    
    if (!foundBook) {
      navigate('/');
      return;
    }
    
    setBook(foundBook);
    
    // Get all books from the same month
    const booksFromMonth = getBooksByMonth(foundBook.monthYear);
    setMonthBooks(booksFromMonth);
    
    // Find current book index in the month
    const index = booksFromMonth.findIndex(b => b.id === id);
    setCurrentIndex(index);
  }, [id, navigate]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const previousBook = currentIndex > 0 ? monthBooks[currentIndex - 1] : null;
  const nextBook = currentIndex < monthBooks.length - 1 ? monthBooks[currentIndex + 1] : null;

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
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-12 transition-colors duration-200 text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Book Cover */}
          <div className="relative">
            <div className="aspect-[3/4] bg-gray-200 overflow-hidden shadow-2xl">
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="relative">
            {/* Publication Year Watermark */}
            {book.publicationYear && (
              <div className="absolute top-0 right-0 text-[12rem] font-light text-gray-100 select-none leading-none">
                {book.publicationYear}
              </div>
            )}

            <div className="relative z-10">
              <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8 font-light">
                {book.author}
              </p>
              
              <div className="flex items-center gap-6 mb-12">
                <StarRating rating={book.rating} readonly size="md" />
                <div className="flex items-center gap-2 text-gray-500 text-sm uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>{formatMonthYear(book.monthYear)}</span>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-6 tracking-tight">
                  Synopsis
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed font-light whitespace-pre-wrap">
                    {book.synopsis}
                  </p>
                </div>
              </div>

              {/* Author Photo (if available) */}
              {book.authorPhoto && (
                <div className="mb-12">
                  <h3 className="text-xl font-light text-gray-900 mb-4 tracking-tight">
                    About the Author
                  </h3>
                  <img
                    src={book.authorPhoto}
                    alt={book.author}
                    className="w-16 h-16 rounded-full object-cover grayscale"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        {monthBooks.length > 1 && (
          <div className="border-t border-gray-200 mt-16 pt-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 uppercase tracking-wider">
                {currentIndex + 1} of {monthBooks.length} from {formatMonthYear(book.monthYear)}
              </div>
              
              <div className="flex gap-6">
                {previousBook ? (
                  <Link
                    to={`/book/${previousBook.id}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 text-gray-300 cursor-not-allowed text-sm uppercase tracking-wider">
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </div>
                )}

                {nextBook ? (
                  <Link
                    to={`/book/${nextBook.id}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 text-gray-300 cursor-not-allowed text-sm uppercase tracking-wider">
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};