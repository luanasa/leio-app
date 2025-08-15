import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, BookOpen } from 'lucide-react';
import { BookFormData } from '../types/Book';
import { addBook } from '../utils/storage';
import { convertFileToDataUrl, generateBookCoverPlaceholder } from '../utils/imageUtils';
import { StarRating } from './StarRating';

export const AddBookForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    coverImage: null,
    monthYear: '',
    rating: 5,
    synopsis: '',
    publicationYear: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.monthYear) {
      newErrors.monthYear = 'Month of reading is required';
    }
    
    if (!formData.synopsis.trim()) {
      newErrors.synopsis = 'Synopsis is required';
    }

    if (formData.publicationYear && (isNaN(Number(formData.publicationYear)) || Number(formData.publicationYear) < 1000 || Number(formData.publicationYear) > new Date().getFullYear())) {
      newErrors.publicationYear = 'Please enter a valid year';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BookFormData, value: string | number | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = async (file: File | null) => {
    setFormData(prev => ({ ...prev, coverImage: file }));
    
    if (file) {
      try {
        const dataUrl = await convertFileToDataUrl(file);
        setCoverPreview(dataUrl);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    } else {
      setCoverPreview('');
    }
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    // Generate options for the past 2 years and future 1 year
    for (let year = currentDate.getFullYear() - 2; year <= currentDate.getFullYear() + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        const value = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        options.push({ value, label });
      }
    }
    
    return options.reverse(); // Most recent first
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let coverImageUrl = '';
      
      if (formData.coverImage) {
        coverImageUrl = await convertFileToDataUrl(formData.coverImage);
      } else {
        // Generate a placeholder cover if no image is uploaded
        coverImageUrl = generateBookCoverPlaceholder(formData.title, formData.author);
      }
      
      const newBook = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        coverImage: coverImageUrl,
        monthYear: formData.monthYear,
        rating: formData.rating,
        synopsis: formData.synopsis.trim(),
        publicationYear: formData.publicationYear ? Number(formData.publicationYear) : undefined,
        dateAdded: new Date().toISOString(),
      };
      
      addBook(newBook);
      navigate('/');
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-12 transition-colors duration-200 text-sm uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Link>

        <div className="bg-white shadow-xl">
          <div className="px-12 py-8 border-b border-gray-200">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight">
              Add New Book
            </h1>
            <p className="text-gray-600 mt-2 font-light">Document your latest read</p>
          </div>

          <form onSubmit={handleSubmit} className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cover Image Section */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-6 uppercase tracking-wider">
                  Book Cover
                </label>
                
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="aspect-[3/4] bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Book cover preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm font-light">Upload book cover</p>
                        <p className="text-gray-400 text-xs mt-1">or we'll generate one for you</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="cursor-pointer bg-gray-900 hover:bg-gray-800 text-white text-center py-3 transition-colors duration-200 text-sm uppercase tracking-wider">
                      {coverPreview ? 'Change Image' : 'Choose Image'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent focus:ring-0 focus:border-gray-900 transition-all duration-200 text-lg font-light ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter book title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent focus:ring-0 focus:border-gray-900 transition-all duration-200 text-lg font-light ${
                      errors.author ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter author name"
                  />
                  {errors.author && (
                    <p className="mt-2 text-sm text-red-600">{errors.author}</p>
                  )}
                </div>

                {/* Publication Year */}
                <div>
                  <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Publication Year
                  </label>
                  <input
                    type="number"
                    id="publicationYear"
                    value={formData.publicationYear}
                    onChange={(e) => handleInputChange('publicationYear', e.target.value)}
                    className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent focus:ring-0 focus:border-gray-900 transition-all duration-200 text-lg font-light ${
                      errors.publicationYear ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g. 2023"
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                  {errors.publicationYear && (
                    <p className="mt-2 text-sm text-red-600">{errors.publicationYear}</p>
                  )}
                </div>

                {/* Month of Reading */}
                <div>
                  <label htmlFor="monthYear" className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Month of Reading *
                  </label>
                  <select
                    id="monthYear"
                    value={formData.monthYear}
                    onChange={(e) => handleInputChange('monthYear', e.target.value)}
                    className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent focus:ring-0 focus:border-gray-900 transition-all duration-200 text-lg font-light ${
                      errors.monthYear ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select month</option>
                    {generateMonthOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.monthYear && (
                    <p className="mt-2 text-sm text-red-600">{errors.monthYear}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Rating *
                  </label>
                  <div className="flex items-center gap-6">
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={(rating) => handleInputChange('rating', rating)}
                      size="lg"
                    />
                    <span className="text-sm text-gray-600 font-light">
                      {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Synopsis */}
                <div>
                  <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
                    Synopsis *
                  </label>
                  <textarea
                    id="synopsis"
                    rows={6}
                    value={formData.synopsis}
                    onChange={(e) => handleInputChange('synopsis', e.target.value)}
                    className={`w-full px-0 py-3 border-0 border-b-2 bg-transparent focus:ring-0 focus:border-gray-900 transition-all duration-200 resize-none text-lg font-light ${
                      errors.synopsis ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Write a brief synopsis of the book..."
                  />
                  {errors.synopsis && (
                    <p className="mt-2 text-sm text-red-600">{errors.synopsis}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-6 pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-light py-4 px-8 transition-all duration-200 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Adding Book...' : 'Add Book to Collection'}
                  </button>
                  
                  <Link
                    to="/"
                    className="px-8 py-4 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm uppercase tracking-wider"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};