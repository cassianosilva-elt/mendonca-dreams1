import { supabase, IS_MOCK_MODE } from './supabase';
import { CartItem } from '../types';

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
    if (IS_MOCK_MODE) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, orderId: 'mock-order-' + Math.random().toString(36).substr(2, 9) };
    }

    try {
        // 1. Create Order Record
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                status: 'pending', // Initial status
                total: total,
                shipping_address: shippingAddress,
                stripe_payment_id: null // Placeholder for real payment integration
            })
            .select()
            .single();

        if (orderError) throw new Error(`Erro ao criar pedido: ${orderError.message}`);

        // 2. Create Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            size: item.selectedSize || 'N/A',
            color: item.selectedColor || 'N/A',
            quantity: item.quantity,
            image_url: item.images[0]
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw new Error(`Erro ao salvar itens do pedido: ${itemsError.message}`);

        // 3. Clear Cart (Optional: can be handled by UI or Trigger)
        const { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).single();
        if (cart) {
            await supabase.from('cart_items').delete().eq('cart_id', cart.id);
        }

        // 4. Send Confirmation Email (Async - don't block user)
        import('./email').then(({ sendOrderConfirmationEmail }) => {
            sendOrderConfirmationEmail({
                id: order.id,
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                status: 'pending',
                total: total,
                shippingAddress: shippingAddress,
                items: items.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    size: item.selectedSize || 'N/A',
                    color: item.selectedColor || 'N/A',
                    price: item.price
                })),
                createdAt: new Date().toISOString()
            }).catch(err => console.error('Silent email failure:', err));
        });

        return { success: true, orderId: order.id };

    } catch (error: any) {
        console.error('Checkout error:', error);
        return { success: false, error: error.message };
    }
};
