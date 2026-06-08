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
      let message = `Hello Thaaragai Naturals! 🌿\n\nI'd like to place an order:\n\n`;
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#8B1A1A] mb-8">Your Cart 🛒</h1>
        <div className="text-[100px] mb-4">🛒</div>
        <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
        <Link 
          to="/products"
          className="bg-[#2D6A2D] text-white px-8 py-3 rounded-xl font-medium hover:bg-green-800 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-[#8B1A1A] mb-8">Your Cart 🛒</h1>
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
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.weight && item.weight !== 'null' && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                            {item.weight}
                          </span>
                        )}
                        <span className="text-[#8B1A1A] font-medium">₹{item.price} each</span>
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
              <Sparkles className="w-5 h-5 mr-2 text-[#EACD38]" /> Order Summary
            </h2>
            
            {/* WhatsApp Message Preview Bubble */}
            <div className="bg-[#e2f0e2] rounded-2xl rounded-tr-sm p-5 mb-6 shadow-sm border border-[#2D5A40]/10 relative">
              <div className="absolute right-[-6px] top-0 w-4 h-4 bg-[#e2f0e2] border-r border-t border-[#2D5A40]/10 transform rotate-45"></div>
              <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">Message Preview:</p>
              <div className="text-sm text-[#1a3a28] font-medium leading-relaxed whitespace-pre-wrap">
                Hello Thaaragai Naturals! 🌿<br/><br/>
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
  );
}
