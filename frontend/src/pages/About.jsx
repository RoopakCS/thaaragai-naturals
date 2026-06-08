import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImage from '../assets/product-hero.webp';
import spllingGhee from '../assets/splling-ghee.webp'
import shopBanner from '../assets/shop-banner.webp'
import { Leaf, Heart, ShieldCheck, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-[#FDFAF5] min-h-screen font-sans pb-24 overflow-hidden">
      
      {/* 1. HERO SECTION (Deep green, image bleeding in from right) */}
      <section className="relative bg-[#1a3a28] rounded-b-[3rem] lg:rounded-b-[4rem] overflow-visible">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-3/5 text-left z-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Bringing traditional wellness <br className="hidden md:block"/> to modern homes
            </h1>
            <p className="text-[#a8d3b8] text-lg md:text-xl mb-10 max-w-lg">
              Create a healthier lifestyle with our 100% natural, homemade products rooted in Tamil heritage.
            </p>
            <Link to="/products" className="inline-block bg-white text-[#1a3a28] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
              View our products
            </Link>
          </div>
          
          <div className="md:w-2/5 relative h-64 md:h-auto w-full mt-12 md:mt-0 z-10">
            {/* Bleeding out-of-box image */}
            <motion.img 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={spllingGhee} 
              alt="Natural Products" 
              className="absolute -right-8 md:-right-32 top-1/2 -translate-y-1/2 w-[140%] max-w-[500px] md:max-w-[700px] object-contain drop-shadow-2xl pointer-events-none"
            />
          </div>
        </div>
      </section>

      {/* 2. OUR MISSION / STORY */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-24 mb-24 md:mt-32 md:mb-32">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
          <div className="md:w-5/12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3a28] mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              We help families turn their daily meals into nutritious, wholesome experiences. 
              Started in Ramanathapuram, our journey began with simple millet laddus made from traditional recipes.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Even in a fast-paced modern world, your health shouldn't take a backseat. We create unique, 
              preservative-free products that boost your well-being.
            </p>
          </div>
          
          <div className="md:w-7/12 w-full relative md:pl-16">
            {/* The background box fits exactly to the image */}
            <div className="bg-[#eaf2eb] rounded-[2rem] w-full shadow-sm flex overflow-hidden">
              <img 
                src={shopBanner} 
                alt="Products" 
                className="w-full h-auto object-cover rounded-[2rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS BAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24 md:mb-32">
        <div className="bg-[#eaf2eb] rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row justify-around items-center gap-12 md:gap-4 text-center">
          <div>
            <div className="text-5xl md:text-7xl font-bold text-[#2D5A40] mb-3 font-serif">100%</div>
            <div className="text-[#1a3a28] font-bold tracking-wide uppercase text-sm">Natural Ingredients</div>
          </div>
          <div className="hidden md:block w-px h-20 bg-[#2D5A40]/20"></div>
          <div>
            <div className="text-5xl md:text-7xl font-bold text-[#2D5A40] mb-3 font-serif">30+</div>
            <div className="text-[#1a3a28] font-bold tracking-wide uppercase text-sm">Unique Products</div>
          </div>
          <div className="hidden md:block w-px h-20 bg-[#2D5A40]/20"></div>
          <div>
            <div className="text-5xl md:text-7xl font-bold text-[#2D5A40] mb-3 font-serif">0</div>
            <div className="text-[#1a3a28] font-bold tracking-wide uppercase text-sm">Chemical Preservatives</div>
          </div>
        </div>
      </section>

      {/* 4. REASONS / FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mb-24 md:mb-32">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          
          <div className="md:w-1/2 flex flex-col">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3a28] mb-10 leading-tight">
              4 reasons why <br className="hidden md:block" /> you can trust us
            </h2>
            <div className="grid grid-cols-1 gap-6 flex-grow">
              
              <div className="bg-[#eaf2eb]/50 p-8 rounded-[2rem]">
                <h3 className="text-xl font-bold text-[#1a3a28] mb-3 flex items-center gap-3">
                   <ShieldCheck className="w-6 h-6 text-[#2D5A40]" /> Purity First
                </h3>
                <p className="text-gray-600 font-medium">We use only the finest natural herbs and grains, maintaining their original goodness for years to come.</p>
              </div>

              <div className="bg-[#eaf2eb]/50 p-8 rounded-[2rem]">
                <h3 className="text-xl font-bold text-[#1a3a28] mb-3 flex items-center gap-3">
                   <Clock className="w-6 h-6 text-[#2D5A40]" /> Fresh on Order
                </h3>
                <p className="text-gray-600 font-medium">We value your health, guaranteeing freshly made batches directly upon your request instead of stocking up.</p>
              </div>

            </div>
          </div>

          <div className="md:w-1/2 flex flex-col gap-6 md:mt-20">
             <div className="bg-[#eaf2eb]/50 p-8 rounded-[2rem]">
                <h3 className="text-xl font-bold text-[#1a3a28] mb-3 flex items-center gap-3">
                   <Heart className="w-6 h-6 text-[#2D5A40]" /> Handcrafted with Love
                </h3>
                <p className="text-gray-600 font-medium">Every product is crafted carefully at home, retaining the authentic taste and nutrition of traditional recipes.</p>
             </div>
             
             {/* Large feature block with image bleeding out top */}
             <div className="bg-[#eaf2eb] p-8 pt-40 md:pt-48 rounded-[2rem] flex-grow relative overflow-visible shadow-sm mt-16 md:mt-24">
                <h3 className="text-xl font-bold text-[#1a3a28] mb-3 flex items-center gap-3 relative z-10">
                   <Leaf className="w-6 h-6 text-[#2D5A40]" /> Wide Variety
                </h3>
                <p className="text-gray-600 font-medium relative z-10 md:max-w-[75%]">From Laddus to Face packs, we offer a vast range of natural solutions tailored to your needs.</p>
                
                <img 
                  src={heroImage} 
                  alt="Variety" 
                  className="absolute bottom-1/2 md:bottom-24 -right-10 md:-right-16 w-64 md:w-80 h-64 md:h-80 object-contain drop-shadow-2xl z-0 pointer-events-none origin-bottom"
                />
             </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT / BOTTOM SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-40 mb-10">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          
          {/* Bleeding Image Container */}
          <div className="md:w-1/2 w-full relative mt-16 md:mt-0 pr-8">
            <div className="bg-[#2D5A40] w-[85%] aspect-square rounded-[3rem] relative shadow-xl">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={heroImage} 
                alt="Contact us" 
                className="absolute bottom-0 -right-16 w-[120%] h-[120%] object-contain drop-shadow-2xl origin-bottom"
              />
            </div>
          </div>

          {/* Form */}
          <div className="md:w-1/2 w-full">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1a3a28] mb-12">Get in touch</h2>
            <form className="flex flex-col gap-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="w-full border-b-2 border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium"
                />
              </div>
              <div className="relative">
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  className="w-full border-b-2 border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium"
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Comment" 
                  className="w-full border-b-2 border-gray-300 py-3 bg-transparent focus:outline-none focus:border-[#2D5A40] transition-colors text-lg text-[#1a3a28] placeholder-gray-400 font-medium"
                />
              </div>
              <button 
                type="button"
                className="bg-[#1a3a28] text-white px-10 py-4 rounded-full font-bold hover:bg-[#2D5A40] transition-colors mt-6 self-start md:w-auto w-full text-lg shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
