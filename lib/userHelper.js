import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

/**
 * Get or create a user from Clerk authentication
 * Auto-creates user in database if they don't exist yet
 */
export async function getOrCreateUser() {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized: Please sign in");
  }

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  // Auto-create user if doesn't exist
  if (!user) {
    try {
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: sessionClaims?.email || `${userId}@clerk.local`,
          name: sessionClaims?.name || "User",
        },
      });
    } catch (err) {
      // Handle unique constraint error for email
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        // Email already exists, try to find user by email or create with unique email
        const email = sessionClaims?.email;
        if (email) {
          user = await db.user.findUnique({
            where: { email },
          });
          if (user) return user;
        }
        // Generate unique email if conflict
        user = await db.user.create({
          data: {
            clerkUserId: userId,
            email: `${userId}@clerk.local`,
            name: sessionClaims?.name || "User",
          },
        });
      } else {
        throw err;
      }
    }
  }

  return user;
}
