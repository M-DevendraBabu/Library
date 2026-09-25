/**
 * Run this to find which AI provider your key belongs to:
 *   cd server
 *   node find-api-provider.js YOUR_API_KEY_HERE
 */

const key = process.argv[2];

if (!key) {
  console.log("Usage: node find-api-provider.js YOUR_API_KEY");
  process.exit(1);
}

console.log("🔍 Testing your API key against all major AI providers...");
console.log(`Key: ${key.slice(0, 8)}... (${key.length} chars)\n`);

const tests = [
  {
    name: "OpenAI (GPT-4)",
    test: async () => {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "gpt-3.5-turbo", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      const body = await res.json();
      return res.ok ? { ok: true, detail: body.choices?.[0]?.message?.content } : { ok: false, error: body.error?.message };
    }
  },
  {
    name: "Groq (Llama / Mixtral)",
    test: async () => {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "llama3-8b-8192", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      const body = await res.json();
      return res.ok ? { ok: true, detail: body.choices?.[0]?.message?.content } : { ok: false, error: body.error?.message };
    }
  },
  {
    name: "Mistral AI",
    test: async () => {
      const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "mistral-small-latest", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      const body = await res.json();
      return res.ok ? { ok: true, detail: body.choices?.[0]?.message?.content } : { ok: false, error: body.error?.message };
    }
  },
  {
    name: "Cohere",
    test: async () => {
      const res = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "command", max_tokens: 10, prompt: "hi" }),
      });
      const body = await res.json();
      return res.ok ? { ok: true, detail: body.generations?.[0]?.text } : { ok: false, error: body.message };
    }
  },
  {
    name: "Together AI",
    test: async () => {
      const res = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "meta-llama/Llama-3-8b-chat-hf", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      const body = await res.json();
      return res.ok ? { ok: true, detail: body.choices?.[0]?.message?.content } : { ok: false, error: body.error?.message };
    }
  },
  {
    name: "Hugging Face",
    test: async () => {
      const res = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ inputs: "hi", parameters: { max_new_tokens: 10 } }),
      });
      return res.ok ? { ok: true, detail: "HuggingFace accepted the key" } : { ok: false, error: `Status ${res.status}` };
    }
  },
  {
    name: "Perplexity AI",
    test: async () => {
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "llama-3-sonar-small-32k-chat", max_tokens: 10, messages: [{ role: "user", content: "hi" }] }),
      });
      const body = await res.json();
      return res.ok ? { ok: true, detail: body.choices?.[0]?.message?.content } : { ok: false, error: body.error?.message };
    }
  },
];

(async () => {
  let found = false;
  for (const { name, test } of tests) {
    process.stdout.write(`  Testing ${name}... `);
    try {
      const result = await test();
      if (result.ok) {
        console.log(`✅ MATCH! Your key works with ${name}`);
        console.log(`   Response: "${result.detail}"`);
        found = true;
      } else {
        const errMsg = result.error || "";
        // 401/invalid key = wrong provider, skip quietly
        // 429 = right provider, quota issue
        if (errMsg.toLowerCase().includes("quota") || errMsg.toLowerCase().includes("rate") || errMsg.toLowerCase().includes("limit")) {
          console.log(`⚠️  POSSIBLE MATCH — key valid but quota exceeded`);
          found = true;
        } else {
          console.log(`✗  Not this one`);
        }
      }
    } catch(e) {
      console.log(`✗  ${e.message.slice(0, 50)}`);
    }
  }

  console.log("");
  if (!found) {
    console.log("❌ Key didn't match any provider.");
    console.log("It might be for: Azure OpenAI, AWS Bedrock, Vertex AI, or another service.");
    console.log("Check where you originally got this key.");
  }
})();
