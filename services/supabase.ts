import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const IS_MOCK_MODE = !supabaseUrl || supabaseUrl.includes('placeholder');

if (IS_MOCK_MODE) {
    console.warn('Supabase credentials not found or using placeholders. Running in MOCK MODE.');
}

// Create Supabase client
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

// Database Types Helper
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    slug: string
                    name: string
                    category: string
                    price: number
                    images: string[]
                    description: string
                    details: string
                    composition: string
                    sizes: string[]
                    colors: Json[]
                    created_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    name: string
                    category: string
                    price: number
                    images: string[]
                    description: string
                    details: string
                    composition: string
                    sizes: string[]
                    colors: Json[]
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['products']['Insert']>
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    address_line1: string | null
                    address_line2: string | null
                    city: string | null
                    state: string | null
                    zip_code: string | null
                    is_admin: boolean
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    phone?: string | null
                    address_line1?: string | null
                    address_line2?: string | null
                    city?: string | null
                    state?: string | null
                    zip_code?: string | null
                    is_admin?: boolean
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>
            }
            carts: {
                Row: {
                    id: string
                    user_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['carts']['Insert']>
            }
            cart_items: {
                Row: {
                    id: string
                    cart_id: string
                    product_id: string
                    size: string
                    color: string
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    cart_id: string
                    product_id: string
                    size: string
                    color: string
                    quantity?: number
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    status: string
                    total: number
                    shipping_address: Json
                    stripe_payment_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    status?: string
                    total: number
                    shipping_address: Json
                    stripe_payment_id?: string | null
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['orders']['Insert']>
            }
            inventory: {
                Row: {
                    id: string
                    product_id: string
                    color_name: string
                    size: string
                    quantity: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    color_name: string
                    size: string
                    quantity?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['inventory']['Insert']>
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    product_name: string
                    quantity: number
                    size: string
                    color: string
                    price: number
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    product_name: string
                    quantity: number
                    size: string
                    color: string
                    price: number
                }
                Update: Partial<Database['public']['Tables']['order_items']['Insert']>
            }
            reviews: {
                Row: {
                    id: string
                    product_id: string
                    user_id: string
                    user_name: string
                    rating: number
                    comment: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    user_id: string
                    user_name: string
                    rating: number
                    comment: string
                    created_at?: string
                }
                Update: Partial<Database['public']['Tables']['reviews']['Insert']>
            }
        }
    }
}

// Service Functions
export const getUserOrders = async (userId: string) => {
    if (IS_MOCK_MODE) return [];

    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;
    return orders;
};

export const getProductInventory = async (productId: string) => {
    if (IS_MOCK_MODE) return [];

    const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', productId);

    if (error) throw error;
    return data;
};

export const getProductReviews = async (productId: string) => {
    if (IS_MOCK_MODE) return [];

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addReview = async (review: Database['public']['Tables']['reviews']['Insert']) => {
    if (IS_MOCK_MODE) return null;

    const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();

    if (error) throw error;
    return data;
};
