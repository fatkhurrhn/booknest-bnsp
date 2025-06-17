import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost/bookstore/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/orders.php`;
        const params = [];
        
        if (filterStatus !== 'all') {
          params.push(`status=${filterStatus}`);
        }
        
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
        
        const response = await axios.get(url);
        setOrders(response.data);
        
        // Calculate statistics
        const statsData = {
          total: response.data.length,
          pending: response.data.filter(o => o.status === 'pending').length,
          processing: response.data.filter(o => o.status === 'processing').length,
          completed: response.data.filter(o => o.status === 'completed').length,
          cancelled: response.data.filter(o => o.status === 'cancelled').length
        };
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Gagal memuat data pesanan');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [filterStatus, searchQuery]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/orders.php`, {
        id: orderId,
        status: status
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      setSuccessMessage('Status pesanan berhasil diperbarui');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Gagal memperbarui status pesanan: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data pesanan...</p>
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
            <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              <i className="ri-home-line mr-2"></i>
              Dashboard
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="ml-1 md:ml-2 text-sm font-medium text-gray-500">Kelola Pesanan</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Pesanan</h1>
          <p className="mt-1 text-sm text-gray-600">Kelola semua pesanan pelanggan di sini</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              Total: {stats.total} pesanan
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Menunggu</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <i className="ri-time-line text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Diproses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <i className="ri-refresh-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <i className="ri-checkbox-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Dibatalkan</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <i className="ri-close-circle-line text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
              <p className="text-2xl font-bold text-indigo-600">
                Rp {orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <i className="ri-money-dollar-circle-line text-indigo-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="ri-checkbox-circle-line text-green-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-500 text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ID pesanan, atau alamat..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-filter-line text-gray-400"></i>
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="processing">Diproses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i className="ri-arrow-down-s-line text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-500 mb-2">Tidak ada pesanan ditemukan</h3>
          <p className="text-gray-400 mb-4">Coba ubah filter pencarian Anda</p>
          <button 
            onClick={() => {
              setFilterStatus('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="ri-refresh-line mr-2"></i> Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                      <span className="text-sm font-medium leading-none text-indigo-800">#{order.id}</span>
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-semibold text-gray-900">Pesanan #{order.id}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'pending' ? 'Menunggu' :
                         order.status === 'processing' ? 'Diproses' :
                         order.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <i className="ri-calendar-line mr-1"></i>
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-indigo-600">Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="processing">Diproses</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Body */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="ri-user-3-line mr-2 text-indigo-600"></i>
                      Informasi Pelanggan
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</p>
                        <p className="text-sm font-medium text-gray-900">{order.username}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pelanggan</p>
                        <p className="text-sm font-medium text-gray-900">{order.user_id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium text-gray-900">{order.email || '-'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                      <i className="ri-truck-line mr-2 text-indigo-600"></i>
                      Informasi Pengiriman
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</p>
                        <p className="text-sm font-medium text-gray-900">{order.shipping_address}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Metode Pembayaran</p>
                        <p className="text-sm font-medium text-gray-900">{order.payment_method || 'Transfer Bank'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">No. Resi</p>
                        <p className="text-sm font-medium text-gray-900">{order.tracking_number || 'Belum tersedia'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                    <i className="ri-shopping-bag-3-line mr-2 text-indigo-600"></i>
                    Daftar Produk
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map(item => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {item.cover_image ? (
                                    <img className="h-10 w-10 rounded-sm object-cover" src={item.cover_image} alt={item.title} />
                                  ) : (
                                    <div className="h-10 w-10 bg-gray-200 rounded-sm flex items-center justify-center">
                                      <i className="ri-book-line text-gray-400"></i>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                  <div className="text-sm text-gray-500">by {item.author}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Rp {parseFloat(item.price).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Total</td>
                          <td className="px-6 py-3 text-sm font-bold text-gray-900">Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;