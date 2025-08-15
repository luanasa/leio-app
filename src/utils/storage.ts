import { Book } from '../types/Book';

const STORAGE_KEY = 'leio-books';

export const saveBooks = (books: Book[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

export const loadBooks = (): Book[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
};

export const addBook = (book: Book): void => {
  const books = loadBooks();
  books.push(book);
  saveBooks(books);
};

export const getBooksByMonth = (monthYear: string): Book[] => {
  const books = loadBooks();
  return books.filter(book => book.monthYear === monthYear)
               .sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
};

export const getAllMonths = (): string[] => {
  const books = loadBooks();
  const months = [...new Set(books.map(book => book.monthYear))];
  return months.sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).reverse();
};