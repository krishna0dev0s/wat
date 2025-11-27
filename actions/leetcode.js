import { db } from "../lib/db";
import { generateSolutionWithGemini } from "../lib/gemini";
import { checkUser } from "../lib/checkUser";

// Server action to get or generate a LeetCode solution for a given problem number.
// This function is defensive: if Prisma/DB is unavailable it will still return
// a generated (non-persisted) solution. If GEMINI API key is missing it will
// return a clear mock payload.
export async function getLeetCodeSolution(problemNumber, opts = {}) {
  const asNumber = Number(problemNumber);
  const language = (opts.language || 'JavaScript');
  if (!asNumber || asNumber <= 0) {
    return { success: false, error: "Invalid problem number" };
  }

  // Try DB lookup first if DB appears configured.
  let persisted = false;
  try {
    if (db) {
      const found = await db.leetCodeSolution?.findUnique?.({ where: { problemNumber: asNumber } });
      if (found) {
        // The `solution` column stores a JSON string with keys approach, steps, code, examples
        let parsedSolution = null;
        try {
          parsedSolution = found.solution ? JSON.parse(found.solution) : null;
        } catch (e) {
          console.warn('getLeetCodeSolution: failed to parse persisted solution JSON', e?.message ?? e);
        }
        const payload = {
          id: found.id,
          problemNumber: found.problemNumber,
          title: found.title,
          difficulty: found.difficulty,
          topics: found.topics,
          timeComplexity: found.timeComplexity,
          spaceComplexity: found.spaceComplexity,
          // Ensure we surface a codeLanguage if present in persisted solution
          ...(parsedSolution || {}),
          codeLanguage: parsedSolution?.codeLanguage || found.codeLanguage || language,
        };
        return { success: true, data: payload, persisted: true };
      }
    }
  } catch (dbErr) {
    // Log and continue to generation fallback
    console.warn("getLeetCodeSolution: DB lookup failed, falling back to generation:", dbErr?.message ?? dbErr);
  }

  // Build a prompt description if provided
  const promptDescription = opts.description ?? "";

  // Try Gemini generation; if not available, return a mock solution object.
  let solution;
  try {
  solution = await generateSolutionWithGemini(asNumber, promptDescription, language);
  } catch (genErr) {
    console.warn("getLeetCodeSolution: Gemini generation failed, returning mock solution:", genErr?.message ?? genErr);
    solution = {
      title: `LeetCode problem ${asNumber} (mock)` ,
      difficulty: "Medium",
      topics: [],
      description: promptDescription || `Problem ${asNumber} description not available.`,
      approach: "Provide an efficient algorithmic approach here.",
      steps: ["1. Read input", "2. Apply algorithm", "3. Return output"],
      code: "// Example mock code\nfunction solution(input) { return null; }",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      examples: [{ input: "[1,2,3]", output: "6" }],
    };
  }

  // If DB is available, try to persist the generated solution for future use.
  try {
    if (db) {
      const created = await db.leetCodeSolution?.create?.({
        data: {
          problemNumber: asNumber,
          title: solution.title || `Problem ${asNumber}`,
          difficulty: solution.difficulty || "Medium",
          topics: solution.topics || [],
          // include codeLanguage inside the stored JSON so older schema doesn't need change
          solution: JSON.stringify({
            approach: solution.approach,
            steps: solution.steps,
            code: solution.code,
            examples: solution.examples,
            codeLanguage: solution.codeLanguage || language,
          }),
          timeComplexity: solution.timeComplexity || null,
          spaceComplexity: solution.spaceComplexity || null,
        },
      });
      if (created) {
        persisted = true;
        return { success: true, data: { ...solution, id: created.id }, persisted: true };
      }
    }
  } catch (persistErr) {
    console.warn("getLeetCodeSolution: failed to persist generated solution:", persistErr?.message ?? persistErr);
  }

  // Return generated (but not persisted) solution
  return { success: true, data: solution, persisted };
}

export default getLeetCodeSolution;
