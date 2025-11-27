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
    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: sessionClaims?.email || "unknown@example.com",
        name: sessionClaims?.name || "User",
      },
    });
  }

  return user;
}
