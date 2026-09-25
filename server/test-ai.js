/**
 * Test your Groq API key:
 *   cd server
 *   node test-ai.js
 */
require("dotenv").config();

const apiKey = process.env.GROQ_API_KEY;

console.log("=== Groq API Key Test ===");
console.log("Key present:", !!apiKey);
console.log("Key format:", apiKey ? `${apiKey.slice(0, 8)}... (${apiKey.length} chars)` : "MISSING");
console.log("Node version:", process.version);
console.log("");

if (!apiKey || apiKey === "YOUR_GROQ_API_KEY_HERE") {
  console.error("❌ No Groq API key in .env");
  console.log("Add this to server/.env:");
  console.log("GROQ_API_KEY=gsk_...");
  process.exit(1);
}

console.log("🔄 Testing connection to Groq API...\n");

fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    max_tokens: 30,
    messages: [
      { role: "system", content: "You are a test assistant." },
      { role: "user", content: "Reply with exactly: Library AI is working!" }
    ],
  }),
})
.then(async (res) => {
  const body = await res.json();
  if (res.ok) {
    const text = body.choices?.[0]?.message?.content;
    console.log("✅ SUCCESS! Groq replied:", text);
    console.log("\n🚀 Your AI features are ready!");
    console.log("1. Update server/.env with your full key: GROQ_API_KEY=gsk_...");
    console.log("2. Restart server: npm run dev");
    console.log("3. Open the chatbot and ask anything!");
  } else {
    console.error("❌ API Error", res.status, ":", body.error?.message || JSON.stringify(body));
    if (res.status === 401) console.log("→ Invalid API key. Get a new one at console.groq.com");
    if (res.status === 429) console.log("→ Rate limit hit. Wait a moment and try again.");
  }
})
.catch((err) => {
  console.error("❌ Network Error:", err.message);
  console.log("→ Cannot reach api.groq.com. Check your internet connection.");
});
