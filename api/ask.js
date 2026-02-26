
import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { question } = req.body;

if (!question) {
return res.status(400).json({ error: "No question provided" });
}

const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "You are a helpful AI tutor." },
{ role: "user", content: question },
],
});

res.status(200).json({
answer: completion.choices[0].message.content,
});
} catch (error) {
console.error(error);
res.status(500).json({ error: "Something went wrong" });
}
}
