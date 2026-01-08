
import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

import { useProducts } from '../context/ProductContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const { products } = useProducts();
  return (
    <div>
      <SEO
        title="Mendonça Dreams | Alta Alfaiataria"
        description="Descubra a coleção exclusiva de alta alfaiataria feminina. Peças que unem luxo, conforto e design atemporal."
      />
      <Hero />

      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <span className="text-navy/40 text-[10px] tracking-[0.5em] uppercase mb-8 block font-semibold">Exclusividade Mendonça</span>
          <h2 className="text-4xl md:text-6xl font-serif text-navy mb-12 leading-tight">
            Alfaiataria que redefine <br /> a <span className="italic">Presença Feminina</span>.
          </h2>
          <p className="text-gray-500 text-lg font-light leading-relaxed mb-16">
            Nossas peças são concebidas para a mulher que exige perfeição. Tecidos de luxo, cortes manuais e uma estética que une o clássico ao vanguardista.
          </p>
          <Link to="/colecoes" className="inline-flex items-center space-x-6 group text-navy font-bold tracking-[0.3em] text-[11px] uppercase border-b border-navy/20 pb-2">
            <span>EXPLORAR COLEÇÕES</span>
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      </section>


      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-3xl font-serif text-navy italic">Destaques da Maison</h2>
          <Link to="/colecoes" className="text-[10px] tracking-[0.2em] uppercase font-bold text-navy/40 hover:text-navy transition">Ver tudo</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
