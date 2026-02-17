import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").order("desc").collect();
        return await Promise.all(
            products.map(async (product) => {
                const imageUrls = await Promise.all(
                    product.images.map(async (img) => {
                        if (img.startsWith("http")) return img;
                        const url = await ctx.storage.getUrl(img);
                        return url || img;
                    })
                );
                return { ...product, images: imageUrls };
            })
        );
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, { slug }) => {
        const product = await ctx.db
            .query("products")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique();
        if (!product) return null;

        const imageUrls = await Promise.all(
            product.images.map(async (img) => {
                if (img.startsWith("http")) return img;
                const url = await ctx.storage.getUrl(img);
                return url || img;
            })
        );
        return { ...product, images: imageUrls };
    },
});

export const getById = query({
    args: { id: v.id("products") },
    handler: async (ctx, { id }) => {
        return await ctx.db.get(id);
    },
});

export const create = mutation({
    args: {
        slug: v.string(),
        name: v.string(),
        category: v.string(),
        price: v.number(),
        images: v.array(v.string()),
        description: v.string(),
        details: v.string(),
        composition: v.string(),
        sizes: v.array(v.string()),
        colors: v.array(v.object({ name: v.string(), hex: v.string() })),
        videoUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("products", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        slug: v.optional(v.string()),
        name: v.optional(v.string()),
        category: v.optional(v.string()),
        price: v.optional(v.number()),
        images: v.optional(v.array(v.string())),
        description: v.optional(v.string()),
        details: v.optional(v.string()),
        composition: v.optional(v.string()),
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.object({ name: v.string(), hex: v.string() }))),
        videoUrl: v.optional(v.string()),
    },
    handler: async (ctx, { id, ...updates }) => {
        // Filter out undefined values
        const filtered: Record<string, any> = {};
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) filtered[key] = value;
        }
        await ctx.db.patch(id, filtered);
        return true;
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, { id }) => {
        // Delete related inventory
        const inventoryItems = await ctx.db
            .query("inventory")
            .withIndex("by_productId", (q) => q.eq("productId", id))
            .collect();
        for (const item of inventoryItems) {
            await ctx.db.delete(item._id);
        }

        // Delete related reviews
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_productId", (q) => q.eq("productId", id))
            .collect();
        for (const review of reviews) {
            await ctx.db.delete(review._id);
        }

        // Delete the product
        await ctx.db.delete(id);
        return true;
    },
});

export const importBatch = mutation({
    args: {
        products: v.array(
            v.object({
                slug: v.string(),
                name: v.string(),
                category: v.string(),
                price: v.number(),
                images: v.array(v.string()),
                description: v.string(),
                details: v.string(),
                composition: v.string(),
                sizes: v.array(v.string()),
                colors: v.array(v.object({ name: v.string(), hex: v.string() })),
                videoUrl: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, { products }) => {
        // Check existing slugs to avoid duplicates
        const existing = await ctx.db.query("products").collect();
        const existingSlugs = new Set(existing.map((p) => p.slug));

        let count = 0;
        for (const product of products) {
            if (!existingSlugs.has(product.slug)) {
                await ctx.db.insert("products", product);
                count++;
            }
        }
        return count;
    },
});
