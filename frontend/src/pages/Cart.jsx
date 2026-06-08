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
        message += `• ${item.name} ${item.weight && item.weight !== 'null' ? `(${item.weight})` : ''} x${item.quantity} = ₹${item.price * item.quantity}\n`;
      });
      message += `\nTotal Amount: ₹${totalPrice}\n\nPlease confirm availability and delivery details.\nThank you!`;

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

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-[#2D6A2D] mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product?._id || item.product} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate pr-2">{item.name} x{item.quantity}</span>
                  <span className="whitespace-nowrap">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 mb-4" />
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Total Items:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-800 font-bold text-lg">Total Amount:</span>
              <span className="text-[#8B1A1A] font-bold text-xl">₹{totalPrice}</span>
            </div>

            <div className={`text-sm mb-6 p-3 rounded-lg flex gap-2 items-start ${totalPrice >= 500 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
              <span className="text-lg">🚚</span>
              <p>Free delivery for orders above ₹500</p>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              disabled={isOrdering}
              className="w-full bg-[#25D366] text-white py-3 rounded-xl font-medium flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-75"
            >
              {isOrdering ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Order via WhatsApp
            </button>

            <button
              onClick={handleClearCart}
              className="w-full mt-3 border border-red-500 text-red-500 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
