
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import OptimizedImage from './OptimizedImage';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const { products } = useProducts();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim().length > 1) {
            const filtered = products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered.slice(0, 5));
        } else {
            setResults([]);
        }
    }, [query, products]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Search Bar */}
            <div className="relative bg-white w-full py-8 md:py-12 px-6 lg:px-12 transform transition-transform duration-500 ease-out translate-y-0">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-[10px] tracking-[0.5em] uppercase text-navy/40 font-bold italic">Curadoria Maison</span>
                        <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <X size={24} className="text-navy" />
                        </button>
                    </div>

                    <div className="relative flex items-center border-b-2 border-navy/10 focus-within:border-navy transition-colors pb-4">
                        <Search size={24} className="text-navy/20 mr-4" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="O que você procura hoje?"
                            className="w-full text-2xl md:text-4xl font-serif text-navy placeholder:text-navy/10 outline-none bg-transparent"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Results */}
                    {query.trim().length > 1 && (
                        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                            {results.length > 0 ? (
                                <>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Resultados Encontrados ({results.length})</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {results.map(product => (
                                            <div
                                                key={product.id}
                                                onClick={() => {
                                                    navigate(`/produto/${product.slug}`);
                                                    onClose();
                                                }}
                                                className="flex items-center space-x-6 p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                            >
                                                <div className="w-20 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                                                    <OptimizedImage
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[8px] tracking-[0.3em] uppercase text-navy/40 font-bold mb-1">{product.category}</p>
                                                    <h4 className="text-lg font-serif text-navy mb-2">{product.name}</h4>
                                                    <p className="text-sm text-navy font-light">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <ChevronRight size={16} className="text-navy/20 group-hover:text-navy transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/colecoes?search=' + query);
                                            onClose();
                                        }}
                                        className="w-full py-4 text-[10px] tracking-[0.3em] uppercase font-bold text-navy border border-navy/10 hover:bg-navy hover:text-white transition-all"
                                    >
                                        Ver Tudo da Maison
                                    </button>
                                </>
                            ) : (
                                <div className="py-20 text-center">
                                    <ShoppingBag size={48} className="mx-auto text-navy/5 mb-6" />
                                    <p className="text-gray-400 font-serif italic text-xl">Não encontramos peças para esta busca...</p>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-navy/40 font-bold mt-4">Tente termos mais genéricos como "Blazer" ou "Vestido"</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Suggestions */}
                    {!query && (
                        <div className="mt-12 animate-in fade-in duration-700">
                            <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold mb-6">Sugestões de Busca</h3>
                            <div className="flex flex-wrap gap-4">
                                {['Blazers', 'Novidades', 'Festas', 'Seda', 'Alfaiataria'].map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-6 py-3 bg-gray-50 hover:bg-navy hover:text-white text-[10px] tracking-[0.2em] font-bold uppercase transition-all"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
