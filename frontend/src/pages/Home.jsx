import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wheat, Coffee, Stethoscope, Cookie, Sparkles, Droplets, Heart, Leaf, Package } from 'lucide-react';
import heroImage from '../assets/product-hero.webp';
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
    { name: 'Millet Flours', slug: 'flours', color: 'bg-[#EACD38]' },
    { name: 'Herbal Drinks', slug: 'beverages', color: 'bg-[#D5B08C]' },
    { name: 'Health Mixes', slug: 'health-mixes', color: 'bg-[#F49A84]' },
    { name: 'Podis', slug: 'podis', color: 'bg-[#F39C12]' },
    { name: 'Laddus', slug: 'laddus', color: 'bg-[#D1AC98]' },
    { name: 'Personal Care', slug: 'personal-care', color: 'bg-[#E97676]' },
  ];

  const scrollContainer = useRef(null);
  useEffect(() => {
    const el = scrollContainer.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="bg-[#FDFAF5] min-h-screen pb-8">
      {/* SECTION 1 — HERO (ROCKSTAR MULTI-LAYER PARALLAX) */}
      <div className="px-2 sm:px-3 lg:px-4 pt-0 pb-8">
        <section ref={heroRef} className="relative h-[calc(100vh-100px)] lg:h-[calc(100vh-110px)] flex flex-col items-center bg-[#cae5d6] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] shadow-sm">
        
        {/* Layer 1: Background Gradient (Scales Up slowly) */}
        <motion.div 
          style={{ scale: bgScale }}
          className="absolute inset-0 bg-gradient-to-br from-[#daefe5] via-[#cae5d6] to-[#9fc2aa] z-0 origin-center"
        >
          {/* Ambient Glows/Blobs for depth behind image */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-white/40 blur-[100px] rounded-full pointer-events-none"></div>
        </motion.div>

        {/* Layer 2: Foreground Text (Moves Up, Scales Down, Fades Out) */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity, scale: textScale }}
          className="absolute top-20 md:top-28 flex flex-col items-center w-full max-w-7xl shrink-0 z-20 origin-top pointer-events-auto"
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
              <span className="inline-flex items-center bg-[#427A5B] text-white px-5 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
                <Leaf size={16} className="mr-2" /> 100% Natural • Homemade • Traditional
              </span>
            </motion.div>
            
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="text-[#0a1f13] font-serif text-2xl sm:text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight w-full drop-shadow-sm max-w-full"
            >
              <span className="block sm:whitespace-nowrap">"இயற்கையில் வேருன்றியது...</span>
              <span className="block sm:whitespace-nowrap">அன்புடன் உருவாக்கப்பட்டது..."</span>
            </motion.h1>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-[#1a3a28] text-sm sm:text-base md:text-xl mb-6 md:mb-10 max-w-2xl font-medium opacity-90 px-4">
              Rooted in Nature, Made with Love.
            </motion.p>
            
            {/* Mobile Action Buttons (Under Subheading) */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} 
              className="flex md:hidden flex-col sm:flex-row gap-3 w-full max-w-sm px-4 relative z-40 pointer-events-auto"
            >
              <Link to="/products" className="w-full">
                <button className="bg-[#1a3a28] text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-[#2D5A40] transition-colors w-full text-sm border border-[#1a3a28]/20 min-h-[44px]">
                  Explore Products
                </button>
              </Link>
              <Link to="/about" className="w-full">
                <button className="bg-white/90 backdrop-blur-md text-[#1a3a28] px-8 py-3 rounded-full font-bold shadow-xl hover:bg-white transition-colors flex items-center justify-center w-full text-sm border border-white/40 min-h-[44px]">
                  <Sparkles size={16} className="mr-2 text-[#2D5A40]" /> Our Story
                </button>
              </Link>
            </motion.div>
            
          </motion.div>
        </motion.div>
        
        {/* Layer 3: Product Image (Scales Up massively towards the user) */}
        <motion.div 
          style={{ scale: imgScale, y: imgY }}
          className="absolute bottom-0 flex-1 w-full max-w-7xl flex justify-center z-10 pointer-events-none h-[45vh] md:h-[55vh] max-h-[300px] md:max-h-none origin-bottom px-4"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <img 
            src={heroImage} 
            alt="Thaaragai Naturals Product" 
            className="w-full h-full object-contain object-bottom drop-shadow-2xl max-w-full"
          />
        </motion.div>

        {/* Layer 4: Action Buttons (Floating Bottom Right on Desktop) */}
        <motion.div 
          className="hidden md:flex absolute right-16 bottom-16 z-30 flex-row gap-4 pointer-events-auto items-center justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Link to="/products">
            <motion.button whileHover={{ scale: 1.05 }} className="bg-[#1a3a28] text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-[#2D5A40] transition-colors w-56 text-lg border border-[#1a3a28]/20 min-h-[44px]">
              Explore Products
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button whileHover={{ scale: 1.05 }} className="bg-white/90 backdrop-blur-md text-[#1a3a28] px-8 py-4 rounded-full font-bold shadow-xl hover:bg-white transition-colors flex items-center justify-center w-56 text-lg border border-white/40 min-h-[44px]">
              <Sparkles size={18} className="mr-2 text-[#2D5A40]" /> Our Story
            </motion.button>
          </Link>
        </motion.div>
        </section>
      </div>

      {/* SECTION 2 — MARQUEE STRIP */}
      <section className="bg-[#2D6A2D] text-white py-3 overflow-hidden whitespace-nowrap">
        <div className="marquee-container flex space-x-8 text-lg font-medium items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-8 marquee-content">
              <span className="flex items-center gap-2"><Wheat size={18} /> Millet Laddus</span> <span className="text-sm opacity-50">•</span>
              <span className="flex items-center gap-2"><Coffee size={18} /> Herbal Teas</span> <span className="text-sm opacity-50">•</span>
              <span className="flex items-center gap-2"><Sparkles size={18} /> Traditional Podis</span> <span className="text-sm opacity-50">•</span>
              <span className="flex items-center gap-2"><Droplets size={18} /> Herbal Care</span> <span className="text-sm opacity-50">•</span>
              <span className="flex items-center gap-2"><Wheat size={18} /> Millet Flours</span> <span className="text-sm opacity-50">•</span>
              <span className="flex items-center gap-2"><Leaf size={18} /> Natural Snacks</span> <span className="text-sm opacity-50">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — CATEGORIES SCROLL */}
      <section ref={sec3Ref} className="relative min-h-screen flex flex-col justify-center py-20 bg-gradient-to-b from-[#FDFAF5] to-[#f5eee3] overflow-hidden w-full group">
        <motion.div style={{ y: sec3BgYUp }} className="absolute -left-20 top-20 pointer-events-none z-0">
          <Leaf className="w-96 h-96 text-[#2D5A40] opacity-[0.03] transition-transform duration-1000 group-hover:rotate-12" />
        </motion.div>
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
                  className={`${cat.color} w-44 h-64 sm:w-56 sm:h-80 md:w-72 md:h-[26rem] rounded-[2rem] p-6 md:p-8 relative overflow-hidden flex flex-col cursor-pointer`}
                  whileHover={{ y: -10, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)" }}
                >
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl text-left z-10 w-full drop-shadow-md leading-tight">
                    {cat.name}
                  </h3>
                  <img 
                    src={heroImage} 
                    alt={cat.name} 
                    className="absolute bottom-4 right-[-15%] w-[120%] h-[55%] md:h-[60%] object-contain drop-shadow-2xl z-0 pointer-events-none" 
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
              <Sparkles size={16} className="mr-2 text-[#EACD38]"/> Our Promise
            </span>
            <h2 className="text-[#1a3a28] text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-center">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 sm:gap-5 lg:gap-6">
            {/* Card 1: Full Width on Mobile, Large on Desktop */}
            <motion.div 
              style={{ y: bento1Y }}
              className="lg:col-span-2 lg:row-span-2 bg-[#2D5A40] p-8 sm:p-10 md:p-14 lg:p-20 rounded-[2rem] sm:rounded-[3rem] flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm origin-center"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div style={{ scale: bentoIconScale }} className="absolute -right-10 -bottom-10 pointer-events-none origin-center">
                <Heart className="w-40 h-40 sm:w-96 sm:h-96 text-white opacity-[0.04] transition-transform duration-700" />
              </motion.div>
              <div className="z-10 text-left max-w-xl w-full">
                <div className="bg-white/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-white mb-4">Homemade with Love</h3>
                <p className="text-[#b2d1be] text-sm sm:text-base leading-relaxed">No massive factories, no artificial preservatives. Every product is crafted with the same authentic care and attention as food made in your own kitchen.</p>
              </div>
            </motion.div>

            {/* Card 2: One cell on Desktop */}
            <motion.div 
              style={{ y: bento2Y }}
              className="lg:col-span-1 lg:row-span-1 bg-[#D1AC98] p-6 sm:p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between h-full shadow-sm origin-center min-h-[250px]"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div style={{ scale: bentoIconScale }} className="absolute -right-8 -bottom-8 pointer-events-none origin-center">
                <Leaf className="w-32 h-32 sm:w-48 sm:h-48 text-black opacity-5" />
              </motion.div>
              <div className="z-10">
                <div className="bg-white/40 w-12 h-12 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/30">
                  <Leaf className="w-6 h-6 text-[#1a3a28]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a3a28] mb-3">100% Natural</h3>
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
                <div className="bg-[#8B1A1A]/10 w-12 h-12 rounded-full flex items-center justify-center mb-6 border border-[#8B1A1A]/20">
                  <Package className="w-6 h-6 text-[#8B1A1A]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#8B1A1A] mb-3">Fresh on Order</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Prepared fresh specifically for your order. No aged inventory.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <section ref={sec5Ref} className="bg-[#FDFAF5] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-16 relative overflow-hidden">
        <motion.div style={{ scale: ctaScale }} className="max-w-7xl mx-auto bg-[#1a3a28] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl group origin-bottom">
           <motion.div style={{ y: ctaBgYDown }} className="absolute -left-16 -top-16 pointer-events-none z-0">
             <Leaf className="w-48 h-48 sm:w-[500px] sm:h-[500px] text-white opacity-[0.03] rotate-45 transition-transform duration-1000 group-hover:rotate-90 group-hover:scale-110" />
           </motion.div>
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
