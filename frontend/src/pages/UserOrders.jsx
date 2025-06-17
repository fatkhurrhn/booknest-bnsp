import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost/bookstore/api';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${API_URL}/orders.php?user_id=${user.id}`);
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <div className="text-6xl mb-4 text-blue-500">
            <i className="ri-login-box-line"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your order history</p>
          <a 
            href="/login" 
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300"
          >
            Login Now
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-5xl text-blue-500"></i>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Order History
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            {orders.length > 0 
              ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''}`
              : "Let's find your next favorite book"}
          </p>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-sm p-12 max-w-2xl mx-auto">
            <div className="mx-auto h-24 w-24 text-blue-500 mb-6">
              <i className="ri-shopping-bag-3-line text-6xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              Your order history is empty. Start exploring our collection of books!
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <i className="ri-book-line mr-2"></i> Browse Books
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-lg">
                <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Order #<span className="text-blue-600">{order.id}</span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Shipping Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">{order.shipping_address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 h-16 w-12 bg-gray-200 rounded overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500">
                                  <i className="ri-book-line text-xl"></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-900">{item.title}</h5>
                              <p className="text-xs text-gray-500">by {item.author}</p>
                              <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Rp {(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Rp {item.price.toLocaleString()} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Payment Method: <span className="font-medium text-gray-700">{order.payment_method || 'Credit Card'}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">Rp {order.total_amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;