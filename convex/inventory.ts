import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const items = await ctx.db.query("inventory").collect();

        // Enrich with product name
        const enriched = [];
        for (const item of items) {
            const product = await ctx.db.get(item.productId);
            enriched.push({
                ...item,
                productName: product?.name || "Produto",
            });
        }
        return enriched;
    },
});

export const getByProductId = query({
    args: { productId: v.id("products") },
    handler: async (ctx, { productId }) => {
        return await ctx.db
            .query("inventory")
            .withIndex("by_productId", (q) => q.eq("productId", productId))
            .collect();
    },
});

export const upsert = mutation({
    args: {
        productId: v.id("products"),
        colorName: v.string(),
        size: v.string(),
        quantity: v.number(),
    },
    handler: async (ctx, { productId, colorName, size, quantity }) => {
        // Check if exists
        const existing = await ctx.db
            .query("inventory")
            .withIndex("by_product_color_size", (q) =>
                q.eq("productId", productId).eq("colorName", colorName).eq("size", size)
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { quantity });
            return existing._id;
        } else {
            return await ctx.db.insert("inventory", {
                productId,
                colorName,
                size,
                quantity,
            });
        }
    },
});

export const update = mutation({
    args: {
        id: v.id("inventory"),
        quantity: v.number(),
    },
    handler: async (ctx, { id, quantity }) => {
        await ctx.db.patch(id, { quantity });
        return true;
    },
});
