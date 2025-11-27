'use server';

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function improveWithAI({ current, type }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    let user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            id: true,
            industry: true,
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

    const prompt = `
    As an expert resume writer, enhance the following ${type} description for a ${user.industry} professional to reflect current industry standards and 2025 hiring trends. Make it more impactful, results-driven, and aligned with modern expectations.
Current content: "${current}"
Requirements:
- Use strong action verbs that reflect leadership, innovation, and execution
- Include quantifiable metrics, KPIs, or outcomes where applicable
- Highlight relevant technical tools, platforms, or methodologies used in 2025
- Keep it concise yet rich in detail (max 4–5 lines)
- Focus on accomplishments and measurable impact rather than duties
- Incorporate industry-specific keywords and terminology relevant to current roles and technologies
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const improvedContent = response.text().trim();
        return improvedContent;
    } catch (error) {
        console.error("Error improving content:", error);
        throw new Error("Failed to improve content");
    }
}