import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Orders = lazy(() => import('./pages/Orders'));
const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Wishlist = lazy(() => import('./pages/Wishlist'));

function PageLoader() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#eaf2eb]">
      <Loader2 className="w-8 h-8 text-[#2D6A2D] animate-spin" />
    </div>
  );
}

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/register', '/admin', '/cart', '/orders', '/products', '/wishlist'];
  
  const shouldHide = 
    hideFooterRoutes.includes(location.pathname) || 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/product/');
  
  if (shouldHide) return null;
  return <Footer />;
}

function App() {
  return (
    <Router>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1a3a28] text-white px-4 py-2 rounded-lg z-[100] font-bold">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="pt-[88px] flex-grow flex flex-col overflow-x-hidden w-full">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <ConditionalFooter />
    </Router>
  );
}

export default App;
