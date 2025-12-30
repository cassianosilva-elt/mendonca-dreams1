import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';
import { supabase, IS_MOCK_MODE } from '../services/supabase';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, delta: number) => void;
  total: number;
  count: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('md_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with DB when user logs in
  useEffect(() => {
    if (!user || IS_MOCK_MODE) return;

    const syncCart = async () => {
      // 1. Get or Create Cart
      let { data: cartData } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!cartData) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select()
          .single();
        cartData = newCart;
      }

      if (cartData) {
        // 2. Fetch Items
        const { data: items } = await supabase
          .from('cart_items')
          .select('*, products(*)') // Join with products to get details
          .eq('cart_id', cartData.id);

        if (items) {
          // Transform to CartItem type
          const dbItems: CartItem[] = items.map((item: any) => ({
            id: item.product_id,
            slug: item.products.slug,
            name: item.products.name,
            price: item.products.price,
            images: item.products.images, // Assuming products view returns array
            category: item.products.category,
            description: item.products.description,
            details: item.products.details,
            composition: item.products.composition,
            sizes: item.products.sizes,
            colors: item.products.colors,
            selectedSize: item.size,
            selectedColor: item.color,
            quantity: item.quantity
          }));

          // Merge local cart with DB cart (simple strategy: DB wins or union?)
          // For simplicity: DB wins if exists, otherwise keep local until first save.
          // Better: If DB empty and Local has items, push Local to DB.
          if (dbItems.length > 0) {
            setCart(dbItems);
          } else if (cart.length > 0) {
            // Push local items to DB
            for (const item of cart) {
              await supabase.from('cart_items').insert({
                cart_id: cartData.id,
                product_id: item.id,
                size: item.selectedSize,
                color: item.selectedColor,
                quantity: item.quantity
              });
            }
          }
        }
      }
    };

    syncCart();
  }, [user]);

  // Persist to LocalStorage always (offline support)
  useEffect(() => {
    localStorage.setItem('md_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: Product, size: string, color: string) => {
    // Optimistic UI Update
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedSize === size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });

    if (user && !IS_MOCK_MODE) {
      // Sync to DB
      const { data: cartData } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
      if (cartData) {
        // Check existence in DB first to update vs insert
        // Upsert on specific conflict constraint would be better
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_id', cartData.id)
          .eq('product_id', product.id)
          .eq('size', size)
          .eq('color', color)
          .single();

        if (existingItem) {
          await supabase.from('cart_items').update({ quantity: existingItem.quantity + 1 }).eq('id', existingItem.id);
        } else {
          await supabase.from('cart_items').insert({
            cart_id: cartData.id,
            product_id: product.id,
            size: size,
            color: color,
            quantity: 1
          });
        }
      }
    }
  };

  const removeFromCart = async (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));

    if (user && !IS_MOCK_MODE) {
      const { data: cartData } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
      if (cartData) {
        await supabase.from('cart_items')
          .delete()
          .eq('cart_id', cartData.id)
          .eq('product_id', id)
          .eq('size', size);
      }
    }
  };

  const updateQuantity = async (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item =>
      (item.id === id && item.selectedSize === size)
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));

    if (user && !IS_MOCK_MODE) {
      const { data: cartData } = await supabase.from('carts').select('id').eq('user_id', user.id).single();
      if (cartData) {
        // Need current qty to solve math
        const item = cart.find(i => i.id === id && i.selectedSize === size);
        if (item) {
          const newQty = Math.max(1, item.quantity + delta);
          await supabase.from('cart_items')
            .update({ quantity: newQty })
            .eq('cart_id', cartData.id)
            .eq('product_id', id)
            .eq('size', size);
        }
      }
    }
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, total, count, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
