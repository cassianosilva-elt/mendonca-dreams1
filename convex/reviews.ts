import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByProductId = query({
    args: { productId: v.id("products") },
    handler: async (ctx, { productId }) => {
        return await ctx.db
            .query("reviews")
            .withIndex("by_productId", (q) => q.eq("productId", productId))
            .order("desc")
            .collect();
    },
});

export const add = mutation({
    args: {
        productId: v.id("products"),
        userId: v.string(),
        userName: v.string(),
        rating: v.number(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("reviews", args);
    },
});
