import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, Coffee, Stethoscope, Sparkles, Cookie, Package, Box, Droplets, Loader2, Leaf, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import NutritionPanel from './NutritionPanel';
import { motion, AnimatePresence } from 'framer-motion';

const categoryIcons = {
  'flours': Wheat,
  'beverages': Coffee,
  'health-mixes': Stethoscope,
  'podis': Sparkles,
  'laddus': Cookie,
  'snacks': Package,
  'pickles': Box,
  'personal-care': Droplets
};

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  const hasLabData = product.labTested || product.fssaiCompliant || product.nablAccredited || product.nutritionPer100g;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate('/login');
      return;
    }

    setIsAdding(true);
    await addItem(product);
    setIsAdding(false);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  
  return (
    <>
      <div 
        onClick={() => navigate(`/product/${product._id}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/product/${product._id}`);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${product.name}`}
        className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-[2rem] overflow-hidden group cursor-pointer"
      >
         {/* Image/Icon Area */}
         <div className="relative h-48 sm:h-56 bg-white flex items-center justify-center p-4 sm:p-6 border-b border-gray-50 overflow-hidden">
           {product.image ? (
             <img src={product.image} alt={product.name} className="w-[85%] h-[85%] sm:w-[80%] sm:h-[80%] object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl" />
           ) : (
             (() => {
               const Icon = categoryIcons[product.category] || Package;
               return <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-[#2D5A40] opacity-40 transition-transform duration-700 group-hover:scale-110" />;
             })()
           )}
           
           {/* Badges absolute top */}
           <div className="absolute top-4 left-4 flex flex-col gap-2">
           </div>
         </div>

         {/* Content Area */}
         <div className="p-3 sm:p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2 gap-2">
               <h3 className="font-serif font-bold text-[#1a3a28] text-sm leading-tight overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                 {product.name}
               </h3>
               {product.weight && product.weight !== 'null' && (
                 <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-md flex-shrink-0">{product.weight}</span>
               )}
            </div>
            
            {hasLabData && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNutrition(true); }}
                className="mt-1 mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2D6A2D] border border-[#2D6A2D]/30 rounded-md hover:bg-[#2D6A2D]/5 transition-colors w-fit z-10 relative"
              >
                <Leaf size={12} />
                Nutrition Facts
              </button>
            )}

            <div className="mt-auto pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
               <span className="text-[#1a3a28] font-bold text-base sm:text-lg">
                 {product.price > 0 ? `₹${product.price}` : 'On request'}
               </span>
               
               {product.price > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-colors flex items-center justify-center w-full sm:w-auto min-h-[44px] ${
                      added ? 'bg-[#25D366] text-white' : 'bg-[#1a3a28] text-white hover:bg-[#2D5A40]'
                    } ${isAdding ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {added ? '✓ Added' : 'Add to Cart'}
                  </button>
               ) : (
                  <a
                    href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1fa952] transition-colors w-full sm:w-auto text-center"
                  >
                    WhatsApp
                  </a>
               )}
            </div>
         </div>
      </div>

      <AnimatePresence>
        {showNutrition && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 bg-black/40 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); setShowNutrition(false); }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setShowNutrition(false); }}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-1.5 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-600" />
              </button>
              <NutritionPanel 
                nutritionPer100g={product.nutritionPer100g}
                labTested={product.labTested}
                fssaiCompliant={product.fssaiCompliant}
                nablAccredited={product.nablAccredited}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
