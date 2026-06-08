import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1f13] text-[#e0e8e3] pt-20 pb-10 border-t border-[#1a3a28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        
        {/* Brand - Span 4 */}
        <div className="md:col-span-5 lg:col-span-4">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">Thaaragai <span className="text-[#a8d3b8] italic">Naturals</span></h2>
          <p className="text-[#a8d3b8] italic mb-6 text-lg">"Rooted in Nature... Made with Love..."</p>
          <p className="text-[#a8d3b8]/70 text-sm font-medium leading-relaxed max-w-sm">
            Bringing the pure essence of traditional Tamil wisdom to your modern kitchen. Crafted with love in Ramanathapuram.
          </p>
        </div>

        {/* Space filler / Spacing */}
        <div className="hidden lg:block lg:col-span-2"></div>

        {/* Quick Links - Span 3 */}
        <div className="md:col-span-3 lg:col-span-3">
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Explore</h3>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-[#a8d3b8]/80 hover:text-white transition-colors flex items-center group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EACD38] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-[#a8d3b8]/80 hover:text-white transition-colors flex items-center group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EACD38] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Our Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#a8d3b8]/80 hover:text-white transition-colors flex items-center group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EACD38] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Our Story
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact - Span 4 */}
        <div className="md:col-span-4 lg:col-span-3">
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
                  <p className="text-[#a8d3b8] group-hover:text-white transition-colors font-medium">thaaragainaturals<br/>@gmail.com</p>
                </div>
              </a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-[#1a3a28] flex flex-col md:flex-row items-center justify-between text-sm text-[#a8d3b8]/50">
        <p>© {new Date().getFullYear()} Thaaragai Naturals. All rights reserved.</p>
        <p className="mt-3 md:mt-0 tracking-wide font-medium">Natural • Homemade • Traditional</p>
      </div>
    </footer>
  );
}
