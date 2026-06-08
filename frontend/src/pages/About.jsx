import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    { icon: '🌾', title: 'Traditional Recipes', desc: 'Ancient Tamil grain recipes' },
    { icon: '🏠', title: 'Homemade Quality', desc: 'Made in small batches at home' },
    { icon: '🌱', title: 'No Preservatives', desc: 'Pure ingredients only' },
    { icon: '❤️', title: 'Made with Love', desc: 'Every product handcrafted with care' }
  ];

  const highlights = [
    {
      title: 'Millet Laddus',
      desc: '9 varieties of traditional grain laddus, made fresh on order',
      emoji: '🍬'
    },
    {
      title: 'Herbal Beverages',
      desc: 'From Karuppatti coffee to ABC Health Malt, 7 healthy drink mixes',
      emoji: '🍵'
    },
    {
      title: 'Herbal Personal Care',
      desc: 'Natural hair oils, herbal face packs and ayurvedic creams',
      emoji: '🌿'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-[#FDFAF5] min-h-screen">
      {/* SECTION 1 - HERO */}
      <section className="bg-[#2D6A2D] text-white py-20 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-block border border-white/40 rounded-full px-4 py-1 text-sm font-medium mb-6">
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            🌿 Made with Love, Rooted in Tradition 🌿
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            A small family business from Ramanathapuram, bringing traditional Tamil health foods to your doorstep
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 - OUR STORY */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[#8B1A1A] font-bold text-3xl mb-6">How Thaaragai Naturals Began</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                Thaaragai Naturals was born from a mother's love for her family's health. Started in Ramanathapuram, Tamil Nadu, our journey began with simple millet laddus made from traditional family recipes passed down through generations.
              </p>
              <p>
                Every product we make is handcrafted at home with no artificial preservatives, no factory processing — just pure ingredients, traditional methods, and love in every batch.
              </p>
              <p>
                What started as making healthy snacks for family has grown into a mission to bring back forgotten superfoods like millets, traditional herbs, and natural ingredients to modern Tamil households.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#f0f7f0] rounded-2xl p-8 text-center shadow-sm border border-green-100"
          >
            <div className="text-6xl mb-4">🫙</div>
            <h3 className="text-2xl font-bold text-[#2D6A2D] mb-2">Est. with Love</h3>
            <p className="text-gray-600 mb-8">Ramanathapuram, Tamil Nadu</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
              <div>
                <div className="text-2xl font-bold text-[#8B1A1A]">30+</div>
                <div className="text-sm font-medium text-gray-600 mt-1">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#8B1A1A]">100%</div>
                <div className="text-sm font-medium text-gray-600 mt-1">Natural</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#8B1A1A]">0</div>
                <div className="text-sm font-medium text-gray-600 mt-1">Preservatives</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - OUR VALUES */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-[#8B1A1A] font-bold text-3xl mb-12">What We Stand For</h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-white border border-[#2D6A2D] rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 - PRODUCT HIGHLIGHTS */}
      <section className="bg-[#f0f7f0] py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-[#2D6A2D] font-bold text-3xl mb-12">Our Specialties</h2>
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 pb-6 snap-x">
            {highlights.map((highlight, idx) => (
              <div 
                key={idx}
                className="bg-white shadow-md rounded-2xl p-6 min-w-[280px] lg:min-w-0 snap-center flex flex-col items-center text-center border border-transparent hover:border-[#8B1A1A] transition-colors"
              >
                <div className="text-5xl mb-4">{highlight.emoji}</div>
                <h3 className="font-bold text-gray-800 text-xl mb-3">{highlight.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{highlight.desc}</p>
                <Link 
                  to="/products"
                  className="inline-block border-2 border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white px-6 py-2 rounded-xl font-medium transition-colors w-full"
                >
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - CTA */}
      <section className="bg-[#8B1A1A] text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Experience the Taste of Tradition</h2>
          <a 
            href="https://wa.me/919952981365"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
