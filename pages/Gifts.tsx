import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Gift, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const Gifts: React.FC = () => {
    const { products } = useProducts();
    const [priceFilter, setPriceFilter] = useState<'all' | 'under300' | 'under600' | 'premium'>('all');

    const filteredProducts = products.filter(p => {
        switch (priceFilter) {
            case 'under300':
                return p.price < 300;
            case 'under600':
                return p.price >= 300 && p.price < 600;
            case 'premium':
                return p.price >= 600;
            default:
                return true;
        }
    });

    const priceRanges = [
        { key: 'all', label: 'Todos', icon: <Sparkles size={14} /> },
        { key: 'under300', label: 'Até R$ 300', icon: <Tag size={14} /> },
        { key: 'under600', label: 'R$ 300 - R$ 600', icon: <Tag size={14} /> },
        { key: 'premium', label: 'Acima de R$ 600', icon: <Gift size={14} /> },
    ];

    return (
        <div className="pt-40 pb-20 bg-gray-50 min-h-screen">
            <SEO
                title="Presentes Perfeitos | Mendonça Dreams"
                description="Encontre o presente ideal para quem você ama. Sugestões especiais de moda feminina para surpreender."
            />

            <div className="container mx-auto px-6 lg:px-12">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-navy text-white rounded-full mb-8">
                        <Gift size={36} />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-navy mb-6">
                        Presentes <span className="italic">Perfeitos</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-2xl mx-auto text-lg">
                        Surpreenda quem você ama com peças exclusivas. Cada presente vem com embalagem especial de cortesia.
                    </p>
                </motion.header>

                {/* Tips Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shrink-0">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="text-navy font-bold text-sm uppercase tracking-widest mb-1">Não sabe o tamanho dela?</h3>
                            <p className="text-gray-500 text-sm font-light">Veja nossas dicas especiais para quem está presenteando.</p>
                        </div>
                    </div>
                    <Link
                        to="/guia-de-medidas"
                        className="inline-flex items-center gap-2 text-navy text-[11px] uppercase tracking-widest font-bold hover:underline shrink-0"
                    >
                        Ver Guia de Medidas
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>

                {/* Price Filter */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {priceRanges.map(range => (
                        <button
                            key={range.key}
                            onClick={() => setPriceFilter(range.key as any)}
                            className={`inline-flex items-center gap-2 px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border-2 ${priceFilter === range.key
                                    ? 'bg-navy text-white border-navy'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {range.icon}
                            {range.label}
                        </button>
                    ))}
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">Nenhum produto encontrado nesta faixa de preço.</p>
                    </div>
                )}

                {/* Gift Wrapping Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-gradient-to-br from-navy to-navy/90 text-white p-10 md:p-16 text-center"
                >
                    <Gift size={40} className="mx-auto mb-6 opacity-80" />
                    <h3 className="text-2xl md:text-3xl font-serif mb-4">Embalagem de Presente Especial</h3>
                    <p className="text-white/70 font-light max-w-xl mx-auto mb-8">
                        Todos os pedidos podem ser embalados para presente sem custo adicional.
                        Inclua uma mensagem personalizada no checkout!
                    </p>
                    <Link
                        to="/colecoes"
                        className="inline-flex items-center gap-3 bg-white text-navy px-8 py-4 text-[11px] tracking-[0.2em] font-bold uppercase hover:bg-gray-100 transition-all"
                    >
                        Ver Todas as Coleções
                        <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Gifts;
