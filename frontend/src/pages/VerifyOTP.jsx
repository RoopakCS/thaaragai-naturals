import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const otpString = otp.join('');
      const response = await axiosInstance.post('/api/auth/verify-otp', { email, otp: otpString });
      login(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setResending(true);

    try {
      const response = await axiosInstance.post('/api/auth/resend-otp', { email });
      setMessage(response.data.message || 'OTP resent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">Verify Your Email</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>
        </section>
      </div>

      <div className="relative z-20 max-w-md mx-auto w-full px-4 sm:px-6 -mt-20 sm:-mt-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl p-6 sm:p-10 border border-gray-100 text-center"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">6-Digit Code</label>
              <div className="flex justify-between gap-1.5 sm:gap-3 w-full max-w-[280px] sm:max-w-[340px] mx-auto px-1 sm:px-0">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => {
                      if (isNaN(e.target.value)) return;
                      const newOtp = [...otp];
                      newOtp[index] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.nextSibling && e.target.value) {
                        e.target.nextSibling.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
                        e.target.previousSibling.focus();
                      }
                    }}
                    className="w-full flex-1 max-w-[40px] h-12 sm:max-w-[56px] sm:h-16 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all text-[#1a3a28] font-bold text-2xl sm:text-3xl text-center bg-gray-50"
                  />
                ))}
              </div>
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

            {message && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[#2D6A2D] text-sm font-medium text-center bg-[#eaf2eb] py-2 rounded-lg"
              >
                {message}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-[#2D6A2D] text-white py-4 rounded-xl font-bold tracking-wider hover:bg-[#1a3a28] transition-colors flex justify-center items-center mt-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Verify Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-gray-500 font-medium text-sm">
              Didn't receive the code?{' '}
              <button 
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[#8B1A1A] font-bold hover:underline ml-1 disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
