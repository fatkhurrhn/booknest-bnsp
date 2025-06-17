import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="ri-book-2-line mr-2 text-indigo-600"></i>
              BookNest
            </h3>
            <p className="text-gray-500">
              Your trusted online bookstore with the best selection of titles across all genres.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600">
                <i className="ri-instagram-line text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-indigo-600">Home</a>
              </li>
              <li>
                <a href="/books" className="text-gray-500 hover:text-indigo-600">Books</a>
              </li>
              <li>
                <a href="/about" className="text-gray-500 hover:text-indigo-600">About Us</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-500 hover:text-indigo-600">Contact</a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600">Returns & Refunds</a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-indigo-600">Track Order</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-start">
                <i className="ri-map-pin-line mr-2 mt-1 text-indigo-600"></i>
                <span>123 Book Street, Literary District, 10110</span>
              </li>
              <li className="flex items-center">
                <i className="ri-mail-line mr-2 text-indigo-600"></i>
                <a href="mailto:info@booknest.com" className="hover:text-indigo-600">info@booknest.com</a>
              </li>
              <li className="flex items-center">
                <i className="ri-phone-line mr-2 text-indigo-600"></i>
                <a href="tel:+1234567890" className="hover:text-indigo-600">(123) 456-7890</a>
              </li>
              <li className="flex items-center">
                <i className="ri-time-line mr-2 text-indigo-600"></i>
                <span>Mon-Fri: 9am-6pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;