import { useCartStore } from '../store/cartStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function StickyCartBar() {
  const { totalItems, totalPrice } = useCartStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show on admin page, or login/register pages.
  if (
    totalItems === 0 || 
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[90] pointer-events-none animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="max-w-md mx-auto pointer-events-auto bg-white rounded-[1.5rem] shadow-2xl p-4 flex items-center justify-between border border-gray-100 ring-1 ring-black/5">
        <div className="flex items-center gap-4">
          <div className="relative bg-[#eaf2eb] p-3 rounded-2xl">
            <ShoppingBag size={24} className="text-[#1a3a28]" />
            <span className="absolute -top-2 -right-2 bg-[#EACD38] text-[#1a3a28] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
            </span>
            <span className="text-lg font-bold text-[#1a3a28] tracking-wide">
              ₹{totalPrice}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/cart', { state: { openCheckout: true } })}
          className="flex items-center gap-1 bg-[#1a3a28] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#2D5A40] transition-all duration-300 active:scale-95 shadow-md"
        >
          Checkout <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
