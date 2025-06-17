// HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API_URL = 'http://localhost/bookstore/api';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const url = selectedCategory === 'all' 
          ? `${API_URL}/books.php${searchTerm ? `?search=${searchTerm}` : ''}`
          : `${API_URL}/books.php?category=${selectedCategory}${searchTerm ? `&search=${searchTerm}` : ''}`;
        
        const response = await axios.get(url);
        setBooks(response.data);
      } catch (error) {
        console.error('Gagal memuat buku:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories.php`);
        setCategories(response.data);
      } catch (error) {
        console.error('Gagal memuat kategori:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-indigo-50 rounded-xl p-8 mb-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">Selamat Datang di BookNest</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Temukan buku favoritmu berikutnya dari koleksi lengkap kami di berbagai genre.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Cari berdasarkan judul, penulis, atau kata kunci..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <i className="ri-filter-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* Featured Books Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <i className="ri-star-fill text-yellow-400 mr-2"></i>
          {selectedCategory === 'all' ? 'Buku Unggulan' : `Buku ${categories.find(c => c.id === selectedCategory)?.name || ''}`}
        </h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {books.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <i className="ri-book-line text-5xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-600 mb-2">Buku tidak ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-50 rounded-xl p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Tidak menemukan buku yang kamu cari?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Kami terus menambahkan judul-judul baru ke koleksi kami. Hubungi kami jika kamu mencari buku tertentu.
        </p>
        <Link 
          to="/contact" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <i className="ri-mail-line mr-2"></i> Hubungi Kami
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
