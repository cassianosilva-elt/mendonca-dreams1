import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByClerkId = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, { clerkUserId }) => {
        return await ctx.db
            .query("profiles")
            .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
            .unique();
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("profiles").collect();
    },
});

export const createOrUpdate = mutation({
    args: {
        clerkUserId: v.string(),
        email: v.string(),
        fullName: v.optional(v.string()),
        phone: v.optional(v.string()),
        cpf: v.optional(v.string()),
        birthDate: v.optional(v.string()),
        gender: v.optional(v.string()),
        shoppingFor: v.optional(v.string()),
        address: v.optional(v.any()),
        preferences: v.optional(v.any()),
        isAdmin: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", args.clerkUserId))
            .unique();

        if (existing) {
            const { clerkUserId, ...updates } = args;
            // Filter out undefined values
            const filtered: Record<string, any> = {};
            for (const [key, value] of Object.entries(updates)) {
                if (value !== undefined) filtered[key] = value;
            }
            await ctx.db.patch(existing._id, filtered);
            return existing._id;
        } else {
            return await ctx.db.insert("profiles", {
                ...args,
                isAdmin: args.isAdmin ?? false,
            });
        }
    },
});

export const toggleAdmin = mutation({
    args: {
        profileId: v.id("profiles"),
        isAdmin: v.boolean(),
    },
    handler: async (ctx, { profileId, isAdmin }) => {
        await ctx.db.patch(profileId, { isAdmin });
        return true;
    },
});
