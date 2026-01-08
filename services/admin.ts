import { supabase, IS_MOCK_MODE } from './supabase';
import { Product, ProductFormData, ProductInventory, Order, User } from '../types';
import { PRODUCTS } from '../constants';

// Mock data for admin functionality when Supabase is not configured
const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@mendonca.com', isAdmin: true },
    { id: '2', name: 'Maria Silva', email: 'maria@email.com', isAdmin: false },
    { id: '3', name: 'João Santos', email: 'joao@email.com', isAdmin: false },
];

const MOCK_ORDERS: Order[] = [
    {
        id: 'ord-1',
        userId: '2',
        userName: 'Maria Silva',
        userEmail: 'maria@email.com',
        status: 'delivered',
        total: 2140,
        shippingAddress: {
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
        },
        items: [
            { productId: '1', productName: 'Blazer Estruturado Navy Royal', quantity: 1, size: '40', color: 'Navy', price: 1290 },
            { productId: '2', productName: 'Calça Pantalona em Crepe', quantity: 1, size: 'M', color: 'Off-White', price: 850 },
        ],
        createdAt: '2025-12-28T10:00:00Z',
    },
    {
        id: 'ord-2',
        userId: '3',
        userName: 'João Santos',
        userEmail: 'joao@email.com',
        status: 'processing',
        total: 720,
        shippingAddress: {
            street: 'Av. Paulista',
            number: '1000',
            complement: 'Apto 101',
            neighborhood: 'Bela Vista',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01310-100',
        },
        items: [
            { productId: '3', productName: 'Camisa de Seda Pura Branca', quantity: 1, size: '40', color: 'Branco', price: 720 },
        ],
        createdAt: '2026-01-02T14:30:00Z',
    },
];

const MOCK_INVENTORY: ProductInventory[] = [
    { id: 'inv-1', productId: '1', productName: 'Blazer Estruturado Navy Royal', colorName: 'Navy', size: '38', quantity: 5, updatedAt: '2026-01-01T00:00:00Z' },
    { id: 'inv-2', productId: '1', productName: 'Blazer Estruturado Navy Royal', colorName: 'Navy', size: '40', quantity: 3, updatedAt: '2026-01-01T00:00:00Z' },
    { id: 'inv-3', productId: '1', productName: 'Blazer Estruturado Navy Royal', colorName: 'Preto', size: '40', quantity: 8, updatedAt: '2026-01-01T00:00:00Z' },
    { id: 'inv-4', productId: '2', productName: 'Calça Pantalona em Crepe', colorName: 'Off-White', size: 'M', quantity: 10, updatedAt: '2026-01-01T00:00:00Z' },
    { id: 'inv-5', productId: '3', productName: 'Camisa de Seda Pura Branca', colorName: 'Branco', size: '40', quantity: 2, updatedAt: '2026-01-01T00:00:00Z' },
];

// Admin check
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        // In mock mode, pretend the first user is admin
        return userId === 'mock-id';
    }

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data?.is_admin === true;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// Products
export const getProducts = async (): Promise<Product[]> => {
    if (IS_MOCK_MODE) return PRODUCTS;

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const dbProducts = data?.map(item => ({
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
            colors: item.colors as { name: string; hex: string }[],
        })) || [];

        // Merge logic: Show all DB products + any generic products that don't share a slug with a DB product
        const dbSlugs = new Set(dbProducts.map(p => p.slug));
        const genericProducts = PRODUCTS.filter(p => !dbSlugs.has(p.slug));

        return [...dbProducts, ...genericProducts];
    } catch (error) {
        console.error('Error fetching products:', error);
        return PRODUCTS;
    }
};

export const importGenericProducts = async (): Promise<{ success: boolean; count: number }> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot import products in mock mode');
        return { success: false, count: 0 };
    }

    try {
        // First check if products already exist to avoid duplicates by slug
        const { data: existingProducts } = await supabase
            .from('products')
            .select('slug');

        const existingSlugs = new Set(existingProducts?.map(p => p.slug) || []);
        const toImport = PRODUCTS.filter(p => !existingSlugs.has(p.slug));

        if (toImport.length === 0) {
            return { success: true, count: 0 };
        }

        const { error } = await supabase
            .from('products')
            .insert(toImport.map(p => ({
                slug: p.slug,
                name: p.name,
                category: p.category,
                price: p.price,
                images: p.images,
                description: p.description,
                details: p.details,
                composition: p.composition,
                sizes: p.sizes,
                colors: p.colors,
            })));

        if (error) throw error;
        return { success: true, count: toImport.length };
    } catch (error) {
        console.error('Error importing generic products:', error);
        return { success: false, count: 0 };
    }
};

