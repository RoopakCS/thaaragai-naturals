import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wheat, Coffee, Stethoscope, Cookie, Droplets, Heart, Package, Leaf, Sparkles, ArrowLeft, ArrowRight, Star, Clock, BookOpen, Award, Activity, CheckCircle, ChevronRight, ShoppingBag, Flame, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

import heroImageDesktop from '../assets/Website Hero Image - Desktop.webp';
import heroImageMobile from '../assets/Website Hero Image - Mobile.webp';
import dosaMaavuImg from '../assets/category images/siruthaniya-dosa-maavu.webp';
// import gheeImg from '../assets/category images/ghee.webp';
import healthMixesImg from '../assets/category images/uzhunthangali-maavu.webp';
import idlyPodiImg from '../assets/category images/Idly Podi.webp';
import laddusImg from '../assets/category images/millet-laddus-big.webp';
import nalunguMaavuImg from '../assets/category images/nalungu-maavu.webp';
import './Home.css';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { items: cartItems, totalPrice, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
      fetchCart();
    }
  }, [isAuthenticated, fetchWishlist, fetchCart]);

  // GTA VI Style Hero Parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const textY = useTransform(heroProgress, [0, 1], [0, -250]);
  const textOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
  const textScale = useTransform(heroProgress, [0, 1], [1, 0.85]);
  const imgScale = useTransform(heroProgress, [0, 1], [1, 1.3]);
  const imgY = useTransform(heroProgress, [0, 1], [0, 100]);
  const bgScale = useTransform(heroProgress, [0, 1], [1, 1.15]);

  // Shared Categories Data
  const categories = [
    { name: 'Millet Flours', slug: 'flours', color: 'bg-[#1a3a28]', image: dosaMaavuImg },
    // { name: 'Herbal Drinks', slug: 'beverages', color: 'bg-[#1a3a28]', image: gheeImg },
    { name: 'Health Mixes', slug: 'health-mixes', color: 'bg-[#1a3a28]', image: healthMixesImg },
    { name: 'Podis', slug: 'podis', color: 'bg-[#1a3a28]', image: idlyPodiImg },
    { name: 'Laddus', slug: 'laddus', color: 'bg-[#1a3a28]', image: laddusImg },
    { name: 'Personal Care', slug: 'personal-care', color: 'bg-[#1a3a28]', image: nalunguMaavuImg },
  ];

  return (
    <div className="bg-[#eaf2eb] min-h-dvh pb-8">
      {/* SECTION 1 — HERO (ROCKSTAR MULTI-LAYER PARALLAX) */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section ref={heroRef} className="relative h-[calc(100dvh-100px)] lg:h-[calc(100dvh-110px)] flex flex-col items-center bg-[#1a3a28] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-xl">
        
        {/* Layer 1: Background Gradient */}
        <motion.div 
          style={{ scale: bgScale }}
          className="absolute inset-0 bg-gradient-to-br from-[#1a3a28] via-[#0f2418] to-[#2D5A40] z-0 origin-center"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2D6A2D] blur-[120px] rounded-full pointer-events-none opacity-40"></div>
          <div className="absolute bottom-0 left-1/4 w-3/4 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none"></div>
        </motion.div>

        {/* Layer 2: Foreground Text */}
        <motion.div 
          className="absolute top-8 md:top-12 flex flex-col items-center w-full max-w-7xl shrink-0 z-20 origin-top pointer-events-auto"
        >
          <motion.div 
            className="flex flex-col items-center text-center px-4 md:px-8 w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <span className="inline-flex items-center bg-white/10 backdrop-blur-md text-[#a8d3b8] border border-white/20 px-5 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
                Natural • Homemade • Traditional
              </span>
            </motion.div>
            
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="text-white font-tamil text-2xl sm:text-4xl md:text-5xl mb-4 md:mb-6 leading-tight w-full drop-shadow-lg max-w-full px-2 break-words"
            >
              <span className="block sm:whitespace-nowrap">"இயற்கையில் வேருன்றியது...</span>
              <span className="block sm:whitespace-nowrap">அன்புடன் உருவாக்கப்பட்டது..."</span>
            </motion.h1>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-[#a8d3b8] text-base md:text-lg mb-6 md:mb-8 max-w-2xl font-medium opacity-90 px-4">
              Rooted in Nature, Made with Love.
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-lg px-4 relative z-40 pointer-events-auto mt-2"
            >
              <Link to="/products" className="w-full sm:w-auto flex-1">
                <button className="bg-white text-[#1a3a28] px-8 py-3.5 sm:py-4 rounded-full font-bold shadow-xl hover:bg-gray-100 transition-colors w-full text-sm sm:text-base min-h-[44px]">
                  Explore Products
                </button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto flex-1">
                <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 sm:py-4 rounded-full font-bold shadow-xl hover:bg-white/20 transition-colors flex items-center justify-center w-full text-sm sm:text-base border border-white/20 min-h-[44px]">
                  Our Story
                </button>
              </Link>
            </motion.div>
            
          </motion.div>
        </motion.div>
        
        {/* Layer 3: Product Image */}
        <motion.div 
          className="absolute -bottom-2 flex-1 w-full max-w-7xl flex justify-center z-10 pointer-events-none md:h-[65vh] md:max-h-[650px] origin-bottom px-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <img 
            src={heroImageDesktop} 
            alt="Thaaragai Naturals Product - Desktop" 
            className="hidden md:block w-full h-full object-contain object-bottom drop-shadow-[0_-20px_50px_rgba(0,0,0,0.5)] max-w-full"
          />
          <img 
            src={heroImageMobile} 
            alt="Thaaragai Naturals Product - Mobile" 
            className="block md:hidden w-[125%] max-w-none h-auto object-contain object-bottom drop-shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
        </section>
      </div>

      {isAuthenticated ? (
        <LoggedInDashboard user={user} categories={categories} wishlistItems={wishlistItems} cartItems={cartItems} totalPrice={totalPrice} />
      ) : (
        <GuestSections categories={categories} />
      )}

    </div>
  );
}

// ---------------------------------------------------------
// LOGGED IN USER VIEW - "THE WELLNESS DASHBOARD"
// ---------------------------------------------------------
function LoggedInDashboard({ user, categories, wishlistItems, cartItems, totalPrice }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMilletFact = () => {
    const facts = [
      { title: 'Iron Powerhouse', desc: 'Pearl Millet (Kambu) has the highest iron content among all grains, making it a powerful natural remedy to maintain energy levels.' },
      { title: 'Ancient Heritage', desc: 'Foxtail Millet (Thinai) was deeply revered in ancient Sangam literature and has been a staple in Tamil diets for over 3,000 years.' },
      { title: 'Calcium Rich', desc: 'Finger Millet (Ragi) contains 3 times more calcium than milk, making it an incredible natural source for bone health in growing children and adults.' },
      { title: 'Blood Sugar Friendly', desc: 'Millets are completely gluten-free and have a very low glycemic index, providing steady energy without the sugar spikes of polished rice.' },
      { title: 'Climate Smart', desc: 'Millets require 70% less water than rice. By eating millets, you are directly supporting sustainable, eco-friendly farming practices.' }
    ];
    // Use the day of the year to cycle through facts so it changes daily
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return facts[dayOfYear % facts.length];
  };

  const name = user?.name?.split(' ')[0] || 'Friend';
  const milletFact = getMilletFact();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 space-y-12 pb-24">
      {/* Greeting Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-8 pb-4"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1a3a28] mb-2">
          {getGreeting()}, {name}.
        </h2>
        <p className="text-[#4a392f] text-lg opacity-80 font-medium">
          Welcome back to your natural wellness journey.
        </p>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ROW 1: Your Pantry */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-[#faf9f6] rounded-[2rem] p-5 sm:p-6 shadow-inner border border-[#1a3a28]/5 relative overflow-hidden group h-full flex flex-col justify-center">
            
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-5 relative z-10 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#eaf2eb] p-2.5 rounded-2xl shadow-sm border border-white">
                  <ShoppingBag className="w-5 h-5 text-[#2D5A40]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1a3a28]">
                    Your Pantry
                  </h3>
                  {cartItems && cartItems.length > 0 && (
                    <p className="text-[10px] font-bold text-[#2D5A40] uppercase tracking-widest mt-0.5">
                      {cartItems.length} Items • Total ₹{totalPrice}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0 [&::-webkit-scrollbar]:hidden">
                <Link to="/products" className="text-xs font-bold text-[#4a392f] bg-white border border-black/5 hover:border-black/10 px-4 py-2 rounded-full whitespace-nowrap transition-all hover:shadow-sm">
                  Browse
                </Link>
                <Link to="/cart" className="text-xs font-bold text-[#2D5A40] bg-[#eaf2eb] hover:bg-[#d4e6d7] px-4 py-2 rounded-full whitespace-nowrap transition-all">
                  View Cart
                </Link>
                {cartItems && cartItems.length > 0 && (
                  <Link to="/cart" state={{ openCheckout: true }} className="bg-[#1a3a28] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#2D5A40] transition-all shadow-md hover:shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

            {cartItems && cartItems.length > 0 ? (
              <div className="relative">
                {/* Fade out gradient for scroll indication */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#faf9f6] to-transparent z-10 pointer-events-none rounded-r-[2rem]"></div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scroll-smooth relative z-0">
                  {cartItems.map(item => {
                    const productId = item.product?._id || item.product;
                    const productImage = item.product?.image;
                    const category = item.product?.category || 'default';
                    
                    const getCategoryIcon = (cat) => {
                      switch(cat) {
                        case 'flours': return <Wheat className="w-8 h-8 text-[#2D5A40]" />;
                        case 'beverages': return <Coffee className="w-8 h-8 text-[#2D5A40]" />;
                        case 'health-mixes': return <Stethoscope className="w-8 h-8 text-[#2D5A40]" />;
                        case 'podis': return <Sparkles className="w-8 h-8 text-[#2D5A40]" />;
                        case 'laddus': return <Cookie className="w-8 h-8 text-[#2D5A40]" />;
                        case 'personal-care': return <Droplets className="w-8 h-8 text-[#2D5A40]" />;
                        default: return <Package className="w-8 h-8 text-[#2D5A40]" />;
                      }
                    };

                    return (
                    <Link to={`/product/${productId}`} key={productId} className="min-w-[180px] sm:min-w-[200px] flex-shrink-0 snap-center group/card bg-white border border-black/5 rounded-[1.5rem] p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-[#f8fbf8] rounded-[1.25rem] h-32 sm:h-36 mb-3 overflow-hidden relative flex items-center justify-center border border-black/[0.02]">
                        {productImage ? (
                          <img src={productImage} alt={item.name} className="w-[85%] h-[85%] object-contain transition-transform duration-500" />
                        ) : (
                          <div className="w-[85%] h-[85%] flex items-center justify-center bg-[#f0f7f0] rounded-full border border-[#2D5A40]/10">
                            {getCategoryIcon(category)}
                          </div>
                        )}
                        
                        {/* Quantity Badge */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-[#1a3a28] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full z-20 shadow-sm border border-black/5">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="px-2 pb-1">
                        <p className="font-bold text-[#1a3a28] truncate text-sm mb-1">{item.name}</p>
                        <p className="text-[#2D5A40] font-bold text-sm">₹{item.price * item.quantity}</p>
                      </div>
                    </Link>
                  )})}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-[#a8d3b8] rounded-[1.5rem] p-6 sm:p-8 text-center relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 bg-[#eaf2eb] rounded-full flex items-center justify-center mb-3 border-2 border-white shadow-sm">
                  <Leaf className="w-5 h-5 text-[#2D5A40]" />
                </div>
                <h4 className="text-lg font-serif text-[#1a3a28] font-bold mb-1">Your pantry is waiting</h4>
                <p className="text-[#4a392f] text-xs sm:text-sm opacity-80 mb-5 max-w-sm mx-auto leading-relaxed">
                  Start filling your virtual shelves with our natural, stone-ground products and traditional wellness items.
                </p>
                <Link to="/products" className="inline-flex items-center gap-1.5 bg-[#1a3a28] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#2D5A40] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  Explore Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ROW 1: Wisdom of Millets */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-[#1a3a28]/5 relative overflow-hidden group h-full flex flex-col">
            
            <h3 className="text-xl font-serif font-bold text-[#1a3a28] mb-6 flex items-center gap-3 relative z-10">
              <div className="bg-[#eaf2eb] p-2.5 rounded-2xl shadow-sm border border-white">
                <Wheat className="w-5 h-5 text-[#2D5A40]" />
              </div>
              Wisdom of Millets
            </h3>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="p-4 bg-[#f8fbf8] rounded-2xl border border-[#a8d3b8]/30 mb-6">
                <h4 className="font-bold text-[#1a3a28] mb-2 flex items-center gap-2">
                  {milletFact.title}
                  <span className="bg-[#eaf2eb] text-[#2D5A40] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Daily Fact</span>
                </h4>
                <p className="text-sm text-[#4a392f] opacity-80 leading-relaxed">
                  {milletFact.desc}
                </p>
              </div>
              
              <Link to="/products?category=flours" className="mt-auto w-full block text-center border-2 border-[#1a3a28] text-[#1a3a28] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#1a3a28] hover:text-white transition-colors">
                Shop Millets
              </Link>
            </div>
          </div>
        </div>

        {/* ROW 2: Spotlight Category */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-[#1a3a28] rounded-[2rem] p-8 sm:p-10 shadow-xl relative overflow-hidden text-white group h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-125"></div>
            
            <span className="bg-white/10 backdrop-blur-md text-[#a8d3b8] border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold mb-6 inline-flex items-center uppercase tracking-wider w-max">
              Community Favorite
            </span>

            <h3 className="text-4xl font-serif font-bold mb-4 leading-tight relative z-10">{categories[0].name}</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-[200px] sm:max-w-md mb-8 relative z-10">
              Currently loved by our community. Wholesome, stone-ground flours to bring the forgotten flavors of our ancestors back to your modern kitchen.
            </p>

            <div className="flex items-center gap-4 relative z-10">
              <Link to={`/products?category=${categories[0].slug}`}>
                <button className="bg-white text-[#1a3a28] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#eaf2eb] transition-colors shadow-lg cursor-pointer">
                  Shop {categories[0].name}
                </button>
              </Link>
            </div>
            
            <img 
              src={categories[0].image} 
              alt={categories[0].name} 
              className="absolute -right-6 -bottom-6 w-40 h-40 sm:-right-10 sm:-bottom-10 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain drop-shadow-2xl opacity-30 sm:opacity-90 pointer-events-none transition-all duration-700 z-0" 
            />
          </div>
        </div>

        {/* ROW 2: Quick Categories */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4 h-full">
            {categories.slice(0, 4).map((cat) => (
              <Link 
                to={`/products?category=${cat.slug}`} 
                key={cat.slug}
                className={`${cat.color} rounded-3xl p-5 relative overflow-hidden group flex flex-col h-full min-h-[160px] shadow-sm border border-black/5 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent z-0"></div>
                <h4 className="text-white font-bold z-10 text-sm leading-tight mb-auto drop-shadow-md">
                  {cat.name}
                </h4>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute -right-4 -bottom-4 w-28 h-28 object-contain z-0 drop-shadow-lg transition-all duration-500" 
                />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------------------------------------------------
// GUEST VIEW - THE ORIGINAL SECTIONS
// ---------------------------------------------------------
function GuestSections({ categories }) {
  // Section 3: Categories Parallax
  const sec3Ref = useRef(null);
  const { scrollYProgress: sec3Progress } = useScroll({ target: sec3Ref, offset: ["start end", "end start"] });
  const sec3BgYDown = useTransform(sec3Progress, [0, 1], [-200, 200]);
  const sec3TextY = useTransform(sec3Progress, [0, 1], [100, -100]);

  // Section 4: Bento Grid Parallax
  const sec4Ref = useRef(null);
  const { scrollYProgress: sec4Progress } = useScroll({ target: sec4Ref, offset: ["start end", "end start"] });
  const bento1Y = useTransform(sec4Progress, [0, 1], [50, -50]);

  // Section 5: CTA Parallax
  const sec5Ref = useRef(null);
  const { scrollYProgress: sec5Progress } = useScroll({ target: sec5Ref, offset: ["start end", "end end"] });
  const ctaScale = useTransform(sec5Progress, [0, 1], [0.85, 1]);
  const ctaBgYUp = useTransform(sec5Progress, [0, 1], [150, -150]);

  const scrollContainer = useRef(null);
  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* SECTION 2 — MARQUEE STRIP */}
      <section className="bg-[#eaf2eb] text-[#1a3a28] py-4 overflow-hidden whitespace-nowrap border-y border-[#2D5A40]/10">
        <motion.div 
          className="flex space-x-8 text-lg font-bold items-center w-max"
          animate={{ x: [0, "-33.3333%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 flex-shrink-0">
              <span className="flex items-center gap-2"><Wheat size={20} className="text-[#2D5A40]" /> Millet Laddus</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2"><Coffee size={20} className="text-[#2D5A40]" /> Herbal Teas</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2">Traditional Podis</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2"><Droplets size={20} className="text-[#2D5A40]" /> Herbal Care</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2"><Wheat size={20} className="text-[#2D5A40]" /> Millet Flours</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2">Natural Snacks</span> <span className="text-sm opacity-30">•</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 3 — CATEGORIES SCROLL */}
      <section ref={sec3Ref} className="relative min-h-dvh flex flex-col justify-center py-20 bg-gradient-to-b from-[#eaf2eb] to-[#eaf2eb] overflow-hidden w-full group">
        <motion.div style={{ y: sec3BgYDown }} className="absolute -right-20 bottom-10 pointer-events-none z-0">
          <Heart className="w-96 h-96 text-[#8B1A1A] opacity-[0.03] transition-transform duration-1000 group-hover:-rotate-12" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-16">
          <motion.div style={{ y: sec3TextY }} className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16">
            <div className="max-w-2xl">
              <span className="text-[#8B1A1A] font-medium tracking-wider uppercase text-xs sm:text-sm mb-3 flex items-center">
                Our Offerings
              </span>
              <h2 className="text-[#1a3a28] text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-6">What We Make</h2>
              <p className="text-[#4a392f] text-sm sm:text-base md:text-lg opacity-90 leading-relaxed font-medium">
                From nourishing millet flours to rejuvenating herbal drinks, every product is carefully handcrafted. We bring the pure essence of traditional Tamil wisdom directly to your modern kitchen.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex-shrink-0 flex items-center gap-4">
              <div className="hidden md:flex gap-3 mr-2">
                <button onClick={() => scroll('left')} className="p-3 rounded-full border-2 border-[#1a3a28]/10 text-[#1a3a28] hover:bg-[#1a3a28] hover:border-[#1a3a28] hover:text-white transition-all duration-300">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scroll('right')} className="p-3 rounded-full border-2 border-[#1a3a28]/10 text-[#1a3a28] hover:bg-[#1a3a28] hover:border-[#1a3a28] hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <Link to="/products">
                <motion.button whileHover={{ scale: 1.05 }} className="bg-white border-2 border-[#1a3a28] text-[#1a3a28] px-8 py-3.5 rounded-full font-bold hover:bg-[#1a3a28] hover:text-white transition-colors shadow-sm">
                  Explore All
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          <div ref={scrollContainer} className="flex overflow-x-auto gap-4 md:gap-6 pb-12 pt-4 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scroll-smooth">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.slug}`} key={cat.slug} className="shrink-0 snap-center">
                <motion.div 
                  className={`${cat.color} w-44 h-64 sm:w-56 sm:h-80 md:w-72 md:h-[26rem] rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex flex-col cursor-pointer border border-black/5 group-hover:shadow-2xl transition-all duration-300`}
                  whileHover={{ y: -10, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-0"></div>
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl text-left z-10 w-full drop-shadow-md leading-tight mb-auto">
                    {cat.name}
                  </h3>
                  <motion.img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute -bottom-12 right-[-25%] w-[160%] h-[85%] md:h-[90%] object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-0 pointer-events-none transition-transform duration-700" 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY CHOOSE US */}
      <section ref={sec4Ref} className="bg-[#1a3a28] min-h-dvh flex flex-col justify-center py-12 sm:py-20 relative overflow-hidden text-[#FDFAF5]">
        <motion.div style={{ y: bento1Y }} className="absolute -left-40 top-20 pointer-events-none opacity-[0.03]">
          <Leaf className="w-[500px] h-[500px]" />
        </motion.div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div>
              <span className="text-[#a8d3b8] font-medium tracking-wider uppercase text-xs sm:text-sm mb-3 flex items-center gap-2">
                <Sparkles size={16} /> The Thaaragai Standard
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                Beyond <br className="hidden md:block" /> Organic.
              </h2>
            </div>
            <div className="max-w-sm pb-1">
              <p className="text-[#a8d3b8] text-sm sm:text-base leading-relaxed">
                We don't just sell products; we share our heritage. Here is our unwavering promise to you and your family.
              </p>
            </div>
          </div>

          <div className="flex flex-col border-t border-white/10">
            {[
              { num: '01', title: 'Homemade with Love', desc: 'No massive factories, no artificial preservatives. Every product is crafted with the same authentic care and attention as food made in your own kitchen.', icon: Heart },
              { num: '02', title: '100% Natural', desc: 'We rely strictly on traditional recipes passed down through generations. Zero chemical additives, zero shortcuts. Just pure, unadulterated nature.', icon: Droplets },
              { num: '03', title: 'Fresh on Order', desc: 'We don\'t believe in aged inventory. Your order is prepared fresh specifically for you, ensuring maximum nutritional value and taste upon arrival.', icon: Package }
            ].map((pillar) => (
              <div key={pillar.num} className="group border-b border-white/10 py-6 sm:py-10 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-10 group-hover:translate-x-0 pointer-events-none hidden md:block">
                  <pillar.icon className="w-32 h-32 text-[#a8d3b8] opacity-10" />
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 relative z-10">
                  <div className="text-5xl sm:text-7xl font-serif font-bold text-white/10 group-hover:text-white/30 transition-colors duration-500 w-24">
                    {pillar.num}
                  </div>
                  <div className="flex-1 md:pr-40">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 group-hover:text-[#a8d3b8] transition-colors duration-300">{pillar.title}</h3>
                    <p className="text-[#a8d3b8]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER & REVIEWS */}
      <section ref={sec5Ref} className="bg-[#eaf2eb] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-16 relative overflow-hidden">
        <motion.div style={{ scale: ctaScale }} className="max-w-7xl mx-auto bg-[#1a3a28] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 relative overflow-hidden shadow-2xl origin-bottom">
           <motion.div style={{ y: ctaBgYUp }} className="absolute -right-20 -top-20 pointer-events-none z-0 opacity-5">
             <Heart className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] text-white -rotate-12" />
           </motion.div>

           <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-20 relative z-10">
             <div className="flex-1 max-w-2xl w-full">
               <span className="text-[#a8d3b8] tracking-[0.2em] uppercase text-xs sm:text-sm font-bold mb-6 block">
                 Embrace the Tradition
               </span>
               <h2 className="text-white text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mb-6 leading-[1.1]">
                 Pure.<br/>
                 Authentic.<br/>
                 <span className="text-[#a8d3b8] italic font-light tracking-wide">Thaaragai.</span>
               </h2>
               <p className="text-white/70 text-base sm:text-lg mb-10 font-medium leading-relaxed max-w-xl">
                 Take the first step towards a healthier lifestyle. Every product is a piece of our heritage, crafted to nourish your family.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center gap-4">
                 <a href="https://wa.me/919952981365" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                   <button className="bg-white text-[#1a3a28] px-8 py-4 rounded-full font-bold shadow-xl hover:bg-[#eaf2eb] hover:scale-105 transition-all duration-300 w-full flex items-center justify-center gap-3">
                     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                     </svg>
                     Order on WhatsApp
                   </button>
                 </a>
                 <Link to="/products" className="w-full sm:w-auto">
                   <button className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors w-full">
                     View Catalog
                   </button>
                 </Link>
               </div>
             </div>

             <div className="w-full lg:w-[420px] shrink-0">
               <div className="bg-[#eaf2eb] rounded-[2rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-white/40">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#4285F4]/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-[#34A853]/10 rounded-full blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                  
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-8 relative z-10">
                    <div className="flex bg-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-full shadow-sm items-center gap-2 shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="font-bold text-[#1a3a28] text-xs tracking-wide">Reviews</span>
                    </div>
                    <div className="flex text-[#FBBC05] gap-[2px] shrink-0">
                       <Star fill="currentColor" strokeWidth={0} className="w-4 h-4 sm:w-5 sm:h-5"/>
                       <Star fill="currentColor" strokeWidth={0} className="w-4 h-4 sm:w-5 sm:h-5"/>
                       <Star fill="currentColor" strokeWidth={0} className="w-4 h-4 sm:w-5 sm:h-5"/>
                       <Star fill="currentColor" strokeWidth={0} className="w-4 h-4 sm:w-5 sm:h-5"/>
                       <Star fill="currentColor" strokeWidth={0} className="w-4 h-4 sm:w-5 sm:h-5"/>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1a3a28] mb-4 leading-snug">
                    "Authentic taste, exceptional quality. Truly traditional."
                  </h3>
                  <p className="text-[#4a392f] text-sm font-medium mb-8 leading-relaxed opacity-80">
                    Your feedback is the heart of Thaaragai. It helps us grow and keep our traditions alive for everyone.
                  </p>

                  <a href="https://g.page/r/CScIpdbE-YMuEBE/review" target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-3 bg-white border border-[#1a3a28]/10 text-[#1a3a28] py-3.5 rounded-xl font-bold hover:bg-[#1a3a28] hover:text-white hover:border-[#1a3a28] transition-all shadow-sm group/btn">
                    Rate us on Google
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
               </div>
             </div>

           </div>
        </motion.div>
      </section>
    </>
  );
}
