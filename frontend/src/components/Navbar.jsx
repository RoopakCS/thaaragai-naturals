import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import logoCropped from '../assets/logo-cropped.jpg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, fetchCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

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
    <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-5 px-6 md:px-10 lg:px-12 transition-all duration-300">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex justify-between items-center h-12">
          {/* Brand - Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity flex items-center justify-center">
            <img src={logoCropped} alt="Thaaragai Naturals Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`flex items-center transition-colors text-[14px] tracking-tight ${isActive ? 'text-[#1a3a28] font-bold border-b-2 border-[#1a3a28] pb-0.5' : 'text-[#0a1f13]/70 hover:text-[#0a1f13] font-medium'}`}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <svg className="w-3.5 h-3.5 ml-1 opacity-70 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions - Delicate thin icons */}
          <div className="hidden lg:flex items-center space-x-5 text-[#0a1f13]">
            {isAuthenticated ? (
              <Link to="/orders" className="hover:opacity-60 transition-opacity flex items-center">
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
            ) : (
              <Link to="/login" className="hover:opacity-60 transition-opacity">
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
            )}

            <Link to="/cart" className="relative hover:opacity-60 transition-opacity">
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#e03b3b] text-white text-[9px] font-bold rounded-full w-[15px] h-[15px] flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative text-[#0a1f13]">
              <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={1.5} />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#e03b3b] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#0a1f13]">
              {isOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#f2f8f2] shadow-xl border-t border-[#0a1f13]/10">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base ${isActive ? 'font-bold text-[#1a3a28] bg-[#1a3a28]/5' : 'font-medium text-[#0a1f13] hover:bg-[#0a1f13]/5'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              );
            })}
            
            <div className="mt-6 pt-6 border-t border-[#0a1f13]/10">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-[#0a1f13] font-medium flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Hi, {user?.name?.split(' ')[0]}
                  </div>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-[#0a1f13] hover:bg-[#0a1f13]/5"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-[#0a1f13] hover:bg-[#0a1f13]/5"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#e03b3b] hover:bg-[#e03b3b]/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-lg text-center text-base font-medium text-[#0a1f13] border border-[#0a1f13]/20 hover:bg-[#0a1f13]/5"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-lg text-center text-base font-medium text-white bg-[#0a1f13] hover:bg-[#0a1f13]/80"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
