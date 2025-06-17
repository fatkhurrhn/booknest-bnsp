import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost/bookstore/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages.php`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Gagal memuat pesan pelanggan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-indigo-600 mb-2"></i>
          <p className="text-gray-600">Memuat pesan...</p>
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
              <span className="ml-1 md:ml-2 text-sm font-medium text-gray-500">Pesan Pelanggan</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pesan Pelanggan</h1>
          <p className="mt-1 text-sm text-gray-600">Daftar pesan dari pelanggan BookNest</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
            Total: {messages.length} pesan
          </span>
        </div>
      </div>

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

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <i className="ri-mail-line text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-500 mb-2">Belum ada pesan</h3>
          <p className="text-gray-400">Tidak ada pesan dari pelanggan saat ini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="font-bold text-gray-900">{message.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <a href={`mailto:${message.email}`} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                      <i className="ri-mail-line mr-1"></i>
                      {message.email}
                    </a>
                    {message.username && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <i className="ri-user-line mr-1"></i>
                        {message.username}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  <i className="ri-time-line mr-1"></i>
                  {new Date(message.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="p-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <i className="ri-chat-1-line mr-2 text-indigo-600"></i>
                    Isi Pesan
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;