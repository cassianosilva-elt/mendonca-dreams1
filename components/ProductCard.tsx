import React from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';
import { Product } from '../types';
import { ShoppingBag, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="group cursor-pointer relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-[0.5s] ${isInWishlist(product.id) ? 'bg-navy text-white shadow-lg' : 'bg-white/80 text-navy opacity-0 group-hover:opacity-100 uppercase'
          }`}
      >
        <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
      </button>

      <Link to={`/produto/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
          <OptimizedImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            style={{ aspectRatio: '3/4' }}
          />
          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors duration-500"></div>

          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="w-full bg-white text-navy py-3 md:py-4 text-[9px] md:text-[10px] tracking-[0.3em] font-bold shadow-xl flex items-center justify-center space-x-2 uppercase">
              <ShoppingBag size={14} />
              <span>Ver Detalhes</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="space-y-2 text-center md:text-left">
        <p className="text-[9px] tracking-[0.25em] text-navy/40 uppercase font-semibold">{product.category}</p>
        <Link to={`/produto/${product.slug}`}>
          <h3 className="text-sm md:text-base font-serif text-navy tracking-wide hover:underline decoration-1 underline-offset-4">{product.name}</h3>
        </Link>
        <p className="text-sm font-medium text-navy/70 italic">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
};

export default ProductCard;
