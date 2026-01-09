// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function analyzeText(accuser, accused) {
//   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//   const prompt = `
// Rewrite both statements neutrally.
// Remove names and replace with "Person A" , "Person B",... and make both staments person's the same alphabet like if person A is "A" then person B is "B" for both statements.
// Keep meaning exactly same.
// Return JSON:
// {
//  "A": "...",
//  "B": "...",
//  "summary": "..."
// }
// A: ${accuser}
// B: ${accused}
// `;

//   const result = await model.generateContent(prompt);
//   return JSON.parse(result.response.text());
// }



const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeText(accuser, accused) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  You are a JSON generator.

RULES:
- Output ONLY valid JSON
- No markdown
- No explanation
- No backticks
TASK:
Rewrite both statements neutrally.
Remove names and replace with "Person A" , "Person B",... and make both statements use the same letters.
Keep meaning exactly the same.

Return EXACT JSON in this format:

{
  "A": "string",
  "B": "string",
  "summary": "string"
}

Person A statement:
${accuser}

Person B statement:
${accused}
`;

  const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini raw output:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}

module.exports = {
  analyzeText
};
