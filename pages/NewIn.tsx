
import React from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const NewIn = () => {
    const { products } = useProducts();
    // For demo, just showing the first 4 products as "Novidades"
    const newProducts = products.slice(0, 4);

    return (
        <div className="pt-40 pb-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <header className="mb-20 text-center">
                    <h1 className="text-5xl font-serif text-navy mb-6 italic">Novidades</h1>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto uppercase tracking-[0.2em] text-xs">
                        As últimas criações da Mendonça Dreams.
                    </p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {newProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewIn;
