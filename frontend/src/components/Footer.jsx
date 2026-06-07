import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-[#FDFAF5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#FDFAF5] mb-2">Thaaragai Naturals</h2>
          <p className="text-gray-400 italic mb-4">"Rooted in Nature... Made with Love..."</p>
          <p className="text-sm font-medium">Made with ❤️ in Ramanathapuram</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 w-fit">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2 w-fit">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3 text-gray-400">
              <Phone className="w-5 h-5 text-[#2D6A2D]" />
              <span>+91 99529 81365</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400">
              <Mail className="w-5 h-5 text-[#8B1A1A]" />
              <span>thaaragainaturals@gmail.com</span>
            </li>
            {/* <li className="flex items-center space-x-3 text-gray-400">
              <Instagram className="w-5 h-5 text-[#8B1A1A]" />
              <a href="#" className="hover:text-white transition-colors">@thaaragai.naturals</a>
            </li> */}
          </ul>
        </div>

      </div>
      
      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        © 2025 Thaaragai Naturals. All rights reserved.
      </div>
    </footer>
  );
}
