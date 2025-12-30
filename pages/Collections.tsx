
import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

const Collections = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-40 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <header className="mb-20 text-center">
          <h1 className="text-5xl font-serif text-navy mb-6 italic">Coleções Maison</h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
            Curadoria exclusiva de alfaiataria atemporal e design contemporâneo.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-gray-100 pb-8 space-y-6 md:space-y-0">
          <div className="flex items-center space-x-4 text-navy">
            <SlidersHorizontal size={18} />
            <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Filtrar por</span>
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
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
