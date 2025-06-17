import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost/bookstore/api';

const ContactPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        user_id: user?.id || null
      };
      
      await axios.post(`${API_URL}/messages.php`, payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.error || 'Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">Hubungi Kami</h1>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Punya pertanyaan atau masukan? Silakan hubungi kami melalui form berikut atau informasi kontak yang tersedia.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          {submitted ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <i className="ri-checkbox-circle-fill text-4xl text-green-500 mb-3"></i>
                <h3 className="text-xl font-bold text-green-800 mb-2">Pesan Terkirim!</h3>
                <p className="text-gray-600 mb-4">
                  Terima kasih atas pesan Anda. Kami akan segera menghubungi Anda kembali.
                </p>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: user?.username || '',
                      email: user?.email || '',
                      message: ''
                    });
                  }}
                >
                  <i className="ri-mail-send-line mr-2"></i>
                  Kirim Pesan Lain
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <i className="ri-error-warning-line mr-2"></i>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line mr-2"></i>
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <i className="ri-map-pin-2-line text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Alamat</h3>
                  <p className="text-gray-600">Jl. Buku No. 123, Jakarta Selatan, Indonesia 12345</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <i className="ri-phone-line text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Telepon</h3>
                  <p className="text-gray-600">(021) 1234-5678</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <i className="ri-mail-line text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">info@booknest.id</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <i className="ri-time-line text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Jam Operasional</h3>
                  <p className="text-gray-600">Senin - Jumat: 09.00 - 17.00 WIB</p>
                  <p className="text-gray-600">Sabtu: 09.00 - 14.00 WIB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Media Sosial</h2>
            <div className="flex space-x-4">
              <a href="#" className="bg-indigo-100 text-indigo-600 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="bg-indigo-100 text-indigo-600 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="bg-indigo-100 text-indigo-600 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="bg-indigo-100 text-indigo-600 p-3 rounded-full hover:bg-indigo-200 transition-colors">
                <i className="ri-whatsapp-line text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;