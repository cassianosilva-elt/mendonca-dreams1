
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search, Heart, Shield, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navClass = isScrolled || location.pathname !== '/'
    ? 'bg-white shadow-sm text-navy py-4'
    : 'bg-transparent text-white py-4 md:py-6';

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${navClass}`}>
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex-1 md:hidden">
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>

          <div className="hidden md:flex flex-1 space-x-10 items-center">
            <Link to="/colecoes" className="text-[11px] tracking-[0.3em] font-medium hover:opacity-50 transition-opacity">COLEÇÕES</Link>
            <Link to="/sobre" className="text-[11px] tracking-[0.3em] font-medium hover:opacity-50 transition-opacity">SOBRE</Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[11px] tracking-[0.3em] font-medium hover:opacity-50 transition-opacity flex items-center space-x-2"
            >
              <Search size={14} />
              <span>BUSCA</span>
            </button>
          </div>

          <Link to="/" className="text-center flex flex-col items-center flex-shrink-0">
            <h1 className="text-xl md:text-3xl font-serif tracking-[0.2em] leading-none">MENDONÇA</h1>
            <span className="text-[8px] md:text-[10px] tracking-[0.5em] mt-1 opacity-70">DREAMS</span>
          </Link>

          <div className="flex flex-1 justify-end items-center space-x-4 md:space-x-8">
            {/* Admin Button - Only visible for admins */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-navy/10 hover:bg-navy hover:text-white text-navy rounded-full transition-all text-[10px] tracking-wider font-semibold border border-navy/20"
                title="Painel Admin"
              >
                <Shield size={14} />
                <span className="hidden xs:inline">ADMIN</span>
              </Link>
            )}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden hover:opacity-50 transition-opacity"
            >
              <Search size={18} />
            </button>
            <Link to="/conta?tab=wishlist" className="hidden sm:block hover:opacity-50 transition-opacity">
              <Heart size={18} />
            </Link>
            <Link to={isAuthenticated ? "/conta" : "/login"} className="hidden sm:block hover:opacity-50 transition-opacity">
              <User size={18} />
            </Link>
            <Link to="/carrinho" className="relative hover:opacity-50 transition-opacity">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold bg-navy text-white border-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className={`fixed inset-0 bg-white z-[60] transition-transform duration-700 ease-in-out flex flex-col p-8 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-16">
            <div className="flex flex-col text-navy">
              <h1 className="text-xl font-serif tracking-[0.2em]">MENDONÇA</h1>
              <span className="text-[8px] tracking-[0.4em]">DREAMS</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={28} className="text-navy" />
            </button>
          </div>
          <div className="flex flex-col space-y-8 text-3xl font-serif text-navy">
            <Link to="/">Início</Link>
            <Link to="/colecoes">Coleções</Link>
            <Link to="/sobre">Sobre</Link>
            <Link to="/contato">Contato</Link>
            <Link to={isAuthenticated ? "/conta" : "/login"}>Minha Conta</Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-3 text-purple-700">
                <Shield size={24} />
                Painel Admin
              </Link>
            )}

            {isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="flex items-center gap-3 text-red-500 mt-4 border-t border-gray-100 pt-8"
              >
                <LogOut size={24} />
                Encerrar Sessão
              </button>
            )}
          </div>
        </div>
      </nav>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
