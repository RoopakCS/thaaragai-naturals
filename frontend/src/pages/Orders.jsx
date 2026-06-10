import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/orders/my');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const handleReorder = (order) => {
    let message = `Hello Thaaragai Naturals!\n\nI'd like to place an order:\n\n`;
    order.items.forEach(item => {
      message += `• ${item.name} ${item.weight && item.weight !== 'null' ? `(${item.weight})` : ''} x${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    message += `\nTotal Amount: ₹${order.totalAmount}\n\nPlease confirm availability and delivery details.\nThank you!`;

    window.open(`https://wa.me/919952981365?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return <div className="min-h-dvh flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-[#FDFAF5] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">My Orders.</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Track and manage your Thaaragai Naturals orders.
            </p>
          </div>
        </section>
      </div>

      {/* 2. ORDERS LIST */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24 flex-grow flex flex-col">
        {orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-12 sm:p-20 border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 rounded-full p-8 mb-6 inline-block">
              <Package className="w-20 h-20 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here.</p>
            <Link 
              to="/products"
              className="bg-[#2D6A2D] text-white px-8 py-4 rounded-xl font-bold hover:bg-green-800 transition-colors inline-block min-h-[44px] shadow-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {orders.map((order) => {
              const statusConfig = {
                pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4 mr-1 inline" />, label: 'Pending' },
                confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-4 h-4 mr-1 inline" />, label: 'Confirmed' },
                delivered: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Truck className="w-4 h-4 mr-1 inline" />, label: 'Delivered' }
              };
              const currentStatus = statusConfig[order.status] || statusConfig.pending;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order._id}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                >
                  {/* TOP ROW */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div className="text-sm font-mono text-gray-500">
                      Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${currentStatus.bg} ${currentStatus.text}`}>
                      {currentStatus.icon} {currentStatus.label}
                    </div>
                  </div>

                  {/* MIDDLE ROW */}
                  <div className="mb-6 overflow-x-auto scrollbar-none w-full">
                    <ul className="space-y-2 min-w-max">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex text-sm text-gray-700 whitespace-nowrap">
                          <span className="mr-2">•</span>
                          <span>
                            {item.name} {item.weight && item.weight !== 'null' ? `(${item.weight})` : ''} x{item.quantity} 
                            <span className="text-gray-400 ml-2">₹{item.price * item.quantity}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-400 italic mt-2 ml-4">
                        + {order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* BOTTOM ROW */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-4">
                    <div className="text-sm text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-lg text-[#8B1A1A] font-bold">
                        Total: ₹{order.totalAmount}
                      </div>
                      <button
                        onClick={() => handleReorder(order)}
                        className="text-sm border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white px-4 py-2 rounded-xl font-bold transition-colors"
                      >
                        Reorder
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
