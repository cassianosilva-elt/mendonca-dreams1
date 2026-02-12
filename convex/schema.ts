import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
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
        .index("by_slug", ["slug"])
        .index("by_category", ["category"]),

    profiles: defineTable({
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
        isAdmin: v.boolean(),
    }).index("by_clerkUserId", ["clerkUserId"]),

    carts: defineTable({
        userId: v.string(),
    }).index("by_userId", ["userId"]),

    cartItems: defineTable({
        cartId: v.id("carts"),
        productId: v.id("products"),
        size: v.string(),
        color: v.string(),
        quantity: v.number(),
    }).index("by_cartId", ["cartId"]),

    orders: defineTable({
        userId: v.string(),
        status: v.string(),
        total: v.number(),
        shippingAddress: v.any(),
        stripePaymentId: v.optional(v.string()),
    }).index("by_userId", ["userId"]),

    orderItems: defineTable({
        orderId: v.id("orders"),
        productId: v.string(),
        productName: v.string(),
        quantity: v.number(),
        size: v.string(),
        color: v.string(),
        price: v.number(),
        imageUrl: v.optional(v.string()),
    }).index("by_orderId", ["orderId"]),

    inventory: defineTable({
        productId: v.id("products"),
        colorName: v.string(),
        size: v.string(),
        quantity: v.number(),
    })
        .index("by_productId", ["productId"])
        .index("by_product_color_size", ["productId", "colorName", "size"]),

    reviews: defineTable({
        productId: v.id("products"),
        userId: v.string(),
        userName: v.string(),
        rating: v.number(),
        comment: v.string(),
    }).index("by_productId", ["productId"]),
});
