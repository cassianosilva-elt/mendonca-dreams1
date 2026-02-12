import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByUserId = query({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        return await ctx.db
            .query("carts")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();
    },
});

export const getItems = query({
    args: { cartId: v.id("carts") },
    handler: async (ctx, { cartId }) => {
        const items = await ctx.db
            .query("cartItems")
            .withIndex("by_cartId", (q) => q.eq("cartId", cartId))
            .collect();

        // Enrich with product data
        const enriched = [];
        for (const item of items) {
            const product = await ctx.db.get(item.productId);
            if (product) {
                enriched.push({
                    ...item,
                    product,
                });
            }
        }
        return enriched;
    },
});

export const getOrCreateCart = mutation({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const existing = await ctx.db
            .query("carts")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (existing) return existing._id;
        return await ctx.db.insert("carts", { userId });
    },
});

export const addItem = mutation({
    args: {
        userId: v.string(),
        productId: v.id("products"),
        size: v.string(),
        color: v.string(),
    },
    handler: async (ctx, { userId, productId, size, color }) => {
        // Get or create cart
        let cart = await ctx.db
            .query("carts")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (!cart) {
            const cartId = await ctx.db.insert("carts", { userId });
            cart = (await ctx.db.get(cartId))!;
        }

        // Check if item already exists
        const existingItems = await ctx.db
            .query("cartItems")
            .withIndex("by_cartId", (q) => q.eq("cartId", cart._id))
            .collect();

        const existing = existingItems.find(
            (item) =>
                item.productId === productId &&
                item.size === size &&
                item.color === color
        );

        if (existing) {
            await ctx.db.patch(existing._id, { quantity: existing.quantity + 1 });
        } else {
            await ctx.db.insert("cartItems", {
                cartId: cart._id,
                productId,
                size,
                color,
                quantity: 1,
            });
        }
    },
});

export const updateItemQuantity = mutation({
    args: {
        itemId: v.id("cartItems"),
        quantity: v.number(),
    },
    handler: async (ctx, { itemId, quantity }) => {
        if (quantity <= 0) {
            await ctx.db.delete(itemId);
        } else {
            await ctx.db.patch(itemId, { quantity });
        }
    },
});

export const removeItem = mutation({
    args: { itemId: v.id("cartItems") },
    handler: async (ctx, { itemId }) => {
        await ctx.db.delete(itemId);
    },
});

export const clearCart = mutation({
    args: { userId: v.string() },
    handler: async (ctx, { userId }) => {
        const cart = await ctx.db
            .query("carts")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .unique();

        if (cart) {
            const items = await ctx.db
                .query("cartItems")
                .withIndex("by_cartId", (q) => q.eq("cartId", cart._id))
                .collect();

            for (const item of items) {
                await ctx.db.delete(item._id);
            }
        }
    },
});
