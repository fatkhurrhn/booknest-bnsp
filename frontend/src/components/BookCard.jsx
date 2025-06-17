// BookCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <Link
        to={`/books/${book.id}`}
        className="relative block h-60 bg-gray-50 flex items-center justify-center overflow-hidden"
      >
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
              e.target.className = 'hidden';
              e.target.parentElement.innerHTML = '<i class="ri-book-line text-5xl text-gray-300"></i>';
            }}
          />
        ) : (
          <i className="ri-book-line text-5xl text-gray-300"></i>
        )}

        {/* Category label in top-left */}
        {book.category_name && (
          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-md z-10">
            {book.category_name}
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/books/${book.id}`} className="block">
          <h3
            className="font-bold text-lg mb-1 text-gray-800 hover:text-indigo-600 line-clamp-2"
            title={book.title}
          >
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-2 line-clamp-1" title={`by ${book.author}`}>
          by {book.author}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg text-indigo-700">
            Rp {parseFloat(book.price).toLocaleString('id-ID')}
          </span>

          <div className="flex space-x-2">
            <Link
              to={`/books/${book.id}`}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <i className="ri-eye-line mr-1"></i> Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
