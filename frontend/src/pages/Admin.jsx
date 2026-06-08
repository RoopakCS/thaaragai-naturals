import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { BarChart3, Package, ShoppingBag, Users, Menu, X, ArrowLeft } from 'lucide-react';

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/admin/orders/${id}/status`, { status: newStatus });
      alert('Status updated!');
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <Link to="/" className="bg-[#8B1A1A] text-white px-6 py-2 rounded-xl font-medium inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#1a1a1a] text-white p-4 flex justify-between items-center">
        <h1 className="font-serif font-bold text-xl">TN Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block bg-[#1a1a1a] text-white w-full md:w-64 flex-shrink-0 flex flex-col min-h-screen md:min-h-auto absolute md:relative z-20`}>
        <div className="p-6 hidden md:block">
          <h1 className="font-serif font-bold text-2xl tracking-wider text-center">ADMIN Panel</h1>
        </div>
        
        <div className="flex-grow py-4">
          <ul className="space-y-1 px-3">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id ? 'bg-[#8B1A1A] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
          <div className="mb-2">Logged in as: <span className="text-white">{user.name}</span></div>
          <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Exit Admin
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-8 overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
                    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                    { label: 'Total Products', value: stats.totalProducts, icon: '🛍️' },
                    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-[#8B1A1A] font-bold text-3xl mb-1">{stat.value}</div>
                      <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                  <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Revenue</div>
                      <div className="text-[#2D6A2D] font-bold text-4xl">₹{stats.totalRevenue}</div>
                    </div>
                    <div className="text-5xl opacity-50">💰</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
                <div className="bg-white shadow-sm rounded-2xl overflow-x-auto border border-gray-100">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <th className="p-4 border-b font-semibold">Order ID</th>
                        <th className="p-4 border-b font-semibold">Customer</th>
                        <th className="p-4 border-b font-semibold">Items</th>
                        <th className="p-4 border-b font-semibold">Amount</th>
                        <th className="p-4 border-b font-semibold">Status</th>
                        <th className="p-4 border-b font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(o => (
                        <tr key={o._id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm font-mono text-gray-500">{o._id.slice(-6).toUpperCase()}</td>
                          <td className="p-4">
                            <div className="font-medium text-gray-800">{o.user?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">{o.user?.email || ''}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {o.items.length} items
                          </td>
                          <td className="p-4 font-bold text-[#8B1A1A]">₹{o.totalAmount}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              o.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                              o.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {o.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <select 
                              value={o.status}
                              onChange={(e) => handleStatusChange(o._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#8B1A1A]"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Products</h2>
                <div className="bg-white shadow-sm rounded-2xl overflow-x-auto border border-gray-100">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <th className="p-4 border-b font-semibold">Name</th>
                        <th className="p-4 border-b font-semibold">Category</th>
                        <th className="p-4 border-b font-semibold">Price</th>
                        <th className="p-4 border-b font-semibold">Weight</th>
                        <th className="p-4 border-b font-semibold text-center">In Stock</th>
                        <th className="p-4 border-b font-semibold text-center">Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                        <tr key={p._id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-800">{p.name}</td>
                          <td className="p-4 text-sm text-gray-600 capitalize">{p.category.replace('-', ' ')}</td>
                          <td className="p-4 font-bold text-gray-800">₹{p.price}</td>
                          <td className="p-4 text-sm text-gray-500">{p.weight && p.weight !== 'null' ? p.weight : '-'}</td>
                          <td className="p-4 text-center">
                            {p.inStock ? 
                              <span className="text-green-600 text-sm font-bold">Yes</span> : 
                              <span className="text-red-500 text-sm font-bold">No</span>
                            }
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleStockToggle(p._id, p.inStock)}
                              className={`w-12 h-6 rounded-full relative transition-colors ${p.inStock ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${p.inStock ? 'right-1' : 'left-1'}`}></div>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Users</h2>
                <div className="bg-white shadow-sm rounded-2xl overflow-x-auto border border-gray-100">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <th className="p-4 border-b font-semibold">Name</th>
                        <th className="p-4 border-b font-semibold">Email</th>
                        <th className="p-4 border-b font-semibold">Phone</th>
                        <th className="p-4 border-b font-semibold">Role</th>
                        <th className="p-4 border-b font-semibold">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-800">{u.name}</td>
                          <td className="p-4 text-sm text-gray-600">{u.email}</td>
                          <td className="p-4 text-sm text-gray-600">{u.phone || '-'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString('en-GB')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
