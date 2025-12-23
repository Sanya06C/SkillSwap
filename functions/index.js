const functions = require("firebase-functions");
// const fetch = require("node-fetch"); // Comment out for local testing

exports.askGemini = functions.https.onRequest(async (req, res) => {
  try {
    // Allow calls from browser
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    const skill = req.body.skill;
    if (!skill) {
      return res.status(400).json({ error: "Skill is required" });
    }

    // Prompt for Gemini (just for reference)
    const prompt = `
You are an AI learning guide.

A student wants to learn "${skill}".

Explain:
1. How they should start
2. Prerequisites (if any)
3. A simple beginner roadmap

Be friendly and concise.
`;

    // --- MOCK RESPONSE FOR LOCAL TESTING ---
    // Replace this with the real fetch when deploying with a valid API key
    const data = {
      candidates: [
        {
          content: [
            { parts: [{ text: `Mock reply: Here's how to start learning "${skill}"...`} ] }
          ]
        }
      ]
    };

    // Uncomment below to call real Gemini API later
    /*
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${functions.config().gemini.key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );
    const data = await response.json();
    */

    if (!data.candidates || data.candidates.length === 0) {
      return res.json({ reply: "No response from Gemini." });
    }

    const reply = data.candidates[0].content.parts[0].text;
    return res.json({ reply });

  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({ error: "Gemini failed" });
  }
});

