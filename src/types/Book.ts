export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  monthYear: string;
  rating: number;
  synopsis: string;
  authorPhoto?: string;
  publicationYear?: number;
  dateAdded: string;
}

export interface BookFormData {
  title: string;
  author: string;
  coverImage: File | null;
  monthYear: string;
  rating: number;
  synopsis: string;
  publicationYear: string;
}