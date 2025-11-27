'use server';

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveResume(content) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    let user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
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
        const resume = await db.resume.upsert({
            where: {
                userId: user.id,
            },
            update: {
                content,
            },
            create: {
                userId: user.id,
                content,
            },
        });
        revalidatePath("/resume");
        return resume;
    } catch (error) {
        console.error("Error saving resume:", error.message);
        throw new Error("Failed to save resume");
    }
}