
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductSkeleton } from '../components/Skeleton';

const Collections = () => {
  const { products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const searchQuery = searchParams.get('search') || '';

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="pt-40 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <header className="mb-20 text-center">
          <h1 className="text-5xl font-serif text-navy mb-6 italic">Coleções</h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
            Curadoria exclusiva de alfaiataria atemporal e design contemporâneo.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-gray-100 pb-8 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-4 text-navy">
            <SlidersHorizontal size={18} />
            <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Filtrar por</span>
            {searchQuery && (
              <div className="flex items-center bg-navy/5 px-4 py-2 border border-navy/10 ml-4 animate-in fade-in slide-in-from-left-4">
                <span className="text-[9px] tracking-widest font-bold uppercase text-navy">Busca: <span className="italic">"{searchQuery}"</span></span>
                <button onClick={clearSearch} className="ml-3 hover:text-red-500 transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] tracking-[0.3em] font-bold uppercase transition-all relative pb-2 ${selectedCategory === cat ? 'text-navy' : 'text-gray-300 hover:text-navy'
                  }`}
              >
                {cat}
                {selectedCategory === cat && <div className="absolute bottom-0 left-0 w-full h-px bg-navy" />}
              </button>
            ))}
          </div>

          <div className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
            {filteredProducts.length} itens encontrados
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
