import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost/bookstore/api';

const CartPage = () => {
  const { user } = useAuth();
  const { cart, updateQuantity, clearCart, cartTotal } = useCart();
  const [address, setAddress] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address) {
      setError('Please enter shipping address');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        user_id: user.id,
        items: cart.map(item => ({
          book_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: address
      };

      const response = await axios.post(`${API_URL}/orders.php`, orderData);
      setOrderDetails(response.data);
      setShowCheckoutModal(true);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showCheckoutModal && orderDetails) {
      const timer = setTimeout(() => {
        clearCart();
        setShowCheckoutModal(false);

        // Format WhatsApp message
        const booksList = cart.map(item =>
          `- ${item.title} (${item.quantity} x Rp ${item.price.toLocaleString()})`
        ).join('\n');

        const message = `*PESANAN BUKU*%0A%0A` +
          `*Nama:* ${user?.name || 'Pelanggan'}%0A` +
          `*Email:* ${user?.email}%0A` +
          `*Alamat Pengiriman:*%0A${address}%0A%0A` +
          `*Detail Pesanan:*%0A${booksList}%0A%0A` +
          `*Total Pembayaran:* Rp ${cartTotal.toLocaleString()}%0A%0A` +
          `Saya akan melakukan transfer ke:%0A` +
          `Bank BRI 09873928 a.n Fatkhurrohman`;

        window.open(`https://wa.me/6282285512813?text=${message}`, '_blank');
        navigate('/my-orders');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showCheckoutModal, orderDetails]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">Please login to view your cart</p>
        <Link
          to="/login"
          className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-shopping-cart-line text-5xl text-gray-400 mb-4"></i>
          <p className="text-xl text-gray-600">Your cart is empty</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map(item => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition-colors">
                    <div className="sm:w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden shrink-0">
                      {item.cover_image ? (
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <i className="ri-book-line text-3xl text-gray-500"></i>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-600">by {item.author}</p>
                      <p className="text-lg font-semibold mt-1 text-blue-600">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <span className="px-3 py-1 bg-white border-x">{item.quantity}</span>
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="sm:w-24 text-right">
                      <span className="font-bold text-lg">Rp {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="truncate max-w-[70%]">{item.title} x{item.quantity}</span>
                    <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">Rp {cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Shipping Address</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  rows="4"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your complete shipping address"
                  required
                ></textarea>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center transition-colors ${!address || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                onClick={handleCheckout}
                disabled={!address || loading}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="ri-check-line mr-2"></i>
                    Proceed to Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center animate-fade-in">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <i className="ri-checkbox-circle-fill text-5xl text-green-500"></i>
            </div>
            <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            <p className="text-gray-500 text-sm">You will be redirected to WhatsApp for payment confirmation...</p>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <h4 className="font-bold mb-2">Payment Instructions:</h4>
              <p className="text-sm">Please transfer the exact amount to:</p>
              <p className="font-mono bg-gray-200 p-2 rounded mt-1 text-sm">Bank BRI 09873928 a.n Fatkhurrohman</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;