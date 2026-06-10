import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { Leaf, Sparkles } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    wantsNewsletter: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        wantsNewsletter: formData.wantsNewsletter
      });
      if (response.data.requiresVerification) {
        navigate(`/verify?email=${encodeURIComponent(response.data.email)}`);
      } else {
        login(response.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/auth/google', {
        credential: tokenResponse.credential || tokenResponse.access_token
      });
      login(response.data.user);
      navigate('/');
    } catch (err) {
      setError('Google registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google registration failed.'),
  });

  return (
    <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          {/* Subtle Background Elements */}
          <div className="absolute -top-10 -right-10 md:top-10 md:right-10 opacity-[0.04] pointer-events-none">
            <Sparkles className="w-32 h-32 md:w-48 md:h-48 transform -rotate-12" />
          </div>
          <div className="absolute -bottom-10 -left-10 md:bottom-10 md:left-10 opacity-[0.03] pointer-events-none">
            <Leaf className="w-40 h-40 md:w-64 md:h-64 transform rotate-12" />
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Join Us</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Create an account to start your wellness journey.
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                id="name"
                type="text" 
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                id="email"
                type="email" 
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number <span className="text-gray-400 font-normal lowercase tracking-normal">(optional)</span></label>
              <input 
                id="phone"
                type="tel" 
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input 
                id="password"
                type="password" 
                name="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
              <input 
                id="confirmPassword"
                type="password" 
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-medium"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input 
                  id="wantsNewsletter" 
                  name="wantsNewsletter" 
                  type="checkbox" 
                  checked={formData.wantsNewsletter}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#2D6A2D] accent-[#2D6A2D]" 
                />
              </div>
              <label htmlFor="wantsNewsletter" className="ml-2 text-sm font-medium text-gray-600">
                I would like to receive emails about new products and offers.
              </label>
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
              className="w-full bg-[#2D6A2D] text-white py-4 rounded-xl font-bold tracking-wider hover:bg-[#1a3a28] transition-colors flex justify-center items-center mt-6 shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or register with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => googleLogin()}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-xl font-bold tracking-wider hover:bg-gray-50 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] transition-all duration-300 flex justify-center items-center shadow-sm relative"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8B1A1A] font-bold hover:underline ml-1">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
