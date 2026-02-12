import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").order("desc").collect();

        // Enrich with items and profile data
        const enriched = [];
        for (const order of orders) {
            const items = await ctx.db
                .query("orderItems")
                .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
                .collect();

            const profile = await ctx.db
                .query("profiles")
                .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", order.userId))
                .unique();

            enriched.push({
                ...order,
                items,
                userName: profile?.fullName || "Usuário",
                userEmail: profile?.email || "",
                userPhone: profile?.phone || "",
            });
        }
        return enriched;
    },
});

export const getByUserId = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        const enriched = [];
        for (const order of orders) {
            const items = await ctx.db
                .query("orderItems")
                .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
                .collect();

            enriched.push({
                ...order,
                items,
            });
        }
        return enriched;
    },
});

export const create = mutation({
    args: {
        userId: v.string(),
        total: v.number(),
        shippingAddress: v.any(),
        items: v.array(
            v.object({
                productId: v.string(),
                productName: v.string(),
                quantity: v.number(),
                size: v.string(),
                color: v.string(),
                price: v.number(),
                imageUrl: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, { userId, total, shippingAddress, items }) => {
        const orderId = await ctx.db.insert("orders", {
            userId,
            status: "pending",
            total,
            shippingAddress,
        });

        for (const item of items) {
            await ctx.db.insert("orderItems", {
                orderId,
                ...item,
            });
        }

        // Clear cart after order
        const cart = await ctx.db
            .query("carts")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (cart) {
            const cartItems = await ctx.db
                .query("cartItems")
                .withIndex("by_cartId", (q) => q.eq("cartId", cart._id))
                .collect();

            for (const item of cartItems) {
                await ctx.db.delete(item._id);
            }
        }

        return orderId;
    },
});

export const updateStatus = mutation({
    args: {
        orderId: v.id("orders"),
        status: v.string(),
    },
    handler: async (ctx, { orderId, status }) => {
        await ctx.db.patch(orderId, { status });
        return true;
    },
});

export const remove = mutation({
    args: { orderId: v.id("orders") },
    handler: async (ctx, { orderId }) => {
        // Delete order items first
        const items = await ctx.db
            .query("orderItems")
            .withIndex("by_orderId", (q) => q.eq("orderId", orderId))
            .collect();

        for (const item of items) {
            await ctx.db.delete(item._id);
        }

        // Delete the order
        await ctx.db.delete(orderId);
        return true;
    },
});
