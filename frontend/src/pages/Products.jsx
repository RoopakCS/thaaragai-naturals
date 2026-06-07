import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'flours', label: 'Flours' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'health-mixes', label: 'Health Mixes' },
  { id: 'podis', label: 'Podis' },
  { id: 'laddus', label: 'Laddus' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'pickles', label: 'Pickles' },
  { id: 'personal-care', label: 'Personal Care' }
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (currentCategory === 'All') return products;
    return products.filter(p => p.category === currentCategory);
  }, [products, currentCategory]);

  const setCategory = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF5]">
      {/* CATEGORY FILTER BAR */}
      <div className="sticky top-16 z-40 bg-white shadow-sm py-3 px-4">
        <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                currentCategory === cat.id
                  ? 'bg-[#8B1A1A] text-white'
                  : 'border border-[#2D6A2D] text-[#2D6A2D] hover:bg-green-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#2D6A2D] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                No products found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
