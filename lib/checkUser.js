import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";

// Returns the DB user record for the currently authenticated Clerk user.
// This function is defensive: if Clerk or the DB are not available it returns null
// and logs a helpful warning instead of throwing so server routes can fallback.
export const checkUser = async () => {
    try {
        const { userId } = getAuth();
        if (!userId) return null;

        // Try to find an existing user in our DB. If the DB is not configured or
        // the Prisma client fails, we catch and return null so callers can continue
        // with a non-persisted flow (e.g., guest behavior or mock data).
        try {
            const existing = await db.user.findUnique({ where: { clerkUserId: userId } });
            if (existing) return existing;

            // If no DB record, try to create a minimal one. We don't have full Clerk
            // profile here (getAuth returns userId only on the server), so create a
            // lightweight placeholder. Wrap in try/catch to avoid blocking callers.
            try {
                const created = await db.user.create({
                    data: {
                        clerkUserId: userId,
                        email: `${userId}@clerk.local`,
                        name: null,
                    },
                });
                return created;
            } catch (createErr) {
                // Handle unique constraint error for email
                if (createErr.code === 'P2002' && createErr.meta?.target?.includes('email')) {
                    console.warn("checkUser: email already exists, returning null");
                    return null;
                }
                throw createErr;
            }
        } catch (dbErr) {
            console.warn("checkUser: database unavailable or query failed:", dbErr?.message ?? dbErr);
            return null;
        }
    } catch (err) {
        console.warn("checkUser: Clerk getAuth failed or running in a non-server context:", err?.message ?? err);
        return null;
    }
};