import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import { CartItem } from '../types';

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

interface CheckoutData {
    userId: string;
    userName: string;
    userEmail: string;
    items: CartItem[];
    total: number;
    shippingAddress: any;
    paymentMethod: string;
    paymentDetails: any;
}

export const createOrder = async ({ userId, userName, userEmail, items, total, shippingAddress }: CheckoutData) => {
    if (!client) {
        // Simulate network delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, orderId: 'mock-order-' + Math.random().toString(36).substr(2, 9) };
    }

    try {
        const orderId = await client.mutation(api.orders.create, {
            userId,
            total,
            shippingAddress,
            items: items.map(item => ({
                productId: item.id,
                productName: item.name,
                quantity: item.quantity,
                size: item.selectedSize || 'N/A',
                color: item.selectedColor || 'N/A',
                price: item.price,
                imageUrl: item.images[0],
            })),
        });

        // Email notification can be added later via Convex Actions
        return { success: true, orderId: orderId as string };

    } catch (error: any) {
        console.error('Checkout error:', error);
        return { success: false, error: error.message };
    }
};
