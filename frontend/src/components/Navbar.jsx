import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, fetchCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FDFAF5] border-b border-[#2D6A2D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link to="/" className="text-[#8B1A1A] font-bold font-serif text-2xl">
            Thaaragai Naturals
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="relative group text-gray-800 hover:text-[#8B1A1A] transition-colors font-medium">
                {link.name}
                <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B1A1A] group-hover:w-full transition-all duration-300"></motion.span>
              </Link>
            ))}

            {/* Auth Section Desktop */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-white bg-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-700 transition-colors mr-2">
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" className="text-gray-800 hover:text-[#8B1A1A] font-medium transition-colors mr-4">
                    My Orders
                  </Link>
                  <span className="text-[#2D6A2D] font-medium flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button 
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors ml-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-800 hover:text-[#8B1A1A] font-medium transition-colors">Login</Link>
                  <Link to="/register" className="bg-[#8B1A1A] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-900 transition-colors">Register</Link>
                </>
              )}
            </div>
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative text-gray-800 hover:text-[#8B1A1A] transition-colors ml-4">
              <ShoppingCart className="w-6 h-6" />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-800">
              <ShoppingCart className="w-6 h-6" />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FDFAF5] border-t border-[#2D6A2D]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#2D6A2D] hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Auth Section Mobile */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-[#2D6A2D] font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Hi, {user?.name?.split(' ')[0]}
                  </div>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 mx-3 mb-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#2D6A2D] hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-[#2D6A2D] hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-[#8B1A1A] hover:bg-red-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
