import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Leaf, ShieldCheck, Heart, 
  ShoppingCart, MessageCircle, Info, Loader2,
  User, Send, X
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import heroImage from '../assets/product-hero.webp';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const addItem = useCartStore(state => state.addItem);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col justify-center items-center text-[#2D5A40]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-bold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-serif text-[#1a3a28] font-bold">Product not found.</h2>
        <button onClick={() => navigate('/products')} className="mt-6 bg-[#2D5A40] text-white px-6 py-2 rounded-full font-bold">
          Back to Catalog
        </button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate('/login');
      return;
    }

    setIsAdding(true);
    await addItem(product, quantity);
    setIsAdding(false);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleOpenReview = () => {
    if (!isAuthenticated) {
      alert("Please login to write a review");
      navigate('/login');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    
    setSubmittingReview(true);
    try {
      const res = await axiosInstance.post(`/api/products/${id}/reviews`, reviewForm);
      // Update local product state with new reviews
      setProduct({
        ...product,
        reviews: res.data.reviews,
        numReviews: res.data.reviews.length,
        averageRating: res.data.reviews.reduce((acc, item) => item.rating + acc, 0) / res.data.reviews.length
      });
      setIsReviewModalOpen(false);
      setReviewForm({ rating: 5, comment: '' });
      alert("Review added successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const isOutOfStock = product.inStock === false;

  const nutritionStats = [
    { label: "Protein", value: 85, color: "bg-[#2D5A40]" },
    { label: "Dietary Fiber", value: 92, color: "bg-[#427A5B]" },
    { label: "Iron & Minerals", value: 78, color: "bg-[#6A9A7E]" },
    { label: "Added Sugar", value: 0, color: "bg-gray-300" }
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF5] pb-24 font-sans relative">
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-6 sm:py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#1a3a28] transition-colors font-medium text-sm sm:text-base group w-fit"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: IMAGE SECTION (Sticky) */}
        <div className="lg:sticky lg:top-[120px] h-max">
          <div className="bg-[#eaf2eb] rounded-[3rem] p-12 flex items-center justify-center relative shadow-inner overflow-hidden group min-h-[400px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a3a28]/5 to-transparent"></div>
            
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={product.image || heroImage} 
              alt={product.name} 
              className="w-full max-w-md object-contain drop-shadow-2xl relative z-10 rounded-2xl"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="flex flex-col">
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-[#EACD38]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} size={18} 
                  fill={star <= (product.averageRating || 0) ? "currentColor" : "none"} 
                  stroke={star <= (product.averageRating || 0) ? "currentColor" : "#CBD5E1"} 
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm font-medium">({product.numReviews || 0} reviews)</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3a28] leading-tight mb-2">
            {product.name}
          </h1>
          
          <p className="text-[#2D5A40] font-medium text-lg mb-6 flex items-center gap-2">
            Category: <span className="capitalize">{product.category.replace('-', ' ')}</span>
            {product.weight && product.weight !== 'null' && (
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm ml-2">{product.weight}</span>
            )}
          </p>

          <h2 className="text-3xl font-bold text-[#8B1A1A] mb-8">
            {product.price > 0 ? `₹${product.price}` : 'Price on request'}
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {product.description || "A deeply nourishing, traditional preparation made with ethically sourced natural ingredients. Handcrafted to bring ancient Tamil wisdom straight to your kitchen."}
          </p>

          {/* ADD TO CART / BUY SECTION */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-12">
            {isOutOfStock ? (
              <div className="text-center">
                <p className="text-[#8B1A1A] font-bold mb-4">Currently Out of Stock</p>
                <a
                  href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name}. When will it be available again?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-bold shadow-sm hover:bg-gray-200 transition-colors w-full flex items-center justify-center gap-2 text-lg"
                >
                  <MessageCircle size={20} /> Inquire Availability
                </a>
              </div>
            ) : product.price > 0 ? (
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Quantity */}
                <div className="flex items-center justify-center bg-gray-50 rounded-full border border-gray-200 p-1 w-full sm:w-auto shrink-0">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center font-bold text-lg text-[#1a3a28] transition-colors">-</button>
                  <span className="w-12 text-center font-bold text-[#1a3a28]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center font-bold text-lg text-[#1a3a28] transition-colors">+</button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-grow px-8 py-4 rounded-full font-bold shadow-lg transition-colors flex items-center justify-center gap-2 text-lg w-full sm:w-auto ${
                    added ? 'bg-[#25D366] text-white' : 'bg-[#1a3a28] text-white hover:bg-[#2D6A2D]'
                  } ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : added ? <ShieldCheck className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>

                <a
                  href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I'd like to order ${quantity}x ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white p-4 rounded-full font-bold shadow-lg hover:bg-green-600 transition-colors shrink-0 w-full sm:w-auto flex items-center justify-center"
                  title="Order via WhatsApp"
                >
                  <MessageCircle size={24} className="mr-2 sm:mr-0" />
                  <span className="sm:hidden font-bold">Buy via WhatsApp</span>
                </a>
              </div>
            ) : (
              <a
                href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I would like to know the price of ${product.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a3a28] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#2D5A40] transition-colors w-full flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle size={20} /> Request Pricing
              </a>
            )}
          </div>

          {/* TRANSPARENCY & NUTRITION SECTION */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-[#1a3a28] mb-6 flex items-center gap-2">
              <Info className="text-[#2D5A40]" /> Complete Transparency
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed font-medium">
              We believe you deserve to know exactly what goes into your body. This product is strictly free from refined sugars, artificial preservatives, and synthetic colors.
            </p>

            {/* Health Chart */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h4 className="font-bold text-[#1a3a28] mb-6">Health Impact Profile</h4>
              
              <div className="space-y-5">
                {nutritionStats.map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-gray-700">{stat.label}</span>
                      <span className={stat.value > 0 ? "text-[#1a3a28] font-bold" : "text-gray-400"}>
                        {stat.value > 0 ? `${stat.value}%` : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                        className={`h-2.5 rounded-full ${stat.color}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                <span className="bg-[#eaf2eb] text-[#2D5A40] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Heart size={16} /> Gut Friendly
                </span>
                <span className="bg-[#eaf2eb] text-[#2D5A40] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <ShieldCheck size={16} /> Immunity Booster
                </span>
              </div>
            </div>
          </div>

          {/* REVIEWS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-serif font-bold text-[#1a3a28]">Customer Reviews</h3>
            </div>
            
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                <div className="text-gray-300 flex justify-center mb-4"><Star size={40} /></div>
                <p className="text-gray-500 font-medium mb-4">No reviews yet. Be the first to review this product!</p>
                <button 
                  onClick={handleOpenReview}
                  className="bg-[#eaf2eb] text-[#2D5A40] px-6 py-2.5 rounded-full font-bold hover:bg-[#d8e8da] transition-colors inline-block"
                >
                  Write a Review
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review, idx) => (
                  <div key={idx} className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1a3a28] flex items-center justify-center text-white font-bold text-lg">
                          {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1a3a28]">{review.userName || 'Anonymous'}</h4>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-[#EACD38] bg-gray-50 px-3 py-1.5 rounded-full">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={14} fill={star <= review.rating ? "currentColor" : "none"} stroke={star <= review.rating ? "currentColor" : "#CBD5E1"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed font-medium mt-4">"{review.comment}"</p>
                  </div>
                ))}
                
                {isAuthenticated ? (
                  <button 
                    onClick={handleOpenReview}
                    className="w-full py-4 border-2 border-gray-100 text-[#1a3a28] font-bold rounded-full hover:bg-gray-50 transition-colors mt-6"
                  >
                    Write a Review
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-full hover:bg-gray-50 transition-colors mt-6"
                  >
                    Log in to Write a Review
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a3a28]/60 backdrop-blur-sm"
              onClick={() => setIsReviewModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-lg w-full relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-[#1a3a28]">Write a Review</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          size={32} 
                          fill={star <= reviewForm.rating ? "#EACD38" : "none"} 
                          stroke={star <= reviewForm.rating ? "#EACD38" : "#CBD5E1"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="review-comment" className="block text-sm font-bold text-gray-700 mb-2">Your Feedback</label>
                  <textarea
                    id="review-comment"
                    required
                    rows="4"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium resize-none"
                    placeholder="What did you like about the product?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-[#1a3a28] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2D6A2D] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-75"
                >
                  {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Submit Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
