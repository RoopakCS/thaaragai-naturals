import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#041209] text-white pt-24 md:pt-32 pb-8 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#a8d3b8]/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#a8d3b8]/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Left side: The Mission / CTA (Span 7) */}
          <div className="lg:col-span-7 pr-0 lg:pr-12">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif mb-8 leading-[1.1] tracking-tight">
              Nourish your <span className="text-[#a8d3b8] italic">body</span>,<br />
              return to your <span className="text-[#a8d3b8] italic">roots</span>.
            </h2>
            <p className="text-[#a8d3b8]/80 text-lg sm:text-xl font-light mb-12 max-w-lg leading-relaxed">
              Experience the pure essence of traditional Tamil wisdom, crafted with love in Ramanathapuram.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-between gap-6 bg-white text-[#041209] px-2 py-2 pr-6 rounded-full text-sm font-bold tracking-wide hover:bg-[#a8d3b8] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,211,184,0.15)] group w-fit"
              >
                <span className="bg-[#041209] text-white p-3 rounded-full group-hover:bg-white group-hover:text-[#041209] transition-colors duration-300">
                  <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </span>
                <span className="pl-2 uppercase tracking-widest">Shop the Collection</span>
              </Link>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a href="#" aria-label="Facebook" className="p-3.5 bg-white/5 border border-white/10 rounded-full hover:bg-[#a8d3b8] hover:border-[#a8d3b8] hover:text-[#041209] transition-all duration-300 text-white/80 group flex items-center justify-center">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="p-3.5 bg-white/5 border border-white/10 rounded-full hover:bg-[#a8d3b8] hover:border-[#a8d3b8] hover:text-[#041209] transition-all duration-300 text-white/80 group flex items-center justify-center">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right side: Links & Contact (Span 5) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 lg:gap-12 pt-4">
            
            {/* Explore */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#a8d3b8]/50 mb-8 font-semibold">Explore</h3>
              <ul className="space-y-5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Our Products', path: '/products' },
                  { name: 'Our Story', path: '/about' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="text-lg font-medium text-white/80 hover:text-white transition-all inline-flex items-center gap-3 group"
                    >
                      <span className="w-0 h-[2px] bg-[#a8d3b8] transition-all duration-300 group-hover:w-4"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#a8d3b8]/50 mb-8 font-semibold">Reach Us</h3>
              <ul className="space-y-8">
                <li>
                  <a href="mailto:thaaragainaturals@gmail.com" className="group flex flex-col items-start">
                    <span className="text-[11px] uppercase tracking-widest text-[#a8d3b8]/60 mb-2 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5"/> Email
                    </span>
                    <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-[#a8d3b8] transition-colors">
                      thaaragainaturals<br className="hidden lg:block xl:hidden"/>@gmail.com
                    </span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919952981365" className="group flex flex-col items-start">
                    <span className="text-[11px] uppercase tracking-widest text-[#a8d3b8]/60 mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5"/> WhatsApp / Call
                    </span>
                    <span className="text-sm md:text-base font-medium text-white/80 group-hover:text-[#a8d3b8] transition-colors">
                      +91 99529 81365
                    </span>
                  </a>
                </li>
                <li>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] uppercase tracking-widest text-[#a8d3b8]/60 mb-2 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5"/> Location
                    </span>
                    <span className="text-sm md:text-base font-medium text-white/80 leading-relaxed">
                      Ramanathapuram,<br/>Tamil Nadu
                    </span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Logo Bottom Area */}
        <div className="border-t border-white/10 pt-12 flex flex-col items-center relative mt-4">
          
          <div className="flex flex-col items-center relative z-10 w-full mb-8">
            {/* Logo - Center and Big */}
            <img 
              src="/Tharagai.png" 
              alt="Thaaragai Naturals" 
              className="h-24 sm:h-32 md:h-40 w-auto brightness-0 invert opacity-95 transition-transform duration-700 hover:scale-105" 
            />
          </div>

          {/* Copyright Bar - Centered */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-[#a8d3b8]/40 uppercase gap-6 relative z-10 border-t border-white/5 pt-6">
            <p>© {currentYear} Thaaragai Naturals.</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-white transition-colors">Shipping Info</Link>
            </div>
            <p className="flex items-center gap-2">
              Made with <span className="text-[#a8d3b8]">♥</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
