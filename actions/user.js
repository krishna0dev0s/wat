"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  let user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId: userId,
        email: (await auth()).sessionClaims?.email || "unknown@example.com",
        name: (await auth()).sessionClaims?.name || "User",
      },
    });
  }

  try {
    console.log("Received data:", data); // Debug log

    // Input validation with specific error messages
    if (!data.industry) throw new Error("Industry is required");
    if (!data.experience) throw new Error("Experience is required");
    if (!data.bio) throw new Error("Bio is required");
    if (!data.skills) throw new Error("Skills are required");

    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        try {
          // First check if industry exists
          let industryInsight = await tx.industryInsight.findUnique({
            where: {
              industry: data.industry,
            },
          });

          // If industry doesn't exist, create it with AI-generated insights
          if (!industryInsight) {
            console.log("Generating insights for industry:", data.industry); // Debug log
            const insights = await generateAIInsights(data.industry);
            
            industryInsight = await tx.industryInsight.create({
              data: {
                industry: data.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
          }

          // Prepare user data
          const userData = {
            industry: data.industry,
            experience: parseInt(data.experience, 10),
            bio: data.bio,
            skills: Array.isArray(data.skills) ? data.skills : [data.skills],
          };

          console.log("Updating user with data:", userData); // Debug log

          // Now update the user
          const updatedUser = await tx.user.update({
            where: {
              id: user.id,
            },
            data: userData,
          });

          return { updatedUser, industryInsight };
        } catch (txError) {
          console.error("Transaction error:", txError);
          throw txError; // Re-throw to be caught by outer try-catch
        }
      },
      {
        timeout: 15000, // Increased timeout
      }
    );

    console.log("Update successful:", result); // Debug log
    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", {
      message: error.message,
      stack: error.stack,
    });
    // Throw specific error messages
    if (error.code === 'P2002') {
      throw new Error("This industry already exists");
    }
    if (error.code === 'P2025') {
      throw new Error("User record not found");
    }
    throw new Error(error.message || "Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    let user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await db.user.create({
        data: {
          clerkUserId: userId,
          email: (await auth()).sessionClaims?.email || "unknown@example.com",
          name: (await auth()).sessionClaims?.name || "User",
        },
        select: { industry: true },
      });
    }

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
