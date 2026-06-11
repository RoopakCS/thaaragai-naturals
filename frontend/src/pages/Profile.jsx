import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Loader2, LogOut, Package, User, MapPin, Edit2, Check, X, Navigation } from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Section Edit States
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const parseAddress = (str) => {
    if (!str) return { street: '', city: '', state: '', pincode: '' };
    try {
      return JSON.parse(str);
    } catch {
      return { street: str, city: '', state: '', pincode: '' };
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/auth/profile');
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || ''
        });
        setAddressForm(parseAddress(res.data.address));
        login(res.data, useAuthStore.getState().token);
      } catch (error) {
        console.error("Error fetching profile", error);
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate, logout, login]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    try {
      const res = await axiosInstance.put('/api/auth/profile', {
        name: formData.name,
        phone: formData.phone
      });
      login(res.data, useAuthStore.getState().token);
      setIsEditingContact(false);
    } catch (error) {
      console.error("Error saving contact", error);
      toast.error("Failed to update profile.");
    } finally {
      setSavingContact(false);
    }
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      const res = await axiosInstance.put('/api/auth/profile', {
        address: JSON.stringify(addressForm)
      });
      login(res.data, useAuthStore.getState().token);
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Error saving address", error);
      toast.error("Failed to update address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleCancelContact = () => {
    setFormData(prev => ({ ...prev, name: user?.name || '', phone: user?.phone || '' }));
    setIsEditingContact(false);
  };

  const handleCancelAddress = () => {
    setAddressForm(parseAddress(user?.address));
    setIsEditingAddress(false);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          if (data && data.address) {
            setAddressForm({
              street: data.address.road || data.address.suburb || data.address.neighbourhood || '',
              city: data.address.city || data.address.town || data.address.village || data.address.county || '',
              state: data.address.state || '',
              pincode: data.address.postcode || ''
            });
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          toast.error("Failed to get address from coordinates.");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Unable to retrieve your location. Please check your browser permissions.");
        setGettingLocation(false);
      }
    );
  };

  // Derive display address
  const displayAddress = parseAddress(user?.address);
  const hasAddress = displayAddress.street || displayAddress.city || displayAddress.state || displayAddress.pincode;

  if (loading) {
    return (
      <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2D6A2D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#eaf2eb] min-h-[calc(100dvh-88px)] font-sans flex flex-col pb-24">
      {/* 1. HERO SECTION */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section className="bg-[#1a3a28] rounded-[2rem] sm:rounded-[2.5rem] text-white pt-16 sm:pt-24 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 xl:px-16 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 sm:mb-6">Hello, {user?.name?.split(' ')[0]}.</h1>
            <p className="text-[#a8d3b8] text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              Manage your personal details and wellness journey.
            </p>
          </div>
        </section>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 -mt-20 sm:-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] shadow-sm p-6 sm:p-8 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-[#1a3a28] flex items-center">
                  <User className="w-5 h-5 mr-3 text-[#2D6A2D]" />
                  Personal Details
                </h2>
                {!isEditingContact && (
                  <button 
                    onClick={() => setIsEditingContact(true)}
                    className="text-[#2D6A2D] hover:bg-[#f0f7f0] p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                    {isEditingContact ? (
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all"
                      />
                    ) : (
                      <p className="text-[#1a3a28] font-medium text-lg">{user?.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                    {isEditingContact ? (
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all"
                      />
                    ) : (
                      <p className="text-[#1a3a28] font-medium text-lg">{user?.phone || <span className="text-gray-400 italic text-sm">Not provided</span>}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email (Read Only)</label>
                  <p className="text-[#1a3a28] font-medium text-lg opacity-70">{user?.email}</p>
                </div>

                {isEditingContact && (
                  <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
                    <button 
                      onClick={handleSaveContact}
                      disabled={savingContact}
                      className="bg-[#2D6A2D] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1a3a28] transition-colors flex items-center"
                    >
                      {savingContact ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      Save
                    </button>
                    <button 
                      onClick={handleCancelContact}
                      className="text-gray-500 hover:bg-gray-100 px-6 py-2 rounded-lg font-bold transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Address Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] shadow-sm p-6 sm:p-8 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-[#1a3a28] flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-[#2D6A2D]" />
                  Shipping Address
                </h2>
                {!isEditingAddress && (
                  <button 
                    onClick={() => setIsEditingAddress(true)}
                    className="text-[#2D6A2D] hover:bg-[#f0f7f0] p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              <div>
                {!isEditingAddress ? (
                  <div className="mt-1">
                    {hasAddress ? (
                      <div className="text-[#1a3a28] font-medium text-lg">
                        {displayAddress.street && <p>{displayAddress.street}</p>}
                        {(displayAddress.city || displayAddress.pincode) && (
                          <p>{displayAddress.city}{displayAddress.city && displayAddress.pincode ? ' - ' : ''}{displayAddress.pincode}</p>
                        )}
                        {displayAddress.state && <p>{displayAddress.state}</p>}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No primary address saved yet. Please edit to add one.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end mb-2">
                      <button 
                        onClick={handleGetLocation}
                        disabled={gettingLocation}
                        className="bg-[#f0f7f0] text-[#2D6A2D] px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-[#e2f0e2] transition-colors border border-[#2D6A2D]/20"
                      >
                        {gettingLocation ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
                        {gettingLocation ? "Locating..." : "Use My Current Location"}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={addressForm.street}
                        onChange={e => setAddressForm({...addressForm, street: e.target.value})}
                        placeholder="House/Flat No., Street Name, Landmark"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                        <input 
                          type="text" 
                          value={addressForm.city}
                          onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pincode</label>
                        <input 
                          type="text" 
                          value={addressForm.pincode}
                          onChange={e => setAddressForm({...addressForm, pincode: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">State</label>
                      <input 
                        type="text" 
                        value={addressForm.state}
                        onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2D6A2D] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {isEditingAddress && (
                  <div className="flex gap-3 pt-4 mt-6 border-t border-gray-100">
                    <button 
                      onClick={handleSaveAddress}
                      disabled={savingAddress}
                      className="bg-[#2D6A2D] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#1a3a28] transition-colors flex items-center"
                    >
                      {savingAddress ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                      Save Address
                    </button>
                    <button 
                      onClick={handleCancelAddress}
                      className="text-gray-500 hover:bg-gray-100 px-6 py-2 rounded-lg font-bold transition-colors flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column - Actions & Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#f2f8f2] border border-[#2D5A40]/20 rounded-2xl p-6 lg:sticky lg:top-24 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-[#1a3a28] mb-6">
                Quick Actions
              </h2>

              <div className="flex flex-col gap-4">
                <Link to="/orders" className="block w-full">
                  <button className="w-full bg-white border border-[#2D5A40]/20 text-[#1a3a28] py-4 rounded-xl font-bold flex items-center justify-center hover:bg-[#e2f0e2] shadow-sm transition-all group">
                    <Package className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    View Order History
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full bg-transparent border-2 border-[#8B1A1A] text-[#8B1A1A] py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-[#8B1A1A] hover:text-white shadow-sm transition-all group"
                >
                  <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Logout
                </button>
              </div>

              <div className="bg-white border border-[#2D5A40]/10 text-sm mb-2 p-4 rounded-xl flex gap-3 items-start shadow-sm mt-6">
                <User className="w-5 h-5 text-[#2D6A2D] flex-shrink-0 mt-0.5" />
                <p className="text-[#4a392f] leading-snug">
                  <span className="font-semibold block mb-1">Account Security</span>
                  Your data is securely stored. We never share your personal information.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
