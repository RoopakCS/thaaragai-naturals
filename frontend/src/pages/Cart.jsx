import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { Wheat, Coffee, Stethoscope, Sparkles, Cookie, Package, Box, Droplets, Trash2, Loader2, Minus, Plus, MapPin, X, Truck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

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
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [updatingId, setUpdatingId] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    if (location.state?.openCheckout) {
      if (isAuthenticated) {
        setIsCheckoutModalOpen(true);
        // Clear the state so refresh doesn't reopen it
        navigate(location.pathname, { replace: true });
      } else {
        toast.error("Please login to proceed to checkout.");
        navigate('/login');
      }
    }
  }, [location.state, isAuthenticated, navigate, location.pathname]);
  
  useEffect(() => {
    if (items.length === 0 && suggestedProducts.length === 0) {
      const fetchSuggested = async () => {
        try {
          const res = await axiosInstance.get('/api/products');
          const inStock = res.data.filter(p => p.inStock);
          setSuggestedProducts(inStock.slice(0, 4));
        } catch(e) {
          console.error(e);
        }
      }
      fetchSuggested();
    }
  }, [items.length, suggestedProducts.length]);
  
  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (user) {
      // If user has an address object (from Profile), we can format it nicely
      let formattedAddress = '';
      if (user.address && typeof user.address === 'object') {
        const { street, city, state, zipCode } = user.address;
        formattedAddress = [street, city, state, zipCode].filter(Boolean).join(', ');
      } else if (user.address && typeof user.address === 'string') {
        formattedAddress = user.address;
      }

      setCheckoutForm({
        name: user.name || '',
        phone: user.phone || '',
        address: formattedAddress
      });
    }
  }, [user, isCheckoutModalOpen]);

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

  const handleClearCart = () => {
    setIsConfirmClearOpen(true);
  };

  const confirmClearCart = async () => {
    setIsClearing(true);
    await clearCart();
    setIsClearing(false);
    setIsConfirmClearOpen(false);
    toast.success("Cart cleared");
  };

  const openCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout.");
      navigate('/login');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
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
        totalAmount: totalPrice,
        shippingAddress: checkoutForm.address,
        phone: checkoutForm.phone
      };

      const res = await axiosInstance.post('/api/orders', orderPayload);
      const orderNumber = res.data.orderNumber || res.data._id.slice(-6).toUpperCase();

      // 2. Build WhatsApp message
      let message = `*NEW ORDER: #${orderNumber}*\n\nHello Thaaragai Naturals! I'd like to place an order:\n\n`;
      items.forEach(item => {
        message += `• ${item.name} ${item.weight && item.weight !== 'null' ? `(${item.weight})` : ''} x${item.quantity}\n`;
      });
      message += `\n*Subtotal: ₹${totalPrice}*\n`;
      message += `\n*Delivery Details:*\nName: ${checkoutForm.name}\nPhone: ${checkoutForm.phone}\nAddress: ${checkoutForm.address}\n\n`;
      message += `Please let me know the total including shipping. Thank you!`;

      // 3. Cleanup and redirect
      await clearCart();
      setIsCheckoutModalOpen(false);
      window.open(`https://wa.me/919952981365?text=${encodeURIComponent(message)}`, '_blank');
      navigate('/orders');
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
        {/* HERO SECTION */}
        <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
          <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Your Cart.</h2>
              <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
                Review your selected items before proceeding.
              </p>
            </div>
          </section>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24 text-center">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-12 sm:p-20 border border-gray-100 flex flex-col items-center justify-center mb-12">
            <div className="bg-gray-50 rounded-full p-8 mb-6 inline-block">
              <Package className="w-20 h-20 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your items here.</p>
            <Link 
              to="/products"
              className="bg-[#2D6A2D] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1a3a28] transition-colors inline-block shadow-lg"
            >
              Browse Products
            </Link>
          </div>

          {/* Suggested Products Section */}
          {suggestedProducts.length > 0 && (
            <div className="text-left mt-16">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a3a28] mb-8">Popular Right Now</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-left">
                {suggestedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
      {/* HERO SECTION */}
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
                  className="bg-white rounded-[1.5rem] shadow-sm p-4 sm:p-5 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative hover:shadow-md transition-shadow"
                >
                  {isUpdating && (
                    <div className="absolute inset-0 bg-white backdrop-blur-[1px] flex items-center justify-center z-10 rounded-[1.5rem]">
                      <Loader2 className="w-6 h-6 text-[#2D6A2D] animate-spin" />
                    </div>
                  )}
                  
                  <div className="flex items-center w-full sm:w-auto flex-grow gap-4">
                    <div className="bg-[#f0f7f0] p-4 rounded-[1rem] flex-shrink-0 border border-[#2D6A2D]/10">
                      <Icon className="w-6 h-6 text-[#2D6A2D]" />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-bold text-[#1a3a28] text-sm sm:text-base">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {item.weight && item.weight !== 'null' && (
                          <span className="bg-[#f0f7f0] text-[#2D6A2D] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#2D6A2D]/20">
                            {item.weight}
                          </span>
                        )}
                        <span className="text-gray-500 font-medium text-xs sm:text-sm">₹{item.price} each</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4 sm:gap-6 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                    <div className="flex items-center flex-col sm:items-end w-24">
                      <span className="text-[#8B1A1A] font-bold text-lg">₹{item.price * item.quantity}</span>
                    </div>

                    <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-10">
                      <button 
                        onClick={() => handleUpdateQuantity(productId, item.quantity, -1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-200 "
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-[#1a3a28] text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(productId, item.quantity, 1)}
                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-200 "
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemove(productId)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ml-auto sm:ml-0"
                      title="Remove item"
                      aria-label="Remove item"
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
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 lg:p-8 lg:sticky lg:top-[120px]">
              <h2 className="text-2xl font-serif font-bold text-[#1a3a28] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-[#1a3a28] ">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 font-medium pb-4 border-b border-gray-100">
                  <span>Shipping</span>
                  <span className="text-[#e0893b] font-bold text-sm">Calculated later</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[#1a3a28] font-bold text-lg">Total</span>
                  <span className="text-3xl font-serif font-bold text-[#8B1A1A]">₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full bg-[#1a3a28] text-white py-4 rounded-xl font-bold tracking-wide flex items-center justify-center hover:bg-[#2D6A2D] shadow-md transition-all mb-4 group"
              >
                Proceed to Checkout
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={handleClearCart}
                className="w-full text-gray-500 text-sm font-bold tracking-wide py-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200 "
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a3a28]/60 backdrop-blur-sm"
              onClick={() => setIsCheckoutModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-xl relative z-10 max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-[#eaf2eb] p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2D6A2D]/10 p-2.5 rounded-xl">
                    <Truck className="w-6 h-6 text-[#2D6A2D]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#1a3a28] ">Delivery Details</h2>
                    <p className="text-xs text-gray-500 font-medium">Please confirm where we should send your order.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 " />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
                <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-1">
                      <label htmlFor="checkout-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                      <input 
                        id="checkout-name"
                        type="text" required
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none text-[#1a3a28] font-medium"
                      />
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="checkout-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number *</label>
                      <input 
                        id="checkout-phone"
                        type="tel" required
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none text-[#1a3a28] font-medium"
                        placeholder="WhatsApp number"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="checkout-address" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Complete Shipping Address *</label>
                      <textarea 
                        id="checkout-address"
                        required rows="3"
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none text-[#1a3a28] font-medium resize-none"
                        placeholder="House/Flat No., Street, Area, City, State, Pincode"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Info Box */}
                  <div className="bg-[#eaf1f5] border border-[#2b5a7a]/20 p-4 rounded-xl mt-6 flex gap-3">
                    <Info className="w-5 h-5 text-[#2b5a7a] mt-0.5 shrink-0" />
                    <p className="text-[#2b5a7a] text-sm font-medium leading-relaxed">
                      By proceeding, you will be redirected to WhatsApp to confirm your final order details and shipping costs with our team.
                    </p>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 flex-shrink-0">
                <div className="text-left w-full sm:w-auto">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Amount</span>
                  <span className="text-2xl font-bold text-[#8B1A1A]">₹{totalPrice}</span>
                </div>
                
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isOrdering}
                  className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-[#1fa952] shadow-md transition-all disabled:opacity-75"
                >
                  {isOrdering ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  )}
                  Confirm & WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM CLEAR MODAL */}
      <AnimatePresence>
        {isConfirmClearOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a3a28]/60 backdrop-blur-sm"
              onClick={() => setIsConfirmClearOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 flex flex-col overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-[#1a3a28] mb-2">Clear Cart?</h2>
                <p className="text-gray-500 font-medium text-sm">Are you sure you want to remove all items from your cart?</p>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => setIsConfirmClearOpen(false)}
                  disabled={isClearing}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmClearCart}
                  disabled={isClearing}
                  className="flex-1 bg-[#8B1A1A] text-white px-4 py-3 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-md disabled:opacity-75 flex justify-center items-center"
                >
                  {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Clear Cart'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
