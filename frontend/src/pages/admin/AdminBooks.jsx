import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost/bookstore/api';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    author: '',
    description: '',
    price: '',
    category_id: '',
    cover_image: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/books.php`),
        axios.get(`${API_URL}/categories.php`)
      ]);
      
      setBooks(booksRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data buku');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setFormData({
      id: '',
      title: '',
      author: '',
      description: '',
      price: '',
      category_id: '',
      cover_image: '',
      stock: ''
    });
    setModalType('add');
    setModalOpen(true);
    setError('');
    setSuccessMessage('');
  };

  const openEditModal = (book) => {
    setFormData({
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description || '',
      price: book.price,
      category_id: book.category_id || '',
      cover_image: book.cover_image || '',
      stock: book.stock
    });
    setModalType('edit');
    setModalOpen(true);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (modalType === 'edit') {
        await axios.put(`${API_URL}/books.php`, formData);
        setSuccessMessage('Buku berhasil diperbarui');
      } else {
        await axios.post(`${API_URL}/books.php`, formData);
        setSuccessMessage('Buku berhasil ditambahkan');
      }
      
      fetchData();
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMessage('');
      }, 1500);
    } catch (error) {
      console.error('Error saving book:', error);
      setError(error.response?.data?.error || 'Gagal menyimpan buku');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await axios.delete(`${API_URL}/books.php?id=${id}`);
        setBooks(prev => prev.filter(book => book.id !== id));
        setSuccessMessage('Buku berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting book:', error);
        setError('Gagal menghapus buku');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-indigo-600 mb-2"></i>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
              <i className="ri-home-line mr-2"></i>
              Dashboard
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="ml-1 md:ml-2 text-sm font-medium text-gray-500">Kelola Buku</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Buku</h1>
          <p className="mt-1 text-sm text-gray-600">Tambah, edit, atau hapus buku</p>
        </div>
        <button
          onClick={openAddModal}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i className="ri-add-line mr-2"></i>
          Tambah Buku
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-checkbox-circle-line text-green-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
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

      {/* Books Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judul Buku
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penulis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.length > 0 ? (
                books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {book.cover_image ? (
                          <img 
                            src={book.cover_image} 
                            alt={book.title} 
                            className="h-10 w-10 rounded object-cover mr-4"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = '';
                              e.target.className = 'hidden';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center mr-4">
                            <i className="ri-book-line text-gray-500"></i>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{book.title}</div>
                          
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rp {parseFloat(book.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.category_name || 'Tanpa Kategori'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <button
                        onClick={() => openEditModal(book)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Hapus"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    <i className="ri-inbox-line text-3xl text-gray-400 mb-2"></i>
                    <p>Tidak ada data buku</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {modalType === 'add' ? 'Tambah Buku Baru' : 'Edit Buku'}
                      </h3>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <i className="ri-close-line text-xl"></i>
                      </button>
                    </div>
                    <div className="mt-4">
                      {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
                      {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <i className="ri-checkbox-circle-line text-green-500"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                              Judul Buku
                            </label>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              required
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.title}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                              Penulis
                            </label>
                            <input
                              type="text"
                              id="author"
                              name="author"
                              required
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.author}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                              Harga (Rp)
                            </label>
                            <input
                              type="number"
                              id="price"
                              name="price"
                              step="1000"
                              min="0"
                              required
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.price}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                              Stok
                            </label>
                            <input
                              type="number"
                              id="stock"
                              name="stock"
                              min="0"
                              required
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.stock}
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                              Kategori
                            </label>
                            <select
                              id="category_id"
                              name="category_id"
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.category_id}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Pilih Kategori</option>
                              {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-1">
                              URL Gambar Cover
                            </label>
                            <input
                              type="text"
                              id="cover_image"
                              name="cover_image"
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.cover_image}
                              onChange={handleChange}
                              placeholder="Opsional"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows="3"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.description}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            {modalType === 'add' ? 'Tambah Buku' : 'Simpan Perubahan'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;