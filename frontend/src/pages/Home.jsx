import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wheat, Coffee, Stethoscope, Cookie, Droplets, Heart, Package, Leaf, Sparkles, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import heroImageDesktop from '../assets/Website Hero Image - Desktop.webp';
import heroImageMobile from '../assets/Website Hero Image - Mobile.webp';
import dosaMaavuImg from '../assets/category images/siruthaniya-dosa-maavu.webp';
import gheeImg from '../assets/category images/ghee.webp';
import chappathiMaavuImg from '../assets/category images/siruthaniya-chappathi-maavu.webp';
import idlyPodiImg from '../assets/category images/Idly Podi.webp';
import laddusImg from '../assets/category images/millet-laddus-big.webp';
import nalunguMaavuImg from '../assets/category images/nalungu-maavu.webp';
import './Home.css';

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

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

  // Section 3: Categories Parallax
  const sec3Ref = useRef(null);
  const { scrollYProgress: sec3Progress } = useScroll({ target: sec3Ref, offset: ["start end", "end start"] });
  const sec3BgYUp = useTransform(sec3Progress, [0, 1], [200, -200]);
  const sec3BgYDown = useTransform(sec3Progress, [0, 1], [-200, 200]);
  const sec3TextY = useTransform(sec3Progress, [0, 1], [100, -100]);

  // Section 4: Bento Grid Parallax
  const sec4Ref = useRef(null);
  const { scrollYProgress: sec4Progress } = useScroll({ target: sec4Ref, offset: ["start end", "end start"] });
  const bento1Y = useTransform(sec4Progress, [0, 1], [50, -50]);
  const bento2Y = useTransform(sec4Progress, [0, 1], [120, -120]);
  const bento3Y = useTransform(sec4Progress, [0, 1], [80, -80]);
  const bentoIconScale = useTransform(sec4Progress, [0, 1], [0.8, 1.3]);

  // Section 5: CTA Parallax
  const sec5Ref = useRef(null);
  const { scrollYProgress: sec5Progress } = useScroll({ target: sec5Ref, offset: ["start end", "end end"] });
  const ctaScale = useTransform(sec5Progress, [0, 1], [0.85, 1]);
  const ctaBgYUp = useTransform(sec5Progress, [0, 1], [150, -150]);
  const ctaBgYDown = useTransform(sec5Progress, [0, 1], [-150, 150]);

  const categories = [
    { name: 'Millet Flours', slug: 'flours', color: 'bg-[#1a3a28]', image: dosaMaavuImg },
    { name: 'Herbal Drinks', slug: 'beverages', color: 'bg-[#1a3a28]', image: gheeImg },
    { name: 'Health Mixes', slug: 'health-mixes', color: 'bg-[#1a3a28]', image: chappathiMaavuImg },
    { name: 'Podis', slug: 'podis', color: 'bg-[#1a3a28]', image: idlyPodiImg },
    { name: 'Laddus', slug: 'laddus', color: 'bg-[#1a3a28]', image: laddusImg },
    { name: 'Personal Care', slug: 'personal-care', color: 'bg-[#1a3a28]', image: nalunguMaavuImg },
  ];

  const scrollContainer = useRef(null);
  
  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
          {/* Ambient Glows/Blobs for depth behind image */}
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
            
            {/* Action Buttons (Mobile & Desktop) */}
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
              {/* Desktop Scroll Navigation Buttons */}
              <div className="hidden md:flex gap-3 mr-2">
                <button 
                  onClick={() => scroll('left')}
                  className="p-3 rounded-full border-2 border-[#1a3a28]/10 text-[#1a3a28] hover:bg-[#1a3a28] hover:border-[#1a3a28] hover:text-white transition-all duration-300"
                  aria-label="Scroll left"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="p-3 rounded-full border-2 border-[#1a3a28]/10 text-[#1a3a28] hover:bg-[#1a3a28] hover:border-[#1a3a28] hover:text-white transition-all duration-300"
                  aria-label="Scroll right"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <Link to="/products">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white border-2 border-[#1a3a28] text-[#1a3a28] px-8 py-3.5 rounded-full font-bold hover:bg-[#1a3a28] hover:text-white transition-colors shadow-sm"
                >
                  Explore All
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          <div 
            ref={scrollContainer} 
            className="flex overflow-x-auto gap-4 md:gap-6 pb-12 pt-4 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {categories.map((cat) => (
              <Link 
                to={`/products?category=${cat.slug}`} 
                key={cat.slug} 
                className="shrink-0 snap-center"
              >
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

      {/* SECTION 4 — WHY CHOOSE US (EDITORIAL PILLARS) */}
      <section ref={sec4Ref} className="bg-[#1a3a28] min-h-dvh flex flex-col justify-center py-12 sm:py-20 relative overflow-hidden text-[#FDFAF5]">
        {/* Abstract subtle background element */}
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
            {/* Pillar 1 */}
            <div className="group border-b border-white/10 py-6 sm:py-10 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-10 group-hover:translate-x-0 pointer-events-none hidden md:block">
                <Heart className="w-32 h-32 text-[#a8d3b8] opacity-10" />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 relative z-10">
                <div className="text-5xl sm:text-7xl font-serif font-bold text-white/10 group-hover:text-white/30 transition-colors duration-500 w-24">
                  01
                </div>
                <div className="flex-1 md:pr-40">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 group-hover:text-[#a8d3b8] transition-colors duration-300">Homemade with Love</h3>
                  <p className="text-[#a8d3b8]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                    No massive factories, no artificial preservatives. Every product is crafted with the same authentic care and attention as food made in your own kitchen.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group border-b border-white/10 py-6 sm:py-10 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-10 group-hover:translate-x-0 pointer-events-none hidden md:block">
                <Droplets className="w-32 h-32 text-[#a8d3b8] opacity-10" />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 relative z-10">
                <div className="text-5xl sm:text-7xl font-serif font-bold text-white/10 group-hover:text-white/30 transition-colors duration-500 w-24">
                  02
                </div>
                <div className="flex-1 md:pr-40">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 group-hover:text-[#a8d3b8] transition-colors duration-300">100% Natural</h3>
                  <p className="text-[#a8d3b8]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                    We rely strictly on traditional recipes passed down through generations. Zero chemical additives, zero shortcuts. Just pure, unadulterated nature.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group border-b border-white/10 py-6 sm:py-10 relative overflow-hidden transition-all duration-500 hover:bg-white/[0.03]">
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-10 group-hover:translate-x-0 pointer-events-none hidden md:block">
                <Package className="w-32 h-32 text-[#a8d3b8] opacity-10" />
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 relative z-10">
                <div className="text-5xl sm:text-7xl font-serif font-bold text-white/10 group-hover:text-white/30 transition-colors duration-500 w-24">
                  03
                </div>
                <div className="flex-1 md:pr-40">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4 group-hover:text-[#a8d3b8] transition-colors duration-300">Fresh on Order</h3>
                  <p className="text-[#a8d3b8]/80 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                    We don't believe in aged inventory. Your order is prepared fresh specifically for you, ensuring maximum nutritional value and taste upon arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER & REVIEWS */}
      <section ref={sec5Ref} className="bg-[#eaf2eb] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-16 relative overflow-hidden">
        <motion.div style={{ scale: ctaScale }} className="max-w-7xl mx-auto bg-[#1a3a28] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-20 relative overflow-hidden shadow-2xl origin-bottom">
           
           {/* Background Texture/Art */}
           <motion.div style={{ y: ctaBgYUp }} className="absolute -right-20 -top-20 pointer-events-none z-0 opacity-5">
             <Heart className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] text-white -rotate-12" />
           </motion.div>

           <div className="flex flex-col lg:flex-row justify-between items-center gap-16 lg:gap-20 relative z-10">
             
             {/* Left: Huge Typography CTA */}
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

             {/* Right: The Google Review Card */}
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
    </div>
  );
}
