import React from 'react';
import SEO from '../components/SEO';
import { useGenderedLanguage } from '../hooks/useGenderedLanguage';

const About = () => {
  const { translate, t } = useGenderedLanguage();
  return (
    <div className="pt-40 pb-24 bg-white">
      <SEO
        title="Sobre a Marca"
        description="Conheça a história da Mendonça Dreams. Tradição em alta alfaiataria, tecidos nobres e acabamento impecável."
      />
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <span className="text-navy/40 text-[10px] tracking-[0.5em] uppercase mb-8 block font-semibold">O Legado</span>
          <h1 className="text-5xl md:text-7xl font-serif text-navy mb-8 italic">Mendonça Dreams</h1>
          <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed">
            Fundada sobre a premissa de que o corte perfeito é a forma mais pura de expressão, a Mendonça Dreams nasceu para vestir {t('a mulher', 'o homem')} que não apenas ocupa espaços, mas os define.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1000" alt="Ateliê" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="space-y-10">
            <h2 className="text-4xl font-serif text-navy leading-tight">Estilo que <span className="italic">Empodera</span>.</h2>
            <p className="text-gray-500 leading-relaxed font-light text-lg">
              creditamos que a roupa certa transforma o dia. Por isso, trazemos o que há de melhor na moda feminina: peças versáteis, com detalhes nobres e caimento superior. Uma coleção pensada para elevar sua imagem pessoal com praticidade e muita sofisticação.
            </p>
            <div className="border-l-2 border-navy/10 pl-8 space-y-6 italic text-navy/60">
              <p>"Não vendemos roupas. Vendemos a confiança inabalável que surge quando você sabe que está impecável."</p>
              <p className="text-[10px] font-bold uppercase tracking-widest not-italic">— Kethellen Mendonça, Fundadora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
