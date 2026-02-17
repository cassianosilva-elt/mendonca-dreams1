import React, { createContext, useContext } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { getProducts } from '../services/admin';
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
    const dbProductsQuery = useQuery(api.products.list, {});
    const [manualProducts, setManualProducts] = React.useState<Product[]>([]);
    const [isManualLoading, setIsManualLoading] = React.useState(true);

    // Initial manual fetch (resilience against Clerk issues)
    React.useEffect(() => {
        const fetchInitial = async () => {
            try {
                const data = await getProducts();
                // We only care about products actually in the DB (with Convex IDs)
                // Filter out generic products that getProducts() also returns
                const dbOnly = data.filter(p => p.id.includes('_'));
                setManualProducts(dbOnly);
            } catch (error) {
                console.error('Error in resilient fetch:', error);
            } finally {
                setIsManualLoading(false);
            }
        };
        fetchInitial();
    }, []);

    // Process products: DB products shadow Generic products with same slug
    const products = React.useMemo(() => {
        // Use reactive query data if available, otherwise fallback to manual fetch
        let dbSource: Product[] = [];

        if (dbProductsQuery !== undefined) {
            dbSource = dbProductsQuery.map((item: any) => ({
                id: item._id,
                slug: item.slug,
                name: item.name,
                category: item.category,
                price: item.price,
                images: item.images,
                description: item.description,
                details: item.details,
                composition: item.composition,
                sizes: item.sizes,
                colors: item.colors as { name: string; hex: string }[],
                videoUrl: item.videoUrl,
            }));
        } else if (manualProducts.length > 0) {
            dbSource = manualProducts;
        }

        const dbSlugs = new Set(dbSource.map(p => p.slug));
        const genericProducts = PRODUCTS.filter(p => !dbSlugs.has(p.slug));

        return [...dbSource, ...genericProducts];
    }, [dbProductsQuery, manualProducts]);

    const loading = dbProductsQuery === undefined && isManualLoading && manualProducts.length === 0;
    const error = null;

    const getProductBySlug = (slug: string) => {
        return products.find(p => p.slug === slug);
    };

    const refreshProducts = async () => {
        // useQuery is reactive, so this isn't strictly necessary but kept for back-compat
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
