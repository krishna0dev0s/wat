"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateAIInsights = async (industry) => {
  try {
    console.log(`Generating insights for ${industry} industry...`);

    const prompt = `
          You are a professional industry analyst specializing in the Indian job market. Analyze the current state of the ${industry} industry in India (2025) and provide insights in the following JSON format.
          
          Requirements:
          1. ONLY return valid JSON, no other text
          2. Include EXACTLY 5 roles in salaryRanges with accurate salary data for India (in Indian Rupees - INR)
          3. Growth rate must be a realistic percentage for ${industry} in India
          4. Include EXACTLY 5 items in topSkills, keyTrends, and recommendedSkills
          5. All data must be specific to ${industry} in India and current as of 2025
          6. Salary ranges must reflect current Indian market rates in INR (Annual salary in Rupees)
          7. Location should be major Indian tech hubs (e.g., Bangalore, Mumbai, Hyderabad, Delhi NCR, Pune)
          8. Focus on demand and trends specific to India
          
          Format:
          {
            "salaryRanges": [
              { "role": "string", "min": number (INR), "max": number (INR), "median": number (INR), "location": "string (Indian city)" }
            ],
            "growthRate": number (percentage),
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2", "trend3", "trend4", "trend5"],
            "recommendedSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"]
          }
          
          Note: Salary examples for reference:
          - Freshers: 3,00,000 - 8,00,000 INR
          - Mid-level: 10,00,000 - 25,00,000 INR
          - Senior: 25,00,000 - 60,00,000+ INR
        `;

    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to generate insights...`);
        
        const result = await model.generateContent(prompt);
        if (!result?.response) {
          throw new Error("No response from AI model");
        }

        const text = result.response.text();
        console.log("Raw AI response:", text);
        
        // Clean and parse the response
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const parsedData = JSON.parse(cleanedText);

        // Validate the data structure
        const validation = validateInsightsData(parsedData);
        if (!validation.isValid) {
          throw new Error(`Invalid data structure: ${validation.errors.join(", ")}`);
        }

        console.log("Successfully generated and validated insights");
        return parsedData;

      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        lastError = error;
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    throw new Error(`Failed to generate insights after ${maxRetries} attempts: ${lastError.message}`);
    
  } catch (error) {
    console.error("Error in generateAIInsights:", error);
    throw new Error(`Failed to generate industry insights: ${error.message}`);
  }
};

function validateInsightsData(data) {
  const errors = [];

  // Check salaryRanges
  if (!Array.isArray(data.salaryRanges) || data.salaryRanges.length !== 5) {
    errors.push("salaryRanges must contain exactly 5 roles");
  }

  // Validate each salary range
  data.salaryRanges?.forEach((range, index) => {
    if (!range.role || !range.min || !range.max || !range.median || !range.location) {
      errors.push(`Salary range ${index + 1} is missing required fields`);
    }
    if (range.min > range.max || range.median < range.min || range.median > range.max) {
      errors.push(`Salary range ${index + 1} has invalid salary values`);
    }
  });

  // Check growth rate
  if (typeof data.growthRate !== "number" || data.growthRate < -100 || data.growthRate > 1000) {
    errors.push("Invalid growth rate");
  }

  // Check demand level
  if (!["High", "Medium", "Low"].includes(data.demandLevel)) {
    errors.push("Invalid demand level");
  }

  // Check arrays have exactly 5 items
  const arrayFields = ["topSkills", "keyTrends", "recommendedSkills"];
  arrayFields.forEach(field => {
    if (!Array.isArray(data[field]) || data[field].length !== 5) {
      errors.push(`${field} must contain exactly 5 items`);
    }
  });

  // Check market outlook
  if (!["Positive", "Neutral", "Negative"].includes(data.marketOutlook)) {
    errors.push("Invalid market outlook");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}


export async function getIndustryInsights() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in to access industry insights");
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found. Please complete your profile first.");
    }

    if (!user.industry) {
      throw new Error("Industry not specified. Please update your profile.");
    }

    const now = new Date();
    const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    // Get existing insights for this industry
    let industryInsights = await db.industryInsight.findUnique({
      where: { industry: user.industry },
    });

    // Case 1: No insights exist - generate new ones
    if (!industryInsights) {
      console.log("No existing insights found. Generating new insights...");
      const insights = await generateAIInsights(user.industry);

      industryInsights = await db.industryInsight.create({
        data: {
          industry: user.industry,
          ...insights,
          lastUpdated: now,
          nextUpdate: new Date(now.getTime() + UPDATE_INTERVAL),
        },
      });

      return industryInsights;
    }

    // Case 2: Insights exist but are outdated - refresh them
    if (industryInsights.nextUpdate < now) {
      console.log("Insights are outdated. Generating fresh insights...");
      const newInsights = await generateAIInsights(user.industry);

      const updatedInsights = await db.industryInsight.update({
        where: { industry: user.industry },
        data: {
          ...newInsights,
          lastUpdated: now,
          nextUpdate: new Date(now.getTime() + UPDATE_INTERVAL),
        },
      });

      return updatedInsights;
    }

    // Case 3: Return existing valid insights
    console.log("Using existing valid insights");
    return industryInsights;

  } catch (error) {
    console.error("Error in getIndustryInsights:", error);
    throw new Error(`Failed to get industry insights: ${error.message}`);
  }
}
