import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import VerifyOTP from './pages/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute';

function ConditionalFooter() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/register', '/admin', '/cart', '/orders', '/products'];
  
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyOTP />} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <ConditionalFooter />
    </Router>
  );
}

export default App;