export const createProduct = async (productData: ProductFormData): Promise<Product | null> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot create product in mock mode');
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('products')
            .insert({
                slug: productData.slug,
                name: productData.name,
                category: productData.category,
                price: productData.price,
                images: productData.images,
                description: productData.description,
                details: productData.details,
                composition: productData.composition,
                sizes: productData.sizes,
                colors: productData.colors,
            })
            .select()
            .single();

        if (error) throw error;

        // Create inventory entries if provided
        if (data && productData.inventory) {
            for (const inv of productData.inventory) {
                await supabase.from('inventory').insert({
                    product_id: data.id,
                    color_name: inv.colorName,
                    size: inv.size,
                    quantity: inv.quantity,
                });
            }
        }

        return data ? {
            id: data.id,
            slug: data.slug,
            name: data.name,
            category: data.category,
            price: data.price,
            images: data.images,
            description: data.description,
            details: data.details,
            composition: data.composition,
            sizes: data.sizes,
            colors: data.colors as { name: string; hex: string }[],
        } : null;
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot update product in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('products')
            .update({
                slug: productData.slug,
                name: productData.name,
                category: productData.category,
                price: productData.price,
                images: productData.images,
                description: productData.description,
                details: productData.details,
                composition: productData.composition,
                sizes: productData.sizes,
                colors: productData.colors,
            })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot delete product in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
};

// Users
export const getUsers = async (): Promise<User[]> => {
    if (IS_MOCK_MODE) return MOCK_USERS;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data?.map(profile => ({
            id: profile.id,
            name: profile.full_name || 'Usuário',
            email: profile.email,
            phone: profile.phone || undefined,
            isAdmin: profile.is_admin,
        })) || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const toggleUserAdmin = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot toggle admin in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ is_admin: isAdmin })
            .eq('id', userId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error toggling admin status:', error);
        return false;
    }
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
    if (IS_MOCK_MODE) return MOCK_ORDERS;

    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
        *,
        profiles:user_id (full_name, email),
        order_items (*)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return orders?.map(order => ({
            id: order.id,
            userId: order.user_id,
            userName: (order.profiles as any)?.full_name || 'Usuário',
            userEmail: (order.profiles as any)?.email || '',
            status: order.status as Order['status'],
            total: order.total,
            shippingAddress: order.shipping_address as Order['shippingAddress'],
            items: (order.order_items || []).map((item: any) => ({
                productId: item.product_id,
                productName: item.product_name,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price: item.price,
            })),
            stripePaymentId: order.stripe_payment_id || undefined,
            createdAt: order.created_at,
        })) || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot update order status in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
};

