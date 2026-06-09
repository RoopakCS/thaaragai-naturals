import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Package, ShoppingBag, Users, Menu, X, ArrowLeft, Loader2, IndianRupee, Plus, Search, ChevronDown, Edit2, Trash2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Offerings' },
  { id: 'flours', label: 'Millet Flours' },
  { id: 'beverages', label: 'Herbal Drinks' },
  { id: 'health-mixes', label: 'Health Mixes' },
  { id: 'podis', label: 'Traditional Podis' },
  { id: 'laddus', label: 'Millet Laddus' },
  { id: 'snacks', label: 'Natural Snacks' },
  { id: 'pickles', label: 'Homemade Pickles' },
  { id: 'personal-care', label: 'Personal Care' }
];

export default function Admin() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [stats, setStats] = useState({ totalOrders: 0, totalUsers: 0, totalProducts: 0, pendingOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Products Table Filtering & Sorting
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState('default');
  const [productCategory, setProductCategory] = useState('All');

  // Add/Edit Product Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means adding new
  const [formData, setFormData] = useState({
    name: '',
    category: 'flours',
    price: '',
    weight: '',
    description: '',
    image: '',
    inStock: true
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'dashboard') {
          const res = await axiosInstance.get('/api/admin/stats');
          setStats(res.data);
        } else if (activeTab === 'orders') {
          const res = await axiosInstance.get('/api/admin/orders');
          setOrders(res.data);
        } else if (activeTab === 'products') {
          const res = await axiosInstance.get('/api/products');
          setProducts(res.data);
        } else if (activeTab === 'users') {
          const res = await axiosInstance.get('/api/admin/users');
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, user?.role]);

  // Derived state for products table
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (productCategory !== 'All') {
      result = result.filter(p => p.category === productCategory);
    }
    if (productSearch) {
      result = result.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    }
    if (productSort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (productSort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (productSort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, productSearch, productCategory, productSort]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/admin/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleStockToggle = async (id, currentStock) => {
    try {
      const newStock = !currentStock;
      await axiosInstance.put(`/api/admin/products/${id}/stock`, { inStock: newStock });
      setProducts(products.map(p => p._id === id ? { ...p, inStock: newStock } : p));
    } catch (err) {
      console.error(err);
      alert('Failed to update stock');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'flours', price: '', weight: '', description: '', image: '', inStock: true });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({ 
      name: product.name, 
      category: product.category, 
      price: product.price, 
      weight: product.weight || '', 
      description: product.description || '', 
      image: product.image || '', 
      inStock: product.inStock 
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, price: Number(formData.price) };
      if (editingId) {
        const res = await axiosInstance.put(`/api/admin/products/${editingId}`, payload);
        setProducts(products.map(p => p._id === editingId ? res.data : p));
      } else {
        const res = await axiosInstance.post('/api/admin/products', payload);
        setProducts([res.data, ...products]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-[#FDFAF5] flex items-center justify-center p-4 font-sans pb-24">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-serif font-bold text-[#1a3a28] mb-3">Access Denied</h1>
          <p className="text-gray-500 mb-8 font-medium">You need admin privileges to access this control panel.</p>
          <Link to="/" className="bg-[#2D6A2D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3a28] transition-colors inline-flex shadow-sm">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'users', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans flex flex-col md:flex-row pb-24 md:pb-0 relative">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 px-2 sm:px-3 pt-2 pb-4 bg-[#FDFAF5] ">
        <div className="bg-[#1a3a28] text-white p-5 flex justify-between items-center rounded-[2rem] shadow-lg">
          <h1 className="font-serif font-bold text-xl tracking-wide">Thaaragai Admin</h1>
          <Link to="/" className="p-2 bg-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Exit
          </Link>
        </div>
      </div>

      {/* Sidebar Navigation (Desktop Only) */}
      <div className="hidden md:block w-72 flex-shrink-0 z-50 p-4 sticky top-0 h-screen">
        <div className="bg-[#1a3a28] text-white rounded-[2rem] h-full shadow-xl flex flex-col overflow-hidden relative">
          <div className="p-8 pb-6 flex justify-between items-center md:block relative z-10 border-b border-white/10">
            <h1 className="font-serif font-bold text-3xl tracking-wide text-center w-full text-white">
              Admin<span className="text-[#a8d3b8]">.</span>
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/70 hover:text-white absolute right-6 top-8">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-grow py-6 px-4 relative z-10 overflow-y-auto scrollbar-none">
            <ul className="space-y-2">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold text-sm tracking-wide ${
                      activeTab === tab.id 
                        ? 'bg-white text-[#1a3a28] shadow-md scale-[1.02]' 
                        : 'text-white/70 hover:bg-white hover:text-white'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#2D6A2D]' : ''}`} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border-t border-white/10 relative z-10 bg-white ">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2D6A2D] flex items-center justify-center font-bold text-lg border-2 border-white/20">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-[#a8d3b8] font-bold uppercase tracking-wider">Logged in as</div>
                <div className="font-bold text-sm truncate w-32">{user?.name}</div>
              </div>
            </div>
            <Link to="/" className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white text-white py-3 rounded-xl font-bold transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Exit Admin
            </Link>
          </div>
          
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A2D] rounded-full blur-[60px] opacity-30 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#8B1A1A] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8 md:pl-4 overflow-x-hidden relative h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <Loader2 className="w-10 h-10 text-[#2D6A2D] animate-spin mb-4" />
              <p className="text-[#1a3a28] font-bold">Syncing data...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              
              {/* HEADER SECTION */}
              <div className="mb-8 md:mb-10 mt-4 md:mt-0">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3a28] mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-500 font-medium">
                  {activeTab === 'dashboard' && 'Overview of your store performance.'}
                  {activeTab === 'orders' && 'Manage and fulfill customer orders.'}
                  {activeTab === 'products' && 'Control your catalog and inventory.'}
                  {activeTab === 'users' && 'View registered customers.'}
                </p>
              </div>

              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-[#2D6A2D]', bg: 'bg-[#e8f3ec]' },
                    { label: 'Pending Orders', value: stats.pendingOrders, icon: BarChart3, color: 'text-[#e0893b]', bg: 'bg-[#fcf3ea]' },
                    { label: 'Total Products', value: stats.totalProducts, icon: ShoppingBag, color: 'text-[#8B1A1A]', bg: 'bg-[#f7eaea]' },
                    { label: 'Customers', value: stats.totalUsers, icon: Users, color: 'text-[#2b5a7a]', bg: 'bg-[#eaf1f5]' },
                  ].map((stat, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="bg-white rounded-[2rem] shadow-sm p-6 sm:p-8 border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow"
                    >
                      <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-[#1a3a28] mb-1">{stat.value}</div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Revenue Card - Wide */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="sm:col-span-2 lg:col-span-4 bg-[#1a3a28] text-white rounded-[2.5rem] shadow-lg p-8 md:p-10 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2"
                  >
                    <div className="relative z-10">
                      <div className="text-[#a8d3b8] text-sm font-bold uppercase tracking-wider mb-2">Total Revenue Generated</div>
                      <div className="text-4xl md:text-6xl font-serif font-bold tracking-tight">₹{stats.totalRevenue?.toLocaleString()}</div>
                    </div>
                    <div className="relative z-10 mt-6 sm:mt-0 bg-white p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                      <IndianRupee className="w-10 h-10 md:w-16 md:h-16 text-[#a8d3b8] opacity-80" />
                    </div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#2D6A2D] rounded-full blur-[80px] opacity-40"></div>
                  </motion.div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="bg-white shadow-sm rounded-[2rem] overflow-hidden border border-gray-100">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#FDFAF5] text-[#1a3a28] text-xs uppercase tracking-wider border-b border-gray-100">
                          <th className="p-5 pl-8 font-bold">Order Details</th>
                          <th className="p-5 font-bold">Customer</th>
                          <th className="p-5 font-bold">Amount</th>
                          <th className="p-5 font-bold">Status</th>
                          <th className="p-5 pr-8 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.length > 0 ? orders.map(o => (
                          <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-5 pl-8">
                              <div className="font-mono text-sm font-bold text-[#1a3a28] ">#{o.orderNumber || o._id.slice(-6).toUpperCase()}</div>
                              <div className="text-xs text-gray-500 font-medium mt-1">{o.items.length} item(s)</div>
                            </td>
                            <td className="p-5">
                              <div className="font-bold text-[#1a3a28] ">{o.user?.name || 'Unknown User'}</div>
                              <div className="text-xs text-gray-500 font-medium mt-0.5">{o.user?.email || 'No email'}</div>
                            </td>
                            <td className="p-5">
                              <span className="font-bold text-[#2D6A2D] bg-[#2D6A2D]/10 px-3 py-1 rounded-lg">₹{o.totalAmount}</span>
                            </td>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                                o.status === 'delivered' ? 'bg-[#e8f3ec] text-[#2D6A2D]' :
                                o.status === 'confirmed' ? 'bg-[#eaf1f5] text-[#2b5a7a]' :
                                'bg-[#fcf3ea] text-[#e0893b]'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  o.status === 'delivered' ? 'bg-[#2D6A2D]' : o.status === 'confirmed' ? 'bg-[#2b5a7a]' : 'bg-[#e0893b]'
                                }`}></span>
                                {o.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-5 pr-8 text-right">
                              <select 
                                value={o.status}
                                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent font-medium text-[#1a3a28] bg-white cursor-pointer shadow-sm hover:border-gray-300 transition-all"
                              >
                                <option value="pending">Mark Pending</option>
                                <option value="confirmed">Mark Confirmed</option>
                                <option value="delivered">Mark Delivered</option>
                              </select>
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No orders found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden flex flex-col bg-gray-50 p-4 gap-4">
                    {orders.length > 0 ? orders.map(o => (
                      <div key={o._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                            o.status === 'delivered' ? 'bg-[#2D6A2D]' :
                            o.status === 'confirmed' ? 'bg-[#2b5a7a]' :
                            'bg-[#e0893b]'
                        }`}></div>
                        <div className="flex justify-between items-start pl-2">
                          <div>
                            <div className="font-mono text-sm font-bold text-[#1a3a28] ">#{o.orderNumber || o._id.slice(-6).toUpperCase()}</div>
                            <div className="text-xs text-gray-500 font-medium">{o.items.length} item(s)</div>
                          </div>
                          <span className="font-bold text-[#2D6A2D] bg-[#2D6A2D]/10 px-2.5 py-1 rounded-lg text-sm">₹{o.totalAmount}</span>
                        </div>
                        <div className="pl-2">
                          <div className="font-bold text-sm text-[#1a3a28] ">{o.user?.name || 'Unknown User'}</div>
                          <div className="text-xs text-gray-500 font-medium">{o.user?.email || 'No email'}</div>
                        </div>
                        <div className="flex justify-between items-center mt-1 pt-4 border-t border-gray-50 pl-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            o.status === 'delivered' ? 'bg-[#e8f3ec] text-[#2D6A2D]' :
                            o.status === 'confirmed' ? 'bg-[#eaf1f5] text-[#2b5a7a]' :
                            'bg-[#fcf3ea] text-[#e0893b]'
                          }`}>
                            {o.status}
                          </span>
                          <select 
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#2D6A2D] font-medium text-[#1a3a28] bg-white cursor-pointer"
                          >
                            <option value="pending">Mark Pending</option>
                            <option value="confirmed">Mark Confirmed</option>
                            <option value="delivered">Mark Delivered</option>
                          </select>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-100">No orders found.</div>
                    )}
                  </div>
                </div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <div className="bg-white shadow-sm rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col">
                  
                  {/* Toolbar */}
                  <div className="p-6 border-b border-gray-100 bg-[#FDFAF5] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" placeholder="Search catalog..." 
                          value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] w-full"
                        />
                      </div>
                      <select 
                        value={productCategory} onChange={e => setProductCategory(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] bg-white "
                      >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <select 
                        value={productSort} onChange={e => setProductSort(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] bg-white "
                      >
                        <option value="default">Sort By</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                      </select>
                    </div>

                    <button 
                      onClick={openAddModal}
                      className="bg-[#1a3a28] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2D6A2D] transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" /> Add Product
                    </button>
                  </div>

                  {/* Products Table */}
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-[#FDFAF5] text-[#1a3a28] text-xs uppercase tracking-wider border-b border-gray-100">
                          <th className="p-5 pl-8 font-bold">Product</th>
                          <th className="p-5 font-bold">Category</th>
                          <th className="p-5 font-bold">Price</th>
                          <th className="p-5 font-bold text-center">Visibility</th>
                          <th className="p-5 pr-8 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map(p => (
                          <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-5 pl-8">
                              <div className="flex items-center gap-3">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 " />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-[#1a3a28] ">{p.name}</div>
                                  <div className="text-xs text-gray-500 font-medium mt-0.5">{p.weight && p.weight !== 'null' ? p.weight : '-'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 text-sm text-gray-500 font-medium capitalize">
                              <span className="bg-gray-100 px-3 py-1 rounded-lg">{p.category.replace('-', ' ')}</span>
                            </td>
                            <td className="p-5">
                              {p.price > 0 ? <span className="font-bold text-[#1a3a28] ">₹{p.price}</span> : <span className="text-gray-400 text-xs font-bold uppercase">On Request</span>}
                            </td>
                            <td className="p-5 text-center">
                              <button
                                onClick={() => handleStockToggle(p._id, p.inStock)}
                                className={`w-14 h-7 rounded-full relative transition-colors shadow-inner mx-auto block ${p.inStock ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}
                                aria-label="Toggle Visibility"
                                title={p.inStock ? "Visible to customers" : "Hidden from customers"}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${p.inStock ? 'right-1' : 'left-1'}`}></div>
                              </button>
                            </td>
                            <td className="p-5 pr-8 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => openEditModal(p)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No products match your filters.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden flex flex-col bg-gray-50 p-4 gap-4">
                    {filteredProducts.map(p => (
                      <div key={p._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative">
                        <div className="flex gap-4 items-start">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0 shadow-sm" />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                              <ShoppingBag className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#1a3a28] text-base truncate">{p.name}</div>
                            <div className="text-xs text-gray-500 font-medium mt-1">
                              <span className="capitalize">{p.category.replace('-', ' ')}</span>
                              {p.weight && p.weight !== 'null' && <span> • {p.weight}</span>}
                            </div>
                            <div className="mt-1.5">
                              {p.price > 0 ? <span className="font-bold text-[#8B1A1A]">₹{p.price}</span> : <span className="text-gray-400 text-xs font-bold uppercase">On Request</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStockToggle(p._id, p.inStock)}
                              className={`w-12 h-6 rounded-full relative transition-colors shadow-inner ${p.inStock ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all ${p.inStock ? 'right-1' : 'left-1'}`}></div>
                            </button>
                            <span className="text-xs font-bold text-gray-500 uppercase">{p.inStock ? 'Visible' : 'Hidden'}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openEditModal(p)}
                              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="p-8 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-100">No products match your filters.</div>
                    )}
                  </div>
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="bg-white shadow-sm rounded-[2rem] overflow-hidden border border-gray-100">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-[#FDFAF5] text-[#1a3a28] text-xs uppercase tracking-wider border-b border-gray-100">
                          <th className="p-5 pl-8 font-bold">Customer Details</th>
                          <th className="p-5 font-bold">Contact</th>
                          <th className="p-5 font-bold">Role</th>
                          <th className="p-5 pr-8 font-bold text-right">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-5 pl-8">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${u.role === 'admin' ? 'bg-[#1a3a28]' : 'bg-[#D1AC98]'}`}>
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="font-bold text-[#1a3a28] ">{u.name}</div>
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="text-sm font-medium text-[#1a3a28] ">{u.email}</div>
                              {u.phone && <div className="text-xs text-gray-500 font-medium mt-0.5">{u.phone}</div>}
                            </td>
                            <td className="p-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                                u.role === 'admin' ? 'bg-[#1a3a28] text-white' : 'bg-[#eaf1f5] text-[#2b5a7a]'
                              }`}>
                                {u.role === 'admin' ? 'Administrator' : 'Customer'}
                              </span>
                            </td>
                            <td className="p-5 pr-8 text-sm text-gray-500 font-medium text-right">
                              {new Date(u.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden flex flex-col bg-gray-50 p-4 gap-4">
                    {users.map(u => (
                      <div key={u._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-sm ${u.role === 'admin' ? 'bg-[#1a3a28]' : 'bg-[#D1AC98]'}`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#1a3a28] text-base truncate">{u.name}</div>
                          <div className="text-sm text-gray-500 font-medium truncate mb-1">{u.email}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-[#1a3a28] text-white' : 'bg-[#eaf1f5] text-[#2b5a7a]'
                            }`}>
                              {u.role === 'admin' ? 'Admin' : 'Customer'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Joined {new Date(u.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="p-8 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-100">No customers found.</div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a3a28]/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-serif font-bold text-[#1a3a28] ">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name *</label>
                    <input 
                      id="name"
                      type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium"
                      placeholder="e.g. Ragi Flour"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                    <select 
                      id="category"
                      required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium bg-white "
                    >
                      {CATEGORIES.filter(c => c.id !== 'All').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (₹) *</label>
                    <input 
                      id="price"
                      type="number" min="0" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium"
                      placeholder="e.g. 250"
                    />
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight / Quantity</label>
                    <input 
                      id="weight"
                      type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium"
                      placeholder="e.g. 500g, 1kg, 200ml"
                    />
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
                    <input 
                      id="image"
                      type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      id="description" rows="3"
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium resize-none"
                      placeholder="Product details..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, inStock: !formData.inStock})}
                    className={`w-14 h-7 rounded-full relative transition-colors shadow-inner ${formData.inStock ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-1 transition-all ${formData.inStock ? 'right-1' : 'left-1'}`}></div>
                  </button>
                  <span className="text-sm font-bold text-gray-700 ">Item is currently visible on the store</span>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" disabled={isSaving}
                    className="bg-[#2D6A2D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3a28] transition-colors flex items-center shadow-md"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (editingId ? <Edit2 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />)}
                    {editingId ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-center z-40 rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 p-2 transition-colors flex-1 ${
              activeTab === tab.id ? 'text-[#2D6A2D]' : 'text-gray-400 hover:text-gray-600 '
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-[#eaf2eb] ' : 'bg-transparent'}`}>
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-[#2D6A2D]' : ''}`} />
            </div>
            <span className="text-[10px] font-bold tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
