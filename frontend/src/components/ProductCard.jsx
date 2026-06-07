import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wheat, Coffee, Stethoscope, Sparkles, Cookie, Package, Box, Droplets } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const categoryIcons = {
  'flours': Wheat,
  'beverages': Coffee,
  'health-mixes': Stethoscope,
  'podis': Sparkles,
  'laddus': Cookie,
  'snacks': Package,
  'pickles': Box,
  'personal-care': Droplets
};

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const Icon = categoryIcons[product.category] || Package;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl shadow-md border border-transparent hover:border-[#2D6A2D] hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Top section (image area) */}
      <div className="bg-[#f0f7f0] rounded-t-2xl h-40 flex items-center justify-center">
        <Icon className="w-16 h-16 text-[#2D6A2D]" />
      </div>

      {/* Bottom section (details) */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-2">
            {product.name}
          </h3>
          {product.weight && product.weight !== 'null' && (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-3">
              {product.weight}
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-3">
            {product.price > 0 ? (
              <span className="text-[#8B1A1A] font-bold text-lg">₹{product.price}</span>
            ) : (
              <span className="text-gray-500 italic text-sm">Price on request</span>
            )}
          </div>

          {product.price > 0 ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 rounded-xl font-medium transition-colors ${
                added ? 'bg-green-600 text-white' : 'bg-[#8B1A1A] text-white hover:bg-red-900'
              }`}
            >
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
          ) : (
            <a
              href={`https://wa.me/919952981365?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 rounded-xl bg-[#25D366] text-white font-medium hover:bg-green-600 transition-colors"
            >
              Enquire on WhatsApp
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
