import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost/bookstore/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    books: 0,
    categories: 0,
    orders: 0,
    users: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          booksRes, 
          categoriesRes, 
          ordersRes, 
          usersRes, 
          messagesRes, 
          recentOrdersRes, 
          recentMessagesRes
        ] = await Promise.all([
          axios.get(`${API_URL}/books.php`),
          axios.get(`${API_URL}/categories.php`),
          axios.get(`${API_URL}/orders.php`),
          axios.get(`${API_URL}/users.php`),
          axios.get(`${API_URL}/messages.php`),
          axios.get(`${API_URL}/orders.php?limit=5`),
          axios.get(`${API_URL}/messages.php?limit=5`)
        ]);
        
        setStats({
          books: booksRes.data.length,
          categories: categoriesRes.data.length,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
          messages: messagesRes.data.length
        });
        
        setRecentOrders(recentOrdersRes.data.slice(0, 5));
        setRecentMessages(recentMessagesRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-indigo-600 mb-2"></i>
          <p className="text-gray-600">Memuat dashboard...</p>
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
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-gray-600">Ringkasan aktivitas BookNest</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <DashboardCard 
          title="Total Buku" 
          value={stats.books} 
          icon="ri-book-2-line" 
          color="indigo" 
          link="/admin/books"
        />
        <DashboardCard 
          title="Total Kategori" 
          value={stats.categories} 
          icon="ri-list-check-2" 
          color="blue" 
          link="/admin/categories"
        />
        <DashboardCard 
          title="Total Pesanan" 
          value={stats.orders} 
          icon="ri-shopping-bag-line" 
          color="green" 
          link="/admin/orders"
        />
        <DashboardCard 
          title="Total Pengguna" 
          value={stats.users} 
          icon="ri-user-line" 
          color="purple" 
          link="/admin/users"
        />
        <DashboardCard 
          title="Pesan Baru" 
          value={stats.messages} 
          icon="ri-mail-line" 
          color="yellow" 
          link="/admin/messages"
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="ri-shopping-bag-line mr-2 text-indigo-600"></i>
              Pesanan Terbaru
            </h2>
            <Link to="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
              Lihat Semua <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentOrders.map(order => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/admin/orders`} className="font-medium text-indigo-600 hover:text-indigo-800">
                        Pesanan #{order.id}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{order.username}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
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
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      <i className="ri-calendar-line mr-1"></i>
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="font-medium text-gray-900">
                      Rp {parseFloat(order.total_amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <i className="ri-shopping-bag-line text-3xl text-gray-300 mb-2"></i>
              <p className="text-gray-500">Belum ada pesanan terbaru</p>
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="ri-mail-line mr-2 text-indigo-600"></i>
              Pesan Terbaru
            </h2>
            <Link to="/admin/messages" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
              Lihat Semua <i className="ri-arrow-right-line ml-1"></i>
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentMessages.map(message => (
                <div key={message.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{message.name}</h3>
                      <a 
                        href={`mailto:${message.email}`} 
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                      >
                        <i className="ri-mail-line mr-1"></i>
                        {message.email}
                      </a>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                  {message.username && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <i className="ri-user-line mr-1"></i>
                      Pengguna: {message.username}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <i className="ri-mail-line text-3xl text-gray-300 mb-2"></i>
              <p className="text-gray-500">Belum ada pesan terbaru</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="ri-rocket-line mr-2 text-indigo-600"></i>
            Akses Cepat
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
          <DashboardLink 
            title="Kelola Buku" 
            icon="ri-book-2-line" 
            color="indigo" 
            link="/admin/books"
          />
          <DashboardLink 
            title="Kelola Kategori" 
            icon="ri-list-check-2" 
            color="blue" 
            link="/admin/categories"
          />
          <DashboardLink 
            title="Kelola Pesanan" 
            icon="ri-shopping-bag-line" 
            color="green" 
            link="/admin/orders"
          />
          <DashboardLink 
            title="Kelola Pengguna" 
            icon="ri-user-line" 
            color="purple" 
            link="/admin/users"
          />
          <DashboardLink 
            title="Lihat Pesan" 
            icon="ri-mail-line" 
            color="yellow" 
            link="/admin/messages"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color, link }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };
  
  return (
    <Link to={link} className={`p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 ${colorClasses[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-white bg-opacity-50`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </Link>
  );
};

const DashboardLink = ({ title, icon, color, link }) => {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    green: 'text-green-600 bg-green-50 hover:bg-green-100',
    purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
  };
  
  return (
    <Link 
      to={link} 
      className={`p-4 rounded-lg flex items-center transition-colors duration-300 ${colorClasses[color]}`}
    >
      <i className={`${icon} text-xl mr-3`}></i>
      <span className="font-medium">{title}</span>
    </Link>
  );
};

export default AdminDashboard;