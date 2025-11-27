import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
    try {
        const User = await currentUser();
        if (!User) {
            return null;
        }
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: User.id,
            },
        });
        if (loggedInUser) {  
            return loggedInUser;
        }
        const name = `${User.firstName} ${User.lastName}`;

        try {
            const newUser = await db.user.create({
                data: {
                    clerkUserId: User.id,
                    name,
                    imageUrl: User.imageUrl,
                    email: User.emailAddresses[0].emailAddress,
                },
            });
            return newUser;
        } catch (createErr) {
            // Handle unique constraint error for email
            if (createErr.code === 'P2002' && createErr.meta?.target?.includes('email')) {
                // Email already exists, try to find by email
                const existingUser = await db.user.findUnique({
                    where: { email: User.emailAddresses[0].emailAddress },
                });
                if (existingUser) return existingUser;
                
                // Fallback: create with clerk-generated email
                const newUser = await db.user.create({
                    data: {
                        clerkUserId: User.id,
                        name,
                        imageUrl: User.imageUrl,
                        email: `${User.id}@clerk.local`,
                    },
                });
                return newUser;
            }
            throw createErr;
        }
    } catch (error) {
        console.error("Error in checkUser:", error);
        return null;
    }
}