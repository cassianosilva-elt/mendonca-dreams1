import { Order } from '../types';
import { supabase } from './supabase';

export const sendOrderConfirmationEmail = async (order: Order) => {
    try {
        const { data, error } = await supabase.functions.invoke('send-order-email', {
            body: { order }
        });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error('Error calling email function:', error);
        return { success: false, error: error.message };
    }
};
