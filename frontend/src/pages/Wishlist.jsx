import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { items, fetchWishlist, loading } = useWishlistStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
      {/* HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">My Wishlist.</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Your favorite items, saved for later.
            </p>
          </div>
        </section>
      </div>

      {/* OVERLAPPING CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24">
        {loading ? (
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-12 sm:p-20 border border-gray-100 flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#2D6A2D] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center shadow-xl border border-gray-100 flex flex-col items-center justify-center max-w-3xl mx-auto"
          >
            <div className="bg-red-50 rounded-full p-8 mb-6 inline-block">
              <Heart className="w-16 h-16 text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Start exploring our healthy products and save your favorites here.
            </p>
            <Link 
              to="/products"
              className="bg-[#2D6A2D] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a3a28] transition-colors flex items-center justify-center gap-2 group shadow-lg inline-flex"
            >
              Explore Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {items.map(product => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
