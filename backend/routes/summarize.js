const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const User = require("../models/User");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { text,userId } = req.body;
    console.log("📩 Incoming summarize request...");
    console.log("👉 text received?", text ? "YES" : "NO");
    console.log("👉 userId received:", userId); // ✅ This will tell us what backend sees

    // ❗ Add this check
    if (!userId) {
      console.log("❌ ERROR: userId is missing in body");
      return res.status(400).json({ error: "userId missing in request" });
    }
    const prompt = `
Return ONLY valid JSON. No extra text. No markdown.

{
  "hackName": "",
  "platform": "",
  "deadline": "",
  "location": "",
  "prizePool": "",
  "description": "",
  "domains": [],
  "stages": [{ "name": "", "start": "", "end": "" }],
  "rewards": { "winner": "", "participant": "" }
}

TEXT:
${text}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You must return ONLY JSON. No explanation." },
        { role: "user", content: prompt }
      ],
      temperature: 0,
    });

    let output = response.choices?.[0]?.message?.content;

    // ✅ Extract only JSON (ignore any extra text)
    const firstBrace = output.indexOf("{");
    const lastBrace = output.lastIndexOf("}");
    const cleanJsonText = output.slice(firstBrace, lastBrace + 1);
    console.log("🟡 Received userId:", userId);

    // ✅ Convert to JSON object
    const parsedJson = JSON.parse(cleanJsonText);

    await User.findByIdAndUpdate(
      userId,
      { $push: { hackathonList: parsedJson } },  // <-- THIS PUSHES THE DATA
      { new: true }
    );

    console.log("✅ Hackathon stored into DB and returned to frontend");
    res.json(parsedJson);

  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ error: "Summarization failed" });
  }
});

module.exports = router;