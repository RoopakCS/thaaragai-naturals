import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Footer() {
  const { isAuthenticated } = useAuthStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#041209] text-white pt-24 md:pt-32 pb-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#a8d3b8]/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#a8d3b8]/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (Span 5) */}
          <div className="lg:col-span-5 pr-0 lg:pr-8">
            <img 
              src="/Tharagai.png" 
              alt="Thaaragai Naturals" 
              draggable="false"
              className="h-16 sm:h-20 lg:h-24 w-auto brightness-0 invert opacity-95 mb-6 select-none" 
            />
            <p className="text-[#a8d3b8]/80 text-base sm:text-lg font-light mb-8 max-w-sm leading-relaxed">
              Experience the pure essence of traditional Tamil wisdom, crafted with love in Ramanathapuram.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-between gap-4 bg-white text-[#041209] px-1.5 py-1.5 pr-6 rounded-full text-xs sm:text-sm font-bold tracking-wide hover:bg-[#a8d3b8] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,211,184,0.15)] group w-fit"
              >
                <span className="bg-[#041209] text-white p-2.5 rounded-full group-hover:bg-white group-hover:text-[#041209] transition-colors duration-300">
                  <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </span>
                <span className="pl-1 uppercase tracking-widest">Explore Products</span>
              </Link>
              
              {/* Social Links */}
              <a href="https://instagram.com/thaaragainaturals" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-[#a8d3b8] hover:border-[#a8d3b8] hover:text-[#041209] transition-all duration-300 text-white/80 group flex items-center justify-center">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column (Span 3) */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#a8d3b8]/50 mb-6 font-semibold">Explore</h3>
            <ul className="space-y-4">
              {(isAuthenticated 
                ? [
                    { name: 'Products', path: '/products' },
                    { name: 'My Orders', path: '/orders' },
                    { name: 'Our Story', path: '/about' },
                    { name: 'Contact Us', path: '/contact' }
                  ]
                : [
                    { name: 'Home', path: '/' },
                    { name: 'Our Products', path: '/products' },
                    { name: 'Our Story', path: '/about' },
                    { name: 'Contact Us', path: '/contact' }
                  ]
              ).map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-base font-medium text-white/80 hover:text-[#a8d3b8] transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
            
          {/* Contact Column (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#a8d3b8]/50 mb-6 font-semibold">Reach Us</h3>
            <ul className="space-y-6">
              <li>
                <a href="mailto:thaaragainaturals@gmail.com" className="group flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-widest text-[#a8d3b8]/60 mb-1.5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5"/> Email
                  </span>
                  <span className="text-base font-medium text-white/80 group-hover:text-[#a8d3b8] transition-colors">
                    thaaragainaturals<wbr/>@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a href="tel:+919952981365" className="group flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-widest text-[#a8d3b8]/60 mb-1.5 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5"/> WhatsApp / Call
                  </span>
                  <span className="text-base font-medium text-white/80 group-hover:text-[#a8d3b8] transition-colors">
                    +91 99529 81365
                  </span>
                </a>
              </li>
              <li>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] uppercase tracking-widest text-[#a8d3b8]/60 mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5"/> Location
                  </span>
                  <span className="text-base font-medium text-white/80 leading-relaxed">
                    Vallabai Nagar, 5th Street,<br/> Ramanathapuram, Tamil Nadu - 623504.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-[#a8d3b8]/40 uppercase gap-6 relative z-10 border-t border-white/10 pt-8 mt-12">
          <p>© {currentYear} Thaaragai Naturals.</p>
          <p className="flex items-center gap-2">
            Made with <span className="text-[#a8d3b8]">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
