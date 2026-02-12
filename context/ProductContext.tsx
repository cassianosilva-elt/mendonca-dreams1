import React, { createContext, useContext } from 'react';
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
    // Use static PRODUCTS data
    // When Convex is properly deployed, replace this with useQuery(api.products.list)
    const products = PRODUCTS;
    const loading = false;
    const error = null;

    const getProductBySlug = (slug: string) => {
        return products.find(p => p.slug === slug);
    };

    const refreshProducts = async () => {
        // No-op for static data
    };

    return (
        <ProductContext.Provider value={{ products, loading, error, getProductBySlug, refreshProducts }}>
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
