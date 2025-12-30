
import React from 'react';
import { Link } from 'react-router-dom';

import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Alta Alfaiataria Feminina"
          className="w-full h-full object-cover scale-105 animate-slowZoom"
        />
        <div className="absolute inset-0 bg-navy/40 lg:bg-navy/20"></div>
        <div className="absolute bottom-0 left-0 w-full h-[30vh] md:h-[50vh] bg-gradient-to-t from-white via-white/80 via-30% to-transparent z-20"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white z-20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 text-white">
        <div className="max-w-3xl animate-fadeIn opacity-100">
          <h2 className="text-[10px] md:text-xs tracking-[0.5em] font-medium mb-6 opacity-80 uppercase">Moda Feminina & Luxo</h2>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif mb-8 leading-[1.1] md:leading-tight drop-shadow-sm">
            Mendonça <br />
            <span className="italic font-medium">Alfaiataria Feminina</span>
          </h1>
          <p className="text-base md:text-lg font-light mb-12 opacity-90 leading-relaxed max-w-lg">
            Elevando a presença feminina e o equilíbrio perfeito entre tradição e modernidade.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/colecoes" className="bg-navy text-white px-12 py-5 text-[11px] tracking-[0.3em] font-bold hover:bg-white hover:text-navy transition-all duration-500 transform text-center">
              VER COLEÇÃO
            </Link>
            <Link to="/sobre" className="border border-white/40 text-white px-12 py-5 text-[11px] tracking-[0.3em] font-bold hover:bg-white hover:text-navy transition-all duration-500 transform backdrop-blur-sm text-center">
              SOBRE A MAISON
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-6 lg:left-12 flex items-center space-x-4 z-10">
        <div className="w-12 h-px bg-white/40 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-white animate-scrollRight"></div>
        </div>
        <span className="text-navy text-[9px] tracking-[0.3em] uppercase opacity-60">Deslize para explorar</span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn { 
          animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .animate-slowZoom { animation: slowZoom 20s linear infinite alternate; }
        .animate-scrollRight { animation: scrollRight 2s infinite ease-in-out; }
      `}</style>
    </section>
  );
};

export default Hero;
