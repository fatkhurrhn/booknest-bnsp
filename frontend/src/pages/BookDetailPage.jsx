import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const API_URL = 'http://localhost/bookstore/api';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, showNotification, notificationMessage } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/books.php`);
        const foundBook = response.data.find(b => b.id === parseInt(id));
        if (foundBook) {
          setBook(foundBook);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        setError('Gagal memuat detail buku');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-indigo-600 mb-2"></i>
          <p className="text-gray-600">Memuat detail buku...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <i className="ri-book-line text-4xl text-gray-400 mb-4"></i>
        <h2 className="text-xl font-medium text-gray-600">Buku tidak ditemukan</h2>
        <Link 
          to="/books" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Kembali ke Daftar Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-out">
          <i className="ri-checkbox-circle-line mr-2"></i>
          {notificationMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
              <i className="ri-home-line mr-2"></i>
              Beranda
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{book.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Book Cover */}
        <div className="lg:w-1/3">
          <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center h-96 shadow-sm border border-gray-200">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.className = 'hidden';
                }}
              />
            ) : (
              <div className="text-center p-6">
                <i className="ri-book-line text-8xl text-gray-300 mb-4"></i>
                <p className="text-gray-400">Gambar tidak tersedia</p>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">Oleh {book.author}</p>

          {book.category_name && (
            <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mb-4">
              {book.category_name}
            </span>
          )}

          {/* Price and Stock */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-indigo-600">Rp {parseFloat(book.price).toLocaleString('id-ID')}</span>
              <span className={`text-sm ${
                book.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {book.stock > 0 
                  ? `Tersedia (${book.stock} stok)` 
                  : 'Stok habis'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <i className="ri-file-text-line mr-2 text-indigo-600"></i>
              Deskripsi Buku
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">
                {book.description || 'Belum ada deskripsi untuk buku ini.'}
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          {user ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <button
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={book.stock <= 0 || quantity >= book.stock}
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>

              <button
                className={`px-6 py-3 rounded-lg flex items-center justify-center transition-colors ${
                  book.stock > 0 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => addToCart(book, quantity)}
                disabled={book.stock <= 0}
              >
                <i className="ri-shopping-cart-line mr-2"></i>
                Tambah ke Keranjang
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="ri-information-line text-yellow-500"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Silakan <Link to="/login" className="text-indigo-600 font-medium underline">login</Link> untuk menambahkan buku ke keranjang belanja.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;