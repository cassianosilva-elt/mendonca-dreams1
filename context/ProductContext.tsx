import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, IS_MOCK_MODE } from '../services/supabase';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    getProductBySlug: (slug: string) => Product | undefined;
    refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Check if credentials exist before trying to fetch to avoid console spam
            if (IS_MOCK_MODE) {
                setProducts(PRODUCTS);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const dbProducts: Product[] = (data || []).map(item => ({
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
                colors: item.colors as any
            }));

            // Merge logic: Show all DB products + any generic products that don't share a slug with a DB product
            const dbSlugs = new Set(dbProducts.map(p => p.slug));
            const genericProducts = PRODUCTS.filter(p => !dbSlugs.has(p.slug));

            setProducts([...dbProducts, ...genericProducts]);
        } catch (err: any) {
            console.error('Error fetching products:', err.message);
            setError(err.message);
            // Fallback on error
            setProducts(PRODUCTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getProductBySlug = (slug: string) => {
        return products.find(p => p.slug === slug);
    };

    return (
        <ProductContext.Provider value={{ products, loading, error, getProductBySlug, refreshProducts: fetchProducts }}>
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
