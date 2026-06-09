import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wheat, Coffee, Stethoscope, Cookie, Droplets, Heart, Package } from 'lucide-react';
import heroImageDesktop from '../assets/Website Hero Image - Desktop.webp';
import heroImageMobile from '../assets/Website Hero Image - Mobile.webp';
import './Home.css';

export default function Home() {
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
    { name: 'Millet Flours', slug: 'flours', color: 'bg-[#1a3a28]' }, // Deep Green
    { name: 'Herbal Drinks', slug: 'beverages', color: 'bg-[#2D5A40]' }, // Forest Green
    { name: 'Health Mixes', slug: 'health-mixes', color: 'bg-[#8B1A1A]' }, // Deep Maroon
    { name: 'Podis', slug: 'podis', color: 'bg-[#A67B5B]' }, // Warm Earth/Wood
    { name: 'Laddus', slug: 'laddus', color: 'bg-[#D1AC98]' }, // Terracotta/Clay
    { name: 'Personal Care', slug: 'personal-care', color: 'bg-[#4A5D23]' }, // Olive/Matcha
  ];

  const scrollContainer = useRef(null);
  useEffect(() => {
    const el = scrollContainer.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      
      const isAtLeftEdge = el.scrollLeft <= 0;
      const isAtRightEdge = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
      
      // If at the boundary in the direction of scroll, let the page scroll naturally
      if ((isScrollingDown && isAtRightEdge) || (isScrollingUp && isAtLeftEdge)) {
        return;
      }
      
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="bg-[#FDFAF5] min-h-screen pb-8">
      {/* SECTION 1 — HERO (ROCKSTAR MULTI-LAYER PARALLAX) */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section ref={heroRef} className="relative h-[calc(100vh-100px)] lg:h-[calc(100vh-110px)] flex flex-col items-center bg-[#1a3a28] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-xl">
        
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
              className="text-white font-serif text-2xl sm:text-4xl md:text-5xl mb-4 md:mb-6 leading-tight w-full drop-shadow-lg max-w-full px-2 break-words"
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
          className="absolute bottom-0 flex-1 w-full max-w-7xl flex justify-center z-10 pointer-events-none md:h-[65vh] md:max-h-[650px] origin-bottom px-4"
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
            className="block md:hidden w-full h-auto object-contain object-bottom drop-shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
        </section>
      </div>

      {/* SECTION 2 — MARQUEE STRIP */}
      <section className="bg-[#eaf2eb] text-[#1a3a28] py-4 overflow-hidden whitespace-nowrap border-y border-[#2D5A40]/10">
        <div className="marquee-container flex space-x-8 text-lg font-bold items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 marquee-content">
              <span className="flex items-center gap-2"><Wheat size={20} className="text-[#2D5A40]" /> Millet Laddus</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2"><Coffee size={20} className="text-[#2D5A40]" /> Herbal Teas</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2">Traditional Podis</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2"><Droplets size={20} className="text-[#2D5A40]" /> Herbal Care</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2"><Wheat size={20} className="text-[#2D5A40]" /> Millet Flours</span> <span className="text-sm opacity-30">•</span>
              <span className="flex items-center gap-2">Natural Snacks</span> <span className="text-sm opacity-30">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — CATEGORIES SCROLL */}
      <section ref={sec3Ref} className="relative min-h-screen flex flex-col justify-center py-20 bg-gradient-to-b from-[#FDFAF5] to-[#eaf2eb] overflow-hidden w-full group">
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
            <div className="mt-8 md:mt-0 flex-shrink-0">
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
          
          <div ref={scrollContainer} className="flex overflow-x-auto gap-4 md:gap-6 pb-12 pt-4 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => (
              <Link to={`/products?category=${cat.slug}`} key={cat.slug} className="shrink-0 snap-center">
                <motion.div 
                  className={`${cat.color} w-44 h-64 sm:w-56 sm:h-80 md:w-72 md:h-[26rem] rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex flex-col cursor-pointer border border-black/5 group-hover:shadow-2xl transition-all duration-300`}
                  whileHover={{ y: -10, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-0"></div>
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl text-left z-10 w-full drop-shadow-md leading-tight mt-auto md:mt-0 md:mb-auto">
                    {cat.name}
                  </h3>
                  <motion.img 
                    src={heroImageDesktop} 
                    alt={cat.name} 
                    className="absolute bottom-4 right-[-15%] w-[120%] h-[55%] md:h-[60%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-0 pointer-events-none transition-transform duration-700" 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — WHY CHOOSE US (BENTO GRID) */}
      <section ref={sec4Ref} className="bg-[#FDFAF5] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-16 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,90,64,0.03)_0%,transparent_100%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-12 sm:mb-16">
            <span className="text-[#8B1A1A] font-medium tracking-wider uppercase text-xs sm:text-sm mb-3 flex items-center">
              Our Promise
            </span>
            <h2 className="text-[#1a3a28] text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-center">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 sm:gap-5 lg:gap-6">
            {/* Card 1: Full Width on Mobile, Large on Desktop */}
            <motion.div 
              style={{ y: bento1Y }}
              className="lg:col-span-2 lg:row-span-2 bg-[#1a3a28] p-8 sm:p-10 md:p-14 lg:p-20 rounded-[2rem] sm:rounded-[3rem] flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl origin-center border border-[#2D5A40]/30"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div style={{ scale: bentoIconScale }} className="absolute -right-10 -bottom-10 pointer-events-none origin-center">
                <Heart className="w-40 h-40 sm:w-96 sm:h-96 text-white opacity-[0.03] transition-transform duration-700" />
              </motion.div>
              <div className="z-10 text-left max-w-xl w-full">
                <div className="bg-[#2D5A40] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#a8d3b8]" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-4">Homemade with Love</h3>
                <p className="text-[#a8d3b8] text-sm sm:text-base leading-relaxed">No massive factories, no artificial preservatives. Every product is crafted with the same authentic care and attention as food made in your own kitchen.</p>
              </div>
            </motion.div>

            {/* Card 2: One cell on Desktop */}
            <motion.div 
              style={{ y: bento2Y }}
              className="lg:col-span-1 lg:row-span-1 bg-[#eaf2eb] p-6 sm:p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-full shadow-sm origin-center min-h-[250px] border border-[#2D5A40]/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="z-10">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#2D5A40]/10">
                  <Droplets className="w-6 h-6 text-[#2D5A40]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a3a28] mb-3">Natural</h3>
                <p className="text-sm sm:text-base text-[#4a392f] font-medium leading-relaxed">Traditional recipes passed down without any chemical additives.</p>
              </div>
            </motion.div>

            {/* Card 3: One cell on Desktop */}
            <motion.div 
              style={{ y: bento3Y }}
              className="lg:col-span-1 lg:row-span-1 bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-full origin-center min-h-[250px]"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div style={{ scale: bentoIconScale }} className="absolute -right-8 -bottom-8 pointer-events-none origin-center">
                <Package className="w-32 h-32 sm:w-48 sm:h-48 text-[#8B1A1A] opacity-5" />
              </motion.div>
              <div className="z-10">
                <div className="bg-[#FDFAF5] w-12 h-12 rounded-full flex items-center justify-center mb-6 border border-[#8B1A1A]/10">
                  <Package className="w-6 h-6 text-[#8B1A1A]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#8B1A1A] mb-3">Fresh on Order</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">Prepared fresh specifically for your order. No aged inventory.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <section ref={sec5Ref} className="bg-[#FDFAF5] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-16 relative overflow-hidden">
        <motion.div style={{ scale: ctaScale }} className="max-w-7xl mx-auto bg-[#1a3a28] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl group origin-bottom">
           <motion.div style={{ y: ctaBgYUp }} className="absolute -right-16 -bottom-16 pointer-events-none z-0">
             <Heart className="w-48 h-48 sm:w-[500px] sm:h-[500px] text-white opacity-[0.03] -rotate-12 transition-transform duration-1000 group-hover:-rotate-45 group-hover:scale-110" />
           </motion.div>
           
           <h2 className="text-white text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-serif font-bold mb-6 relative z-10 leading-tight">
             Ready to experience <br className="hidden md:block"/> traditional wellness?
           </h2>
           <p className="text-[#a8d3b8] text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto relative z-10 font-medium leading-relaxed">
             Take the first step towards a healthier lifestyle. Order directly via WhatsApp or browse our complete catalog of natural products.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
             <a href="https://wa.me/919952981365" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 className="bg-[#25D366] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#1fa952] transition-colors w-full flex items-center justify-center text-sm sm:text-base min-h-[44px]"
               >
                 Order on WhatsApp
               </motion.button>
             </a>
             <Link to="/products" className="w-full sm:w-auto">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 className="bg-transparent border-2 border-white/80 text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-[#1a3a28] transition-colors w-full text-sm sm:text-base min-h-[44px]"
               >
                 View Catalog
               </motion.button>
             </Link>
           </div>
        </motion.div>
      </section>
    </div>
  );
}
