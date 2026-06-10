import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[#eaf2eb] flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl md:text-8xl font-serif font-bold text-[#1a3a28] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-medium text-[#2D5A40] mb-6 text-center">Page Not Found</h2>
      <p className="text-[#4a392f] text-center max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-[#2D6A2D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3a28] transition-colors flex items-center shadow-sm"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
}
