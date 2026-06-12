import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const defaultFormState = {
    name: '', category: 'flours', price: '', weight: '', description: '', image: '', inStock: true,
    hasNutritionData: false, labTested: false, fssaiCompliant: false, nablAccredited: false,
    nutritionPer100g: {
      energy: '', protein: '', carbs: '', totalSugars: '', totalFat: '', transFat: '', sodium: '', calcium: '', vitaminC: ''
    }
  };
  const [formData, setFormData] = useState(defaultFormState);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') return;
    
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
      toast.error('Failed to update status');
    }
  };

  const handleStockToggle = async (id, currentStock) => {
    try {
      const newStock = !currentStock;
      await axiosInstance.put(`/api/admin/products/${id}/stock`, { inStock: newStock });
      setProducts(products.map(p => p._id === id ? { ...p, inStock: newStock } : p));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update stock');
    }
  };

  const handleDeleteProduct = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/api/admin/products/${deleteConfirmId}`);
      setProducts(products.filter(p => p._id !== deleteConfirmId));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axiosInstance.put(`/api/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update user role');
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultFormState);
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
      inStock: product.inStock,
      hasNutritionData: product.hasNutritionData || false,
      labTested: product.labTested || false,
      fssaiCompliant: product.fssaiCompliant || false,
      nablAccredited: product.nablAccredited || false,
      nutritionPer100g: {
        energy: product.nutritionPer100g?.energy ?? '',
        protein: product.nutritionPer100g?.protein ?? '',
        carbs: product.nutritionPer100g?.carbs ?? '',
        totalSugars: product.nutritionPer100g?.totalSugars ?? '',
        totalFat: product.nutritionPer100g?.totalFat ?? '',
        transFat: product.nutritionPer100g?.transFat ?? '',
        sodium: product.nutritionPer100g?.sodium ?? '',
        calcium: product.nutritionPer100g?.calcium ?? '',
        vitaminC: product.nutritionPer100g?.vitaminC ?? ''
      }
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
      toast.error('Failed to save product: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
    return (
      <div className="min-h-[calc(100dvh-88px)] bg-[#eaf2eb] flex items-center justify-center p-4 font-sans pb-24">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h2 className="text-3xl font-serif font-bold text-[#1a3a28] mb-3">Access Denied</h2>
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
    <div className="min-h-[calc(100dvh-88px)] flex flex-col bg-[#eaf2eb] pb-10 md:pb-24 font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Admin Control Panel.</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Manage your store operations, fulfill orders, and monitor business performance.
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2D6A2D] rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B1A1A] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        </section>
      </div>

      {/* 2. LAYOUT: NAV AND CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24 flex-grow flex flex-col">
        
        <div className="sticky top-[100px] z-40 bg-white backdrop-blur-md border border-gray-100 shadow-xl rounded-[2rem] transition-all mb-12">
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex overflow-x-auto scrollbar-none space-x-2 pb-2 lg:pb-0 flex-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-[#2D5A40] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex w-full lg:w-auto justify-between lg:justify-start items-center gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1a3a28] flex items-center justify-center font-bold text-white text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-bold text-[#1a3a28]">{user?.name}</div>
              </div>
              <Link to="/" className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Exit
              </Link>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-grow w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[40vh]">
              <Loader2 className="w-10 h-10 text-[#2D6A2D] animate-spin mb-4" />
              <p className="text-[#1a3a28] font-bold">Syncing data...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full">

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
                      <div className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        <span className="opacity-80 font-sans mr-1">₹</span>
                        {stats.totalRevenue?.toLocaleString()}
                      </div>
                    </div>
                    <div className="relative z-10 mt-6 sm:mt-0 bg-white p-5 rounded-2xl backdrop-blur-sm border border-white/20">
                      <IndianRupee className="w-10 h-10 md:w-16 md:h-16 text-[#1a3a28]" />
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
                        <tr className="bg-white text-[#1a3a28] text-xs uppercase tracking-wider border-b border-gray-100">
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
                  <div className="p-6 border-b border-gray-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" placeholder="Search catalog..." 
                          value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                          className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] w-full text-[#1a3a28] bg-white"
                        />
                      </div>
                      <select 
                        value={productCategory} onChange={e => setProductCategory(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] bg-white text-[#1a3a28]"
                      >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <select 
                        value={productSort} onChange={e => setProductSort(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] bg-white text-[#1a3a28]"
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
                        <tr className="bg-white text-[#1a3a28] text-xs uppercase tracking-wider border-b border-gray-100">
                          <th className="p-5 pl-8 font-bold">Product</th>
                          <th className="p-5 font-bold">SKU</th>
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
                                  {p.createdBy && <div className="text-[10px] font-medium text-[#2D6A2D] bg-[#e8f3ec] inline-block px-1.5 py-0.5 rounded mt-1">Added by {p.createdBy.name}</div>}
                                </div>
                              </div>
                            </td>
                            <td className="p-5 text-gray-600">
                              <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border">{p.sku || '-'}</span>
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
                              {p.price > 0 ? <span className="font-bold text-[#1a3a28]">₹{p.price}</span> : <span className="text-gray-400 text-xs font-bold uppercase">On Request</span>}
                            </div>
                            {p.createdBy && <div className="text-[10px] font-medium text-[#2D6A2D] mt-1">Added by {p.createdBy.name}</div>}
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
                        <tr className="bg-white text-[#1a3a28] text-xs uppercase tracking-wider border-b border-gray-100">
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
                              {user.role === 'super_admin' && u._id !== user._id ? (
                                <select 
                                  value={u.role || 'user'}
                                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-[#2D6A2D] font-medium text-[#1a3a28] bg-white cursor-pointer"
                                >
                                  <option value="user">Customer</option>
                                  <option value="admin">Admin</option>
                                  <option value="super_admin">Super Admin</option>
                                </select>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                                  u.role === 'super_admin' ? 'bg-[#8B1A1A] text-white' : u.role === 'admin' ? 'bg-[#1a3a28] text-white' : 'bg-[#eaf1f5] text-[#2b5a7a]'
                                }`}>
                                  {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Administrator' : 'Customer'}
                                </span>
                              )}
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
                            {user.role === 'super_admin' && u._id !== user._id ? (
                              <select 
                                value={u.role || 'user'}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                className="text-[10px] border border-gray-200 rounded-md px-1 py-0.5 outline-none font-bold text-[#1a3a28] bg-white"
                              >
                                <option value="user">Customer</option>
                                <option value="admin">Admin</option>
                                <option value="super_admin">Super Admin</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'super_admin' ? 'bg-[#8B1A1A] text-white' : u.role === 'admin' ? 'bg-[#1a3a28] text-white' : 'bg-[#eaf1f5] text-[#2b5a7a]'
                              }`}>
                                {u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Customer'}
                              </span>
                            )}
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
              className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 max-w-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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

                {/* COMPLIANCE & NUTRITION SECTION */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-[#1a3a28] uppercase tracking-wider mb-4">Compliance & Nutrition</h4>
                  
                  <div className="flex flex-wrap gap-6 mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button type="button" onClick={() => setFormData({...formData, labTested: !formData.labTested})} className={`w-12 h-6 rounded-full relative transition-colors ${formData.labTested ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all ${formData.labTested ? 'right-1' : 'left-1'}`}></div>
                      </button>
                      <span className="text-sm font-bold text-gray-700">Lab Tested</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button type="button" onClick={() => setFormData({...formData, fssaiCompliant: !formData.fssaiCompliant})} className={`w-12 h-6 rounded-full relative transition-colors ${formData.fssaiCompliant ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all ${formData.fssaiCompliant ? 'right-1' : 'left-1'}`}></div>
                      </button>
                      <span className="text-sm font-bold text-gray-700">FSSAI Compliant</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button type="button" onClick={() => setFormData({...formData, nablAccredited: !formData.nablAccredited})} className={`w-12 h-6 rounded-full relative transition-colors ${formData.nablAccredited ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all ${formData.nablAccredited ? 'right-1' : 'left-1'}`}></div>
                      </button>
                      <span className="text-sm font-bold text-gray-700">NABL Accredited</span>
                    </label>
                  </div>

                  <div className="bg-[#eaf2eb] p-5 rounded-2xl border border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer mb-4">
                      <button type="button" onClick={() => setFormData({...formData, hasNutritionData: !formData.hasNutritionData})} className={`w-12 h-6 rounded-full relative transition-colors ${formData.hasNutritionData ? 'bg-[#2D6A2D]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-all ${formData.hasNutritionData ? 'right-1' : 'left-1'}`}></div>
                      </button>
                      <span className="text-sm font-bold text-[#1a3a28]">Has Nutrition Data?</span>
                    </label>

                    {formData.hasNutritionData && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-1 mt-2">
                          {[
                            { key: 'energy', label: 'Energy (Kcal)' },
                            { key: 'protein', label: 'Protein (g)' },
                            { key: 'carbs', label: 'Carbs (g)' },
                            { key: 'totalSugars', label: 'Total Sugars (g)' },
                            { key: 'totalFat', label: 'Total Fat (g)' },
                            { key: 'transFat', label: 'Trans Fat (g)' },
                            { key: 'sodium', label: 'Sodium (mg)' },
                            { key: 'calcium', label: 'Calcium (mg)' },
                            { key: 'vitaminC', label: 'Vitamin C (mg)' }
                          ].map(field => (
                            <div key={field.key}>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{field.label}</label>
                              <input 
                                type="number" step="any"
                                value={formData.nutritionPer100g?.[field.key] ?? ''} 
                                onChange={e => setFormData({
                                  ...formData, 
                                  nutritionPer100g: {
                                    ...formData.nutritionPer100g,
                                    [field.key]: e.target.value === '' ? null : Number(e.target.value)
                                  }
                                })}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-[#2D6A2D] focus:ring-1 focus:ring-[#2D6A2D] outline-none text-[#1a3a28] font-medium transition-colors"
                                placeholder="0.0"
                              />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
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
                    {editingId ? (
                      <>
                        <span className="hidden sm:inline">Save Changes</span>
                        <span className="sm:hidden">Save</span>
                      </>
                    ) : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a3a28]/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
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
                <h2 className="text-xl font-bold text-[#1a3a28] mb-2">Delete Product?</h2>
                <p className="text-gray-500 font-medium text-sm">Are you sure you want to delete this product? This action cannot be undone.</p>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={isDeleting}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteProduct}
                  disabled={isDeleting}
                  className="flex-1 bg-[#8B1A1A] text-white px-4 py-3 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-md disabled:opacity-75 flex justify-center items-center"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
