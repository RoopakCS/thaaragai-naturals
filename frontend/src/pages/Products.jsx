import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, PackageOpen } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { id: 'All', label: 'All Offerings' },
  { id: 'flours', label: 'Millet Flours' },
  { id: 'beverages', label: 'Herbal Drinks' },
  { id: 'health-mixes', label: 'Health Mixes' },
  { id: 'podis', label: 'Traditional Podis' },
  { id: 'laddus', label: 'Millet Laddus' },
  { id: 'snacks', label: 'Natural Snacks' },
  { id: 'pickles', label: 'Homemade Pickles' },
  { id: 'personal-care', label: 'Personal Care' }
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Name: A to Z' },
  { id: 'name-desc', label: 'Name: Z to A' }
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    
    // Category Filter
    if (currentCategory !== 'All') {
      result = result.filter(p => p.category === currentCategory);
    }
    
    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    
    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    return result;
  }, [products, currentCategory, searchQuery, sortOption]);

  const setCategory = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex flex-col bg-[#FDFAF5] pb-24">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#1a3a28] rounded-b-[3rem] lg:rounded-b-[4rem] text-white pt-24 pb-40 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">Our Complete Catalog.</h1>
          <p className="text-[#a8d3b8] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore our range of 100% natural, homemade products crafted with traditional Tamil wisdom.
          </p>
        </div>
      </section>

      {/* 2. OVERLAPPING CONTENT (FILTER + GRID) */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 md:px-8 -mt-24 flex-grow flex flex-col">
        
        {/* FILTER & SORT BAR */}
        <div className="sticky top-[100px] z-40 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-[2rem] transition-all mb-12">
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Categories Scroll */}
          <div className="flex overflow-x-auto space-x-2 pb-2 lg:pb-0 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  currentCategory === cat.id
                    ? 'bg-[#2D5A40] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-sm font-medium focus:outline-none focus:border-[#2D5A40] focus:ring-1 focus:ring-[#2D5A40] w-full sm:w-56 transition-all"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="appearance-none bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 px-5 py-2.5 pr-10 rounded-full text-sm font-bold border border-transparent focus:border-[#2D5A40] focus:outline-none focus:ring-1 focus:ring-[#2D5A40] flex items-center justify-between w-full sm:w-48"
              >
                <span className="truncate">{SORT_OPTIONS.find(o => o.id === sortOption)?.label}</span>
              </button>
              <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-full sm:w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2 transform origin-top-right animate-in fade-in zoom-in duration-200">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortOption(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${sortOption === opt.id ? 'bg-[#1a3a28] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
        </div>
      </div>

        {/* PRODUCT GRID */}
        <div className="flex-grow">
          {loading ? (
          <div className="flex flex-col justify-center items-center h-64 text-[#2D5A40]">
            <div className="w-12 h-12 border-4 border-[#2D5A40] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold">Loading Catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-24 px-4">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                  <PackageOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1a3a28] mb-2">No products found</h3>
                <p className="text-gray-500 max-w-md">We couldn't find anything matching "{searchQuery}" in this category. Try adjusting your search or filters.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setCategory('All'); setSortOption('default'); }}
                  className="mt-6 bg-[#2D5A40] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#1a3a28] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
