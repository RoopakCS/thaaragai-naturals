import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f13] text-[#e0e8e3] pt-20 pb-10 border-t border-[#1a3a28] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
        
        {/* Brand - Span 2 on large screens */}
        <div className="sm:col-span-2 lg:col-span-2">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Thaaragai <span className="text-[#a8d3b8] italic">Naturals</span></h2>
          <p className="text-[#a8d3b8] italic mb-6 text-lg">"Rooted in Nature... Made with Love..."</p>
          <p className="text-[#a8d3b8]/70 text-sm font-medium leading-relaxed max-w-sm mb-6">
            Bringing the pure essence of traditional Tamil wisdom to your modern kitchen. Crafted with love in Ramanathapuram.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <a href="#" aria-label="Facebook" className="bg-[#1a3a28] p-2.5 rounded-full hover:bg-[#2D5A40] transition-colors border border-[#2D5A40]/30 text-[#a8d3b8] hover:text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="bg-[#1a3a28] p-2.5 rounded-full hover:bg-[#2D5A40] transition-colors border border-[#2D5A40]/30 text-[#a8d3b8] hover:text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="bg-[#1a3a28] p-2.5 rounded-full hover:bg-[#2D5A40] transition-colors border border-[#2D5A40]/30 text-[#a8d3b8] hover:text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Quick Links - Span 1 */}
        <div className="sm:col-span-1 lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Explore</h3>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-[#a8d3b8]/80 hover:text-white transition-colors flex items-center group">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-[#a8d3b8]/80 hover:text-white transition-colors flex items-center group">
                Our Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#a8d3b8]/80 hover:text-white transition-colors flex items-center group">
                Our Story
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact - Span 1 */}
        <div className="sm:col-span-1 lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Reach Us</h3>
          <ul className="space-y-4">
            <li>
              <a href="tel:+919952981365" className="flex items-start group">
                <div className="bg-[#1a3a28] p-2.5 rounded-xl mr-4 group-hover:bg-[#2D5A40] transition-colors border border-[#2D5A40]/30">
                  <Phone className="w-5 h-5 text-[#a8d3b8] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-[#a8d3b8]/60 uppercase tracking-widest mb-0.5">WhatsApp / Call</p>
                  <p className="text-[#a8d3b8] group-hover:text-white transition-colors font-medium">+91 99529 81365</p>
                </div>
              </a>
            </li>
            <li>
              <a href="mailto:thaaragainaturals@gmail.com" className="flex items-start group">
                <div className="bg-[#1a3a28] p-2.5 rounded-xl mr-4 group-hover:bg-[#2D5A40] transition-colors border border-[#2D5A40]/30">
                  <Mail className="w-5 h-5 text-[#a8d3b8] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] text-[#a8d3b8]/60 uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-[#a8d3b8] group-hover:text-white transition-colors font-medium">thaaragainaturals@gmail.com</p>
                </div>
              </a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-20 pt-8 border-t border-[#1a3a28] flex flex-col md:flex-row items-center justify-between text-sm text-[#a8d3b8]/50 gap-4">
        <p className="text-center md:text-left">© {new Date().getFullYear()} Thaaragai Naturals. All rights reserved.</p>
        <p className="tracking-wide font-medium text-center md:text-right">Natural • Homemade • Traditional</p>
      </div>
    </footer>
  );
}
