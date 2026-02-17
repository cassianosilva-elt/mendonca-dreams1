// Admin service functions for Convex
// These functions provide a compatibility layer that can be called from admin components
// They use the Convex client directly via ConvexHttpClient for non-hook contexts

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import { Product, ProductFormData, ProductInventory, Order, User } from '../types';
import { PRODUCTS } from '../constants';
import { Id } from '../convex/_generated/dataModel';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Mock data for admin functionality when Convex is not configured
const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@mendonca.com', isAdmin: true, phone: '11999999999' },
    { id: '2', name: 'Maria Silva', email: 'maria@email.com', isAdmin: false, phone: '11988888888' },
    { id: '3', name: 'João Santos', email: 'joao@email.com', isAdmin: false, phone: '11977777777' },
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
        userPhone: '11988888888',
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
        userPhone: '11999999999',
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

export const IS_MOCK_MODE = !client;

// Admin check
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
    if (IS_MOCK_MODE) return userId === 'mock-id';

    try {
        const profile = await client!.query(api.profiles.getByClerkId, { clerkUserId: userId });
        return profile?.isAdmin === true;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// Products
export const getProducts = async (): Promise<Product[]> => {
    if (IS_MOCK_MODE) return PRODUCTS;

    try {
        const data = await client!.query(api.products.list, {});

        const dbProducts = data.map((item: any) => ({
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

        const dbSlugs = new Set(dbProducts.map((p: Product) => p.slug));
        const genericProducts = PRODUCTS.filter(p => !dbSlugs.has(p.slug));

        return [...dbProducts, ...genericProducts];
    } catch (error) {
        console.error('Error fetching products:', error);
        return PRODUCTS;
    }
};

export const importGenericProducts = async (): Promise<{ success: boolean; count: number }> => {
    if (IS_MOCK_MODE) return { success: false, count: 0 };

    try {
        const count = await client!.mutation(api.products.importBatch, { products: PRODUCTS });
        return { success: true, count };
    } catch (error) {
        console.error('Error importing generic products:', error);
        return { success: false, count: 0 };
    }
};

export const createProduct = async (productData: ProductFormData): Promise<Product | null> => {
    if (IS_MOCK_MODE) return null;

    try {
        const productId = await client!.mutation(api.products.create, {
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
            videoUrl: productData.videoUrl,
        });

        // Create inventory entries if provided
        if (productData.inventory) {
            for (const inv of productData.inventory) {
                await client!.mutation(api.inventory.upsert, {
                    productId: productId as Id<"products">,
                    colorName: inv.colorName,
                    size: inv.size,
                    quantity: inv.quantity,
                });
            }
        }

        return {
            id: productId as string,
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
            videoUrl: productData.videoUrl,
        };
    } catch (error) {
        console.error('Error creating product:', error);
        return null;
    }
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<boolean> => {
    if (IS_MOCK_MODE) return false;

    try {
        await client!.mutation(api.products.update, {
            id: id as Id<"products">,
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
            videoUrl: productData.videoUrl,
        });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean; error?: string }> => {
    if (IS_MOCK_MODE) return { success: false, error: 'Não é possível excluir em modo demonstração.' };

    try {
        // Check if it's a generic product (not a Convex ID)
        if (!id.includes('_')) {
            return { success: false, error: 'Produto genérico não pode ser excluído do banco.' };
        }

        await client!.mutation(api.products.remove, { id: id as Id<"products"> });
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message || 'Erro inesperado ao excluir o produto.' };
    }
};

// Users
export const getUsers = async (): Promise<User[]> => {
    if (IS_MOCK_MODE) return MOCK_USERS;

    try {
        const data = await client!.query(api.profiles.list, {});
        return data.map((profile: any) => ({
            id: profile.clerkUserId,
            name: profile.fullName || 'Usuário',
            email: profile.email,
            phone: profile.phone || undefined,
            isAdmin: profile.isAdmin,
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const toggleUserAdmin = async (userId: string, isAdmin: boolean): Promise<boolean> => {
    if (IS_MOCK_MODE) return false;

    try {
        // We need the profile ID, not the clerk user ID
        const profile = await client!.query(api.profiles.getByClerkId, { clerkUserId: userId });
        if (!profile) return false;

        await client!.mutation(api.profiles.toggleAdmin, {
            profileId: profile._id,
            isAdmin,
        });
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
        const data = await client!.query(api.orders.list, {});

        return data.map((order: any) => ({
            id: order._id,
            userId: order.userId,
            userName: order.userName || 'Usuário',
            userEmail: order.userEmail || '',
            userPhone: order.userPhone || '',
            status: order.status as Order['status'],
            total: order.total,
            shippingAddress: order.shippingAddress,
            items: (order.items || []).map((item: any) => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price: item.price,
            })),
            stripePaymentId: order.stripePaymentId,
            createdAt: order._creationTime ? new Date(order._creationTime).toISOString() : '',
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
    if (IS_MOCK_MODE) return false;

    try {
        await client!.mutation(api.orders.updateStatus, {
            orderId: orderId as Id<"orders">,
            status,
        });
        return true;
    } catch (error: any) {
        console.error('Error updating order status:', error);
        alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        return false;
    }
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
    if (IS_MOCK_MODE) return false;

    try {
        await client!.mutation(api.orders.remove, { orderId: orderId as Id<"orders"> });
        return true;
    } catch (error) {
        console.error('Error deleting order:', error);
        return false;
    }
};

// Inventory
export const getInventory = async (): Promise<ProductInventory[]> => {
    if (IS_MOCK_MODE) return MOCK_INVENTORY;

    try {
        const [products, inventoryData] = await Promise.all([
            getProducts(),
            client!.query(api.inventory.list, {}),
        ]);

        const inventory = inventoryData.map((item: any) => ({
            id: item._id,
            productId: item.productId,
            productName: item.productName || 'Produto',
            colorName: item.colorName,
            size: item.size,
            quantity: item.quantity,
            updatedAt: item._creationTime ? new Date(item._creationTime).toISOString() : '',
        }));

        const inventoryMap = new Map();
        inventory.forEach((item: any) => {
            inventoryMap.set(`${item.productId}-${item.colorName}-${item.size}`, item);
        });

        const allItems: ProductInventory[] = [];

        products.forEach(product => {
            product.colors.forEach(color => {
                product.sizes.forEach(size => {
                    const key = `${product.id}-${color.name}-${size}`;
                    const existing = inventoryMap.get(key);

                    if (existing) {
                        allItems.push(existing);
                    } else {
                        const dbMatch = inventory.find((i: any) =>
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
            if (a.productName !== b.productName) return a.productName.localeCompare(b.productName);
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
    if (IS_MOCK_MODE) return false;

    try {
        await client!.mutation(api.inventory.upsert, {
            productId: item.productId as Id<"products">,
            colorName: item.colorName,
            size: item.size,
            quantity: quantity,
        });
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
    if (IS_MOCK_MODE) return false;

    try {
        await client!.mutation(api.inventory.update, {
            id: inventoryId as Id<"inventory">,
            quantity,
        });
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
    if (IS_MOCK_MODE) return false;

    try {
        await client!.mutation(api.inventory.upsert, {
            productId: productId as Id<"products">,
            colorName,
            size,
            quantity,
        });
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

// File upload through Convex Storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
    if (IS_MOCK_MODE) return null;

    try {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmsfgqxx6';
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'mendonca_presets';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // Upload to Cloudinary using a direct fetch call (browser-compatible)
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith('video') ? 'video' : 'image'}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error('Cloudinary upload error:', error);
            throw new Error('Cloudinary upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error: any) {
        console.error('Error uploading to Cloudinary:', error);
        return null;
    }
};

export const uploadProductVideo = async (file: File): Promise<string | null> => {
    return uploadProductImage(file);
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
