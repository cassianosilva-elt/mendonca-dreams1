// Deno type declarations for Supabase Edge Functions
// This file provides type definitions so TypeScript doesn't show errors in the IDE

declare namespace Deno {
    /** The environment variables. */
    interface Env {
        get(key: string): string | undefined;
        set(key: string, value: string): void;
        delete(key: string): void;
        toObject(): { [key: string]: string };
    }

    /** The current environment variables. */
    const env: Env;

    /** 
     * Serves a request handler using a standard Request handler.
     * This is the modern way to define Supabase Edge Functions.
     */
    function serve(
        handler: (request: Request) => Response | Promise<Response>
    ): void;
}

// Allow importing from URLs in the IDE
declare module "https://*";
declare module "http://*";
declare module "std/*";
