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
      <Navbar />
      <main className="pt-[88px] flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <ConditionalFooter />
    </Router>
  );
}

export default App;
