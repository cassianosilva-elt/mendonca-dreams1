
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ClerkProvider, SignedIn, SignedOut, useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { ptBR } from '@clerk/localizations';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIStylist from './components/AIStylist';
import { Shield } from 'lucide-react';

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
import Gifts from './pages/Gifts';
import Terms from './pages/Terms';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProductManagement from './pages/admin/ProductManagement';
import AdminProductForm from './pages/admin/ProductForm';
import AdminInventoryManagement from './pages/admin/InventoryManagement';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminOrderManagement from './pages/admin/OrderManagement';

// Initialize Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// Protected Route
const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Route - requires authentication AND admin role
const AdminRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-12 shadow-xl rounded-2xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-serif text-navy mb-4">Acesso Restrito</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Esta área é exclusiva para administradores da Mendonça Dreams. Se você acredita que deveria ter acesso, entre em contato com o suporte técnico.
          </p>
          <Link
            to="/"
            className="inline-block bg-navy text-white px-8 py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-navy/90 transition-all w-full"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Routes>
      {/* Admin Routes - No Navbar/Footer */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/produtos" element={<AdminRoute><AdminProductManagement /></AdminRoute>} />
      <Route path="/admin/produtos/novo" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
      <Route path="/admin/produtos/:id/editar" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
      <Route path="/admin/estoque" element={<AdminRoute><AdminInventoryManagement /></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUserManagement /></AdminRoute>} />
      <Route path="/admin/pedidos" element={<AdminRoute><AdminOrderManagement /></AdminRoute>} />

      {/* Public Routes - With Navbar/Footer */}
      <Route path="/*" element={
        <div className="min-h-screen bg-white selection:bg-navy selection:text-white flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colecoes" element={<Collections />} />
              <Route path="/categoria/:category" element={<Collections />} />
              <Route path="/produto/:slug" element={<ProductDetail />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/login/*" element={<Login />} />
              <Route path="/cadastro/*" element={<Login />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/conta" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/novidades" element={<NewIn />} />
              <Route path="/mais-vendidos" element={<BestSellers />} />
              <Route path="/sustentabilidade" element={<Sustainability />} />
              <Route path="/envios-e-devolucoes" element={<Shipping />} />
              <Route path="/guia-de-medidas" element={<SizeGuide />} />
              <Route path="/presentes" element={<Gifts />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/termos" element={<Terms />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <AIStylist />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      localization={ptBR}
      signInUrl="/login"
      signUpUrl="/cadastro"
      signInFallbackRedirectUrl="/conta"
      signUpFallbackRedirectUrl="/conta"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
        <Router>
          <HelmetProvider>
            <ProductProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </ProductProvider>
          </HelmetProvider>
        </Router>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default App;