// Inventory
export const getInventory = async (): Promise<ProductInventory[]> => {
    if (IS_MOCK_MODE) return MOCK_INVENTORY;

    try {
        const [products, { data: inventoryData, error: invError }] = await Promise.all([
            getProducts(),
            supabase
                .from('inventory')
                .select(`
                    *,
                    products:product_id (id, name)
                `)
        ]);

        if (invError) throw invError;

        const inventory = inventoryData?.map(item => ({
            id: item.id,
            productId: item.product_id,
            productName: (item.products as any)?.name || 'Produto',
            colorName: item.color_name,
            size: item.size,
            quantity: item.quantity,
            updatedAt: item.updated_at,
        })) || [];

        // Create a map for quick lookup: productId-color-size
        const inventoryMap = new Map();
        inventory.forEach(item => {
            inventoryMap.set(`${item.productId}-${item.colorName}-${item.size}`, item);
        });

        const allItems: ProductInventory[] = [];

        // For each product, check all combinations
        products.forEach(product => {
            product.colors.forEach(color => {
                product.sizes.forEach(size => {
                    const key = `${product.id}-${color.name}-${size}`;
                    const existing = inventoryMap.get(key);

                    if (existing) {
                        allItems.push(existing);
                    } else {
                        // Check if a product with same name/color/size exists in DB
                        // handles cases where sync changed the ID but inventory is there
                        const dbMatch = inventory.find(i =>
                            i.productName === product.name &&
                            i.colorName === color.name &&
                            i.size === size
                        );

                        if (dbMatch) {
                            allItems.push(dbMatch);
                        } else {
                            allItems.push({
                                id: `temp-${product.id}-${color.name}-${size}`,
                                productId: product.id,
                                productName: product.name,
                                colorName: color.name,
                                size: size,
                                quantity: 0,
                                updatedAt: new Date().toISOString()
                            });
                        }
                    }
                });
            });
        });

        return allItems.sort((a, b) => {
            if (a.productName !== b.productName) {
                return a.productName.localeCompare(b.productName);
            }
            return a.size.localeCompare(b.size);
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }
};

export const saveInventoryItem = async (
    item: ProductInventory,
    quantity: number
): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot update inventory in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('inventory')
            .upsert({
                product_id: item.productId,
                color_name: item.colorName,
                size: item.size,
                quantity: quantity,
                updated_at: new Date().toISOString()
            }, { onConflict: 'product_id,color_name,size' });

        if (error) {
            if (error.code === '23503') { // Foreign key error
                const genericProduct = PRODUCTS.find(p => p.id === item.productId);
                if (genericProduct) {
                    const { data: newProd, error: prodError } = await supabase
                        .from('products')
                        .insert({
                            slug: genericProduct.slug,
                            name: genericProduct.name,
                            category: genericProduct.category,
                            price: genericProduct.price,
                            images: genericProduct.images,
                            description: genericProduct.description,
                            details: genericProduct.details,
                            composition: genericProduct.composition,
                            sizes: genericProduct.sizes,
                            colors: genericProduct.colors
                        })
                        .select()
                        .single();

                    if (prodError) throw prodError;

                    const { error: retryError } = await supabase
                        .from('inventory')
                        .upsert({
                            product_id: newProd.id,
                            color_name: item.colorName,
                            size: item.size,
                            quantity: quantity,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'product_id,color_name,size' });

                    if (retryError) throw retryError;
                    return true;
                }
            }
            throw error;
        }

        return true;
    } catch (error) {
        console.error('Error saving inventory:', error);
        return false;
    }
};

export const updateInventory = async (
    inventoryId: string,
    quantity: number
): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot update inventory in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('inventory')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', inventoryId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating inventory:', error);
        return false;
    }
};

export const createInventoryItem = async (
    productId: string,
    colorName: string,
    size: string,
    quantity: number
): Promise<boolean> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot create inventory item in mock mode');
        return false;
    }

    try {
        const { error } = await supabase
            .from('inventory')
            .upsert({
                product_id: productId,
                color_name: colorName,
                size: size,
                quantity: quantity,
            }, { onConflict: 'product_id,color_name,size' });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error creating inventory item:', error);
        return false;
    }
};

// Dashboard Stats
export interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    recentOrders: Order[];
    lowStockItems: ProductInventory[];
}

// Storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
    if (IS_MOCK_MODE) {
        console.warn('Cannot upload images in mock mode');
        return null;
    }

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        // Provide more detailed error message if possible
        if (error.message) {
            console.error('Upload error details:', error.message);
        }
        return null;
    }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    if (IS_MOCK_MODE) {
        return {
            totalProducts: PRODUCTS.length,
            totalOrders: MOCK_ORDERS.length,
            totalUsers: MOCK_USERS.length,
            totalRevenue: MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0),
            recentOrders: MOCK_ORDERS.slice(0, 5),
            lowStockItems: MOCK_INVENTORY.filter(item => item.quantity < 5),
        };
    }

    try {
        const [products, orders, users, inventory] = await Promise.all([
            getProducts(),
            getOrders(),
            getUsers(),
            getInventory(),
        ]);

        return {
            totalProducts: products.length,
            totalOrders: orders.length,
            totalUsers: users.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
            recentOrders: orders.slice(0, 5),
            lowStockItems: inventory.filter(item => item.quantity < 5),
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
            totalProducts: 0,
            totalOrders: 0,
            totalUsers: 0,
            totalRevenue: 0,
            recentOrders: [],
            lowStockItems: [],
        };
    }
};
