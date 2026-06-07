import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroScene from '../three/HeroScene';
import { Wheat, Coffee, Stethoscope, Cookie, Sparkles, Droplets, Heart, Leaf, Package } from 'lucide-react';
import './Home.css';

export default function Home() {
  const categories = [
    { name: 'Millet Flours', slug: 'flours', desc: 'Dosa, Chapathi & Adai mixes', icon: Wheat },
    { name: 'Herbal Drinks', slug: 'beverages', desc: 'Coffee, teas & health malts', icon: Coffee },
    { name: 'Health Mixes', slug: 'health-mixes', desc: 'Traditional kanji & sattu mavu', icon: Stethoscope },
    { name: 'Podis', slug: 'podis', desc: 'Idli podis & herbal leaf powders', icon: Sparkles },
    { name: 'Laddus', slug: 'laddus', desc: 'Millet & grain laddus', icon: Cookie },
    { name: 'Personal Care', slug: 'personal-care', desc: 'Herbal oils, creams & shampoos', icon: Droplets },
  ];

  return (
    <div className="bg-[#FDFAF5] min-h-screen">
      {/* SECTION 1 — HERO */}
      <section className="h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2">
        <motion.div 
          className="flex flex-col justify-center px-8 md:px-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <span className="inline-block bg-green-100 text-[#2D6A2D] px-4 py-1 rounded-full text-sm font-semibold mb-6">
              100% Natural • Homemade • Traditional
            </span>
          </motion.div>
          
          <motion.h1 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-[#8B1A1A] text-6xl font-bold font-serif mb-2">
            Thaaragai
          </motion.h1>
          
          <motion.h2 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-[#2D6A2D] text-5xl font-serif mb-4">
            Naturals
          </motion.h2>
          
          <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="italic text-gray-600 mb-2">
            "இயற்கையில் வேருன்றியது... அன்புடன் உருவாக்கப்பட்டது..."
          </motion.p>
          
          <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-gray-700 text-lg mb-8">
            Rooted in Nature... Made with Love...
          </motion.p>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex space-x-4">
            <Link to="/products">
              <motion.button whileHover={{ scale: 1.05 }} className="bg-[#8B1A1A] text-white px-8 py-3 rounded-md font-medium shadow-lg hover:bg-red-900 transition-colors">
                Explore Products
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button whileHover={{ scale: 1.05 }} className="border-2 border-[#2D6A2D] text-[#2D6A2D] px-8 py-3 rounded-md font-medium hover:bg-green-50 transition-colors">
                Our Story
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        <div className="hidden md:block w-full h-full">
          <HeroScene />
        </div>
      </section>

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

      {/* SECTION 3 — CATEGORIES GRID */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <h2 className="text-center text-[#8B1A1A] text-4xl font-serif font-bold mb-12">What We Make</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link to={`/products?category=${cat.slug}`} key={cat.slug}>
                <motion.div 
                  className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all duration-300 h-full"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", borderColor: "#2D6A2D" }}
                >
                  <Icon className="w-12 h-12 text-[#2D6A2D] mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
                  <p className="text-gray-600 text-sm">{cat.desc}</p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 — WHY CHOOSE US */}
      <section className="bg-[#f0f7f0] py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <Heart className="w-12 h-12 text-[#8B1A1A] mb-4" />
              <h3 className="text-xl font-bold text-[#2D6A2D] mb-2">Homemade with Love</h3>
              <p className="text-gray-600">No factory, no preservatives</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <Leaf className="w-12 h-12 text-[#8B1A1A] mb-4" />
              <h3 className="text-xl font-bold text-[#2D6A2D] mb-2">100% Natural</h3>
              <p className="text-gray-600">Traditional Tamil recipes</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <Package className="w-12 h-12 text-[#8B1A1A] mb-4" />
              <h3 className="text-xl font-bold text-[#2D6A2D] mb-2">Fresh on Order</h3>
              <p className="text-gray-600">Made fresh for every order</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA BANNER */}
      <section className="bg-[#8B1A1A] w-full py-16 px-8 text-center">
        <h2 className="text-white text-3xl md:text-4xl font-serif font-bold mb-4">Ready to eat healthy the traditional way?</h2>
        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">Order now via WhatsApp or browse our full catalog</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="https://wa.me/919952981365" target="_blank" rel="noopener noreferrer">
            <button className="bg-[#25D366] text-white px-8 py-3 rounded-md font-bold shadow-lg hover:bg-green-600 transition-colors w-full sm:w-auto">
              Order on WhatsApp
            </button>
          </a>
          <Link to="/products">
            <button className="border-2 border-white text-white px-8 py-3 rounded-md font-bold hover:bg-white hover:text-[#8B1A1A] transition-colors w-full sm:w-auto">
              Browse Products
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
