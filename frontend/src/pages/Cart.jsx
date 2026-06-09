import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { Wheat, Coffee, Stethoscope, Sparkles, Cookie, Package, Box, Droplets, Trash2, Loader2, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    setUpdatingId(productId);
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      await removeItem(productId);
    } else {
      await updateQuantity(productId, newQty);
    }
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeItem(productId);
    setUpdatingId(null);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCart();
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }

    if (items.length === 0) return;

    setIsOrdering(true);
    try {
      // 1. POST to /api/orders
      const orderPayload = {
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight
        })),
        totalAmount: totalPrice
      };

      await axiosInstance.post('/api/orders', orderPayload);

      // 2. Build WhatsApp message
      let message = `Hello Thaaragai Naturals!\n\nI'd like to place an order:\n\n`;
      items.forEach(item => {
        message += `• ${item.name} ${item.weight && item.weight !== 'null' ? `(${item.weight})` : ''} x${item.quantity}\n`;
      });
      message += `\nSubtotal: ₹${totalPrice}\n\nPlease let me know the total including shipping to my location.`;

      // 3. Show success toast and open WhatsApp
      alert("Order logged! Redirecting to WhatsApp...");
      
      await clearCart(); // UI should reflect cleared cart
      
      window.open(`https://wa.me/919952981365?text=${encodeURIComponent(message)}`, '_blank');
      navigate('/');
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FDFAF5] min-h-[calc(100vh-88px)] font-sans flex flex-col pb-24">
        {/* 1. HERO SECTION */}
        <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
          <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Your Cart.</h1>
              <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                Review your selected items before proceeding.
              </p>
            </div>
          </section>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24 text-center">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-12 sm:p-20 border border-gray-100 flex flex-col items-center justify-center">
            <div className="bg-gray-50 rounded-full p-8 mb-6 inline-block">
              <Package className="w-20 h-20 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your items here.</p>
            <Link 
              to="/products"
              className="bg-[#2D6A2D] text-white px-8 py-4 rounded-xl font-bold hover:bg-green-800 transition-colors inline-block min-h-[44px] shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFAF5] min-h-[calc(100vh-88px)] font-sans flex flex-col pb-24">
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Your Cart.</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Review your selected items before proceeding to checkout.
            </p>
          </div>
        </section>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
            {items.map((item) => {
              const category = item.product?.category || 'default';
              const Icon = categoryIcons[category] || Package;
              const productId = item.product?._id || item.product;
              const isUpdating = updatingId === productId;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  key={productId} 
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative"
                >
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
                      <Loader2 className="w-6 h-6 text-[#2D6A2D] animate-spin" />
                    </div>
                  )}
                  
                  <div className="flex items-center w-full sm:w-auto flex-grow gap-4">
                    <div className="bg-[#f0f7f0] p-3 rounded-lg flex-shrink-0">
                      <Icon className="w-8 h-8 text-[#2D6A2D]" />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {item.weight && item.weight !== 'null' && (
                          <span className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs px-2 py-0.5 rounded-full">
                            {item.weight}
                          </span>
                        )}
                        <span className="text-[#8B1A1A] font-medium text-sm sm:text-base">₹{item.price} each</span>
                        {item.quantity > 1 && (
                          <span className="text-gray-600 font-medium text-sm sm:text-base border-l border-gray-300 pl-2">
                            Total: ₹{item.price * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => handleUpdateQuantity(productId, item.quantity, -1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg text-gray-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(productId, item.quantity, 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemove(productId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Order Summary & WhatsApp Preview */}
        <div className="lg:col-span-1">
          <div className="bg-[#f2f8f2] border border-[#2D5A40]/20 rounded-2xl p-6 lg:sticky lg:top-24 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-[#1a3a28] mb-6 flex items-center">
              Order Summary
            </h2>
            
            {/* WhatsApp Message Preview Bubble */}
            <div className="bg-[#e2f0e2] rounded-2xl rounded-tr-sm p-5 mb-6 shadow-sm border border-[#2D5A40]/10 relative">
              <div className="absolute right-[-6px] top-0 w-4 h-4 bg-[#e2f0e2] border-r border-t border-[#2D5A40]/10 transform rotate-45"></div>
              <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">Message Preview:</p>
              <div className="text-sm text-[#1a3a28] font-medium leading-relaxed whitespace-pre-wrap">
                Hello Thaaragai Naturals!<br/><br/>
                I'd like to place an order:<br/>
                {items.map(item => (
                  <span key={item.product?._id || item.product}>
                    • {item.name} {item.weight && item.weight !== 'null' ? `(${item.weight})` : ''} x{item.quantity}<br/>
                  </span>
                ))}
                <br/>
                Subtotal: ₹{totalPrice}<br/>
                <br/>
                Please let me know the total including shipping to my location.
              </div>
            </div>
            
            <hr className="border-[#2D5A40]/10 mb-6" />
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#3c2f27] font-medium">Subtotal ({totalItems} items):</span>
              <span className="font-bold text-[#1a3a28] text-xl">₹{totalPrice}</span>
            </div>
            
            {/* The Honesty Box for Shipping */}
            <div className="bg-white/60 border border-[#2D5A40]/10 text-sm mb-6 p-4 rounded-xl flex gap-3 items-start shadow-sm mt-4">
              <Package className="w-5 h-5 text-[#8B1A1A] flex-shrink-0 mt-0.5" />
              <p className="text-[#4a392f] leading-snug">
                <span className="font-semibold block mb-1">Shipping & Delivery</span>
                Calculated and confirmed with you directly on WhatsApp based on your exact location.
              </p>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              disabled={isOrdering}
              className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center hover:bg-[#1fa952] shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-75 disabled:hover:translate-y-0"
            >
              {isOrdering ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Send to WhatsApp
            </button>

            <button
              onClick={handleClearCart}
              className="w-full mt-4 text-[#8B1A1A] text-sm font-bold uppercase tracking-wider py-3 hover:bg-red-50 rounded-xl transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
