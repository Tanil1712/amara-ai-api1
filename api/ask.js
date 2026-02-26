
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
// ✅ CORS (important for mobile + browser testing)
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
return res.status(200).end();
}

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { message, context, mode } = req.body;

if (!message) {
return res.status(400).json({ error: "Message is required" });
}

// 🎓 System behavior control
let systemPrompt = "You are Amara, a helpful academic AI assistant.";

if (mode === "step_by_step") {
systemPrompt = `
You are Amara, a patient and intelligent secondary school teacher.

Rules:
- Teach step by step.
- Show formulas clearly.
- Explain reasoning clearly.
- Keep explanations simple and structured.
- Make it easy for students.
`;
}

const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: systemPrompt },
{
role: "user",
content: `
Context:
${context || "None"}

Student Question:
${message}
`,
},
],
});

return res.status(200).json({
reply: completion.choices[0].message.content,
});

} catch (error) {
console.error("AI ERROR:", error);

return res.status(500).json({
error: "AI error",
details: error.message,
});
}
