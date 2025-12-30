
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIStylist from './components/AIStylist';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Collections from './pages/Collections';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import NewIn from './pages/NewIn';
import BestSellers from './pages/BestSellers';
import Sustainability from './pages/Sustainability';
import Shipping from './pages/Shipping';
import SizeGuide from './pages/SizeGuide';
import Privacy from './pages/Privacy';

// Use React.FC with optional children to resolve "children is missing in type {}" error
const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <HelmetProvider>
        <ProductProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="min-h-screen bg-white selection:bg-navy selection:text-white flex flex-col overflow-x-hidden">
                  <Navbar />
                  <main className="flex-1 w-full relative">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/colecoes" element={<Collections />} />
                      <Route path="/categoria/:category" element={<Collections />} />
                      <Route path="/produto/:slug" element={<ProductDetail />} />
                      <Route path="/carrinho" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/cadastro" element={<Login />} />
                      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                      <Route path="/conta" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                      <Route path="/sobre" element={<About />} />
                      <Route path="/contato" element={<Contact />} />
                      <Route path="/novidades" element={<NewIn />} />
                      <Route path="/mais-vendidos" element={<BestSellers />} />
                      <Route path="/sustentabilidade" element={<Sustainability />} />
                      <Route path="/envios-e-devolucoes" element={<Shipping />} />
                      <Route path="/guia-de-medidas" element={<SizeGuide />} />
                      <Route path="/privacidade" element={<Privacy />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                  <AIStylist />
                </div>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ProductProvider>
      </HelmetProvider>
    </Router>
  );
}

// End of file
export default App;
