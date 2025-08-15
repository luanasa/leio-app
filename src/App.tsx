import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookGallery } from './components/BookGallery';
import { BookDetail } from './components/BookDetail';
import { AddBookForm } from './components/AddBookForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BookGallery />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/add-book" element={<AddBookForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;