import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, Coffee, Stethoscope, Sparkles, Cookie, Package, Box, Droplets, Loader2 } from 'lucide-react';
import heroImage from '../assets/product-hero.webp';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

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

  // MOCK STOCK FOR DEMO (Replace with product.stock later)
  const stock = product.stock !== undefined ? product.stock : Math.floor(Math.random() * 15);
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

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
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 rounded-[2rem] overflow-hidden group cursor-pointer"
    >
       {/* Image/Icon Area */}
       <div className="relative h-32 sm:h-40 bg-[#FDFAF5] flex items-center justify-center p-3 sm:p-4 border-b border-gray-50 overflow-hidden">
         <img src={heroImage} alt={product.name} className="w-3/4 h-3/4 object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl" />
         
         {/* Badges absolute top */}
         <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isOutOfStock ? (
              <span className="bg-[#8B1A1A]/10 text-[#8B1A1A] text-xs font-bold px-3 py-1 rounded-full border border-[#8B1A1A]/20">Out of Stock</span>
            ) : isLowStock ? (
              <span className="bg-[#EACD38]/20 text-[#8a7617] text-xs font-bold px-3 py-1 rounded-full border border-[#EACD38]/30 animate-pulse">Low Stock</span>
            ) : null}
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
          
          <div className="mt-auto pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
             <span className="text-[#8B1A1A] font-bold text-base sm:text-lg">
               {product.price > 0 ? `₹${product.price}` : 'On request'}
             </span>
             
             {isOutOfStock ? (
                <a
                  href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I saw the ${product.name} is out of stock. When will the next fresh batch be available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-200 transition-colors w-full sm:w-auto text-center min-h-[44px] flex items-center justify-center"
                >
                  Inquire
                </a>
             ) : product.price > 0 ? (
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
                  className="bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1fa952] transition-colors w-full sm:w-auto text-center"
                >
                  WhatsApp
                </a>
             )}
          </div>
       </div>
    </div>
  );
}
