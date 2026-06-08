import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, Leaf, ShieldCheck, Heart, 
  ShoppingCart, MessageCircle, Info, Loader2,
  ThumbsUp, User
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
    // We pass the quantity directly to the updated addItem function in the cartStore
    await addItem(product, quantity);
    setIsAdding(false);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stock === 0;

  // Mock Nutrition Data for Transparency
  const nutritionStats = [
    { label: "Protein", value: 85, color: "bg-[#2D5A40]" },
    { label: "Dietary Fiber", value: 92, color: "bg-[#427A5B]" },
    { label: "Iron & Minerals", value: 78, color: "bg-[#6A9A7E]" },
    { label: "Added Sugar", value: 0, color: "bg-gray-300" }
  ];

  const mockReviews = [
    { name: "Lakshmi M.", rating: 5, date: "2 days ago", comment: "Absolutely love the authentic taste. Reminds me of my grandmother's preparation. Very fresh!" },
    { name: "Karthik R.", rating: 5, date: "1 week ago", comment: "The quality is unmatched. I've tried many organic brands, but Thaaragai Naturals feels genuinely pure." }
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF5] pb-24">
      {/* Breadcrumb / Back */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#1a3a28] transition-colors font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: IMAGE SECTION (Sticky) */}
        <div className="lg:sticky lg:top-[120px] h-max">
          <div className="bg-[#eaf2eb] rounded-[3rem] p-12 flex items-center justify-center relative shadow-inner overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a3a28]/5 to-transparent"></div>
            
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={heroImage} 
              alt={product.name} 
              className="w-full max-w-md object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-10"
            />

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              <span className="bg-white/90 backdrop-blur-sm text-[#1a3a28] font-bold px-4 py-1.5 rounded-full text-sm shadow-sm flex items-center gap-2">
                <Leaf size={14} className="text-[#2D5A40]" /> 100% Natural
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        <div className="flex flex-col">
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-[#EACD38]">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>
            <span className="text-gray-500 text-sm font-medium">(24 reviews)</span>
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
                <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1 w-full sm:w-auto">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center font-bold text-lg text-[#1a3a28]">-</button>
                  <span className="w-12 text-center font-bold text-[#1a3a28]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center font-bold text-lg text-[#1a3a28]">+</button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`flex-grow px-8 py-4 rounded-full font-bold shadow-lg transition-colors flex items-center justify-center gap-2 text-lg w-full sm:w-auto ${
                    added ? 'bg-[#25D366] text-white' : 'bg-[#1a3a28] text-white hover:bg-[#2D5A40]'
                  } ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : added ? <ShieldCheck className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {added ? 'Added to Cart' : 'Add to Cart'}
                </button>

                <a
                  href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I'd like to order ${quantity}x ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white p-4 rounded-full font-bold shadow-lg hover:bg-green-600 transition-colors shrink-0"
                  title="Order via WhatsApp"
                >
                  <MessageCircle size={24} />
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
            <p className="text-gray-600 mb-8 leading-relaxed">
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
            <h3 className="text-2xl font-serif font-bold text-[#1a3a28] mb-6">Customer Reviews</h3>
            
            <div className="space-y-6">
              {mockReviews.map((review, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a3a28] text-sm">{review.name}</h4>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex text-[#EACD38]">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <ThumbsUp size={12} /> Helpful
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-4 border-2 border-gray-100 text-[#1a3a28] font-bold rounded-full hover:bg-gray-50 transition-colors">
              Write a Review
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
