import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/getFile",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
        const { searchParams } = new URL(request.url);
        const storageId = searchParams.get("storageId");
        if (!storageId) {
            return new Response("Missing storageId", { status: 400 });
        }

        const file = await ctx.storage.get(storageId);
        if (!file) {
            return new Response("File not found", { status: 404 });
        }

        const metadata = await ctx.storage.getMetadata(storageId);

        return new Response(file, {
            status: 200,
            headers: {
                "Content-Type": metadata?.contentType || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    }),
});

export default http;
