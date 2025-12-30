import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, IS_MOCK_MODE } from '../services/supabase';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    getProductBySlug: (slug: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Check if credentials exist before trying to fetch to avoid console spam
                if (IS_MOCK_MODE) {
                    console.log('Running in Product MOCK MODE. Using static data.');
                    setProducts(PRODUCTS);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) throw error;

                if (data && data.length > 0) {
                    // Transform Supabase data if necessary (e.g. ensure shapes match)
                    // For now assuming direct mapping fits or we map fields
                    const mappedProducts: Product[] = data.map(item => ({
                        id: item.id,
                        slug: item.slug,
                        name: item.name,
                        category: item.category,
                        price: item.price,
                        images: item.images,
                        description: item.description,
                        details: item.details,
                        composition: item.composition,
                        sizes: item.sizes,
                        colors: item.colors as any // Casting JSON to specific type
                    }));
                    setProducts(mappedProducts);
                } else {
                    // If table is empty, fall back? Or just show empty. 
                    // Let's fall back to constants for demo purposes if DB is empty
                    console.log('No products in DB, using static data.');
                    setProducts(PRODUCTS);
                }

            } catch (err: any) {
                console.error('Error fetching products:', err.message);
                setError(err.message);
                // Fallback on error
                setProducts(PRODUCTS);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getProductBySlug = (slug: string) => {
        return products.find(p => p.slug === slug);
    };

    return (
        <ProductContext.Provider value={{ products, loading, error, getProductBySlug }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
