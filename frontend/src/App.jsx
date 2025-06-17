import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMessages from './pages/admin/AdminMessages';
import AdminUsers from './pages/admin/AdminUsers';
import UserOrders from './pages/UserOrders';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import MainLayout from './layouts/MainLayout';
import EmptyLayout from './layouts/EmptyLayout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Routes tanpa Navbar dan Footer */}
          <Route
            path="/login"
            element={
              <EmptyLayout>
                <LoginPage />
              </EmptyLayout>
            }
          />
          <Route
            path="/register"
            element={
              <EmptyLayout>
                <RegisterPage />
              </EmptyLayout>
            }
          />

          {/* Routes dengan Navbar dan Footer */}
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books/:id" element={<BookDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/my-orders" element={<UserOrders />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/books" element={<AdminBooks />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
