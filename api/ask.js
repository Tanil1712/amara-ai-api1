
import OpenAI from "openai";

export default async function handler(req, res) {
// ✅ Simple GET test
if (req.method === "GET") {
return res.status(200).json({ message: "Amara AI API is working 🚀" });
}

// ❌ Only allow POST for real usage
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { message, context, mode } = req.body;

if (!message) {
return res.status(400).json({ error: "No message provided" });
}

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

let systemPrompt = "";

if (mode === "step_by_step") {
systemPrompt = `
You are Amara, a patient and intelligent secondary school teacher.

Rules:
- Teach step by step.
- Show formulas clearly.
- Explain reasoning.
- Make it simple and structured.
`;
} else {
systemPrompt = `
You are Amara, a helpful academic assistant.
Give clear and correct answers.
`;
}

const response = await openai.responses.create({
model: "gpt-4o-mini",
input: [
{
role: "system",
content: systemPrompt,
},
{
role: "user",
content: `
Homework Context:
${context || "None"}

Student Question:
${message}
`,
},
],
});

const reply =
response.output?.[0]?.content?.[0]?.text || "No response generated.";

return res.status(200).json({ reply });

} catch (error) {
console.error("AI ERROR:", error);
return res.status(500).json({
error: "AI failed",
details: error.message,
});
}
}