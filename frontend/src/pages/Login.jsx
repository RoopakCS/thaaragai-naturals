import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { Leaf, Heart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FDFAF5] min-h-[calc(100vh-88px)] font-sans flex flex-col pb-24">
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute -top-10 -left-10 md:top-10 md:left-10 opacity-[0.03] pointer-events-none">
            <Leaf className="w-32 h-32 md:w-48 md:h-48 transform -rotate-12" />
          </div>
          <div className="absolute -bottom-10 -right-10 md:bottom-10 md:right-10 opacity-[0.03] pointer-events-none">
            <Heart className="w-40 h-40 md:w-64 md:h-64 transform rotate-12" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Welcome Back.</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Log in to manage your orders and profile.
            </p>
          </div>
        </section>
      </div>

      {/* 2. FLOATING FORM CARD */}
      <div className="relative z-20 max-w-md mx-auto w-full px-4 sm:px-6 -mt-20 sm:-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-10 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                id="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                id="password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2D6A2D] text-white py-4 rounded-xl font-bold tracking-wider hover:bg-[#1a3a28] transition-colors flex justify-center items-center mt-4 shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#8B1A1A] font-bold hover:underline ml-1">
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
