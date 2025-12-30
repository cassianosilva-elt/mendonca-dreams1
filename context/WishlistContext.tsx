import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const { user } = useAuth();

    // Load wishlist from localStorage on mount and when user changes
    useEffect(() => {
        const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
        const savedWishlist = localStorage.getItem(storageKey);
        if (savedWishlist) {
            try {
                setWishlist(JSON.parse(savedWishlist));
            } catch (e) {
                console.error('Error parsing wishlist from localStorage:', e);
            }
        } else {
            setWishlist([]);
        }
    }, [user]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
        localStorage.setItem(storageKey, JSON.stringify(wishlist));
    }, [wishlist, user]);

    const addToWishlist = (product: Product) => {
        setWishlist(prev => {
            if (prev.find(p => p.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist(prev => prev.filter(p => p.id !== productId));
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(p => p.id === productId);
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};
