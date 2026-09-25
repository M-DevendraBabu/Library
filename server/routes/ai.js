const express     = require("express");
const router      = express.Router();
const Book        = require("../models/Book");
const Transaction = require("../models/Transaction");
const { protect } = require("../middleware/auth");

/* ═══════════════════════════════════════════════════════════════════
   Groq API  —  llama-3.3-70b-versatile  (free, fast, excellent)
═══════════════════════════════════════════════════════════════════ */
async function callGroq(systemPrompt, messages, maxTokens = 800) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "YOUR_GROQ_API_KEY_HERE") {
    console.log("⚠️  No GROQ_API_KEY in server/.env");
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content || ""),
          })),
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Groq API ${response.status}:`, errBody.slice(0, 300));
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) { console.error("Groq no text:", JSON.stringify(data).slice(0, 200)); return null; }
    return text;
  } catch (err) {
    console.error("Groq fetch error:", err.message);
    return null;
  }
}

/* Robust JSON parser — handles markdown fences, leading text, trailing text */
function parseJSON(text, fallback) {
  if (!text) return fallback;
  try {
    // Strip markdown fences
    let clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    // Try direct parse first
    return JSON.parse(clean);
  } catch {
    try {
      // Find first [ or { and last ] or }
      const arrStart = text.indexOf("[");
      const arrEnd   = text.lastIndexOf("]");
      const objStart = text.indexOf("{");
      const objEnd   = text.lastIndexOf("}");

      if (arrStart !== -1 && arrEnd > arrStart) {
        return JSON.parse(text.slice(arrStart, arrEnd + 1));
      }
      if (objStart !== -1 && objEnd > objStart) {
        return JSON.parse(text.slice(objStart, objEnd + 1));
      }
    } catch { /* fall through */ }
    return fallback;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   POST /api/ai/chat
═══════════════════════════════════════════════════════════════════ */
router.post("/chat", protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: "Message required" });

    const [myTx, allBooks] = await Promise.all([
      Transaction.find({ user: req.user._id })
        .populate("book", "title author category location")
        .sort({ createdAt: -1 }).limit(30),
      Book.find().select("title author category location availableCopies rating").lean(),
    ]);

    const active     = myTx.filter(t => t.status === "active"   && t.book);
    const overdue    = myTx.filter(t => t.status === "overdue"  && t.book);
    const reserved   = myTx.filter(t => t.status === "reserved" && t.book);
    const totalFines = myTx.reduce((s, t) => s + (t.fine || 0), 0);

    const fmt = (arr) => arr.length
      ? arr.map(t => `• "${t.book.title}" — due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-IN") : "N/A"}, shelf: ${t.book.location || "N/A"}, fine: ₹${t.fine || 0}`).join("\n")
      : "None";

    const catalogSample = allBooks.slice(0, 40)
      .map(b => `• "${b.title}" by ${b.author} [${b.category}] — ${b.availableCopies > 0 ? `${b.availableCopies} copies` : "out of stock"} — shelf: ${b.location || "N/A"} — ⭐${b.rating || "N/A"}`)
      .join("\n");

    const systemPrompt = `You are LibraryBot, a smart and friendly AI assistant for LibraryMS.

CURRENT USER: ${req.user.name} (${req.user.email})

=== LIVE LIBRARY STATUS ===
Active loans (${active.length}): ${fmt(active)}
Overdue (${overdue.length}): ${fmt(overdue)}
Reservations (${reserved.length}): ${reserved.length ? reserved.map(t => `• "${t.book.title}"`).join("\n") : "None"}
Total fines: ₹${totalFines} (₹5/day)

=== CATALOG (${allBooks.length} books) ===
${catalogSample}

=== POLICIES ===
14-day borrow | ₹5/day fine | 2 renewals per book (+14 days each) | Max 5 loans

=== NAVIGATION ===
Book Catalog → browse/reserve | My Books → loans/renew | AI Recommendations | Notifications | Help & Support
All returns processed by admin at library desk.

Be warm, helpful, concise (under 150 words). Use the user's REAL data. Never invent information.`;

    const messages = [
      ...history.slice(-10).map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "") })),
      { role: "user", content: message.trim() },
    ];

    const aiReply = await callGroq(systemPrompt, messages, 400);

    if (aiReply) {
      console.log(`✅ Groq chat: "${message.slice(0, 50)}"`);
      return res.json({ success: true, reply: aiReply, mode: "ai" });
    }

    /* Smart keyword fallback */
    const msg = message.toLowerCase().trim();
    const isGreeting = msg.length <= 5 ||
      /^(hi|hey|hlo|helo|hello|heya|yo|sup|namaste|howdy|good\s*(morning|afternoon|evening|day))/.test(msg);

    let reply;
    if (isGreeting) {
      reply = `Hello ${req.user.name}! 👋\n\n` +
        (active.length ? `📚 Active loans: ${active.length}` : "📚 No active loans.") +
        (overdue.length ? `\n⚠️ Overdue: ${overdue.length} — Fine: ₹${totalFines}` : "") +
        (reserved.length ? `\n🔖 Reservations: ${reserved.length}` : "") +
        "\n\nAsk me about your books, fines, renewals, or recommendations!";
    } else if (/overdue|fine|penalt|late/.test(msg)) {
      reply = overdue.length ? `⚠️ ${overdue.length} overdue:\n${fmt(overdue)}\n\nTotal fines: ₹${totalFines}` : "✅ No overdue books!";
    } else if (/my book|loan|issued|borrowed/.test(msg)) {
      reply = active.length ? `Your ${active.length} loan(s):\n${fmt(active)}` : "No active loans. Browse the catalog to reserve!";
    } else if (/renew|extend/.test(msg)) {
      reply = active.length ? `Renew: My Books → click Renew (max 2 times, +14 days each).\n\nYour loans:\n${fmt(active)}` : "No active loans to renew.";
    } else if (/reserv/.test(msg)) {
      reply = reserved.length ? `${reserved.length} reservation(s):\n${reserved.map(t => `• "${t.book.title}"`).join("\n")}` : "No reservations. Go to Book Catalog → Reserve.";
    } else if (/return/.test(msg)) {
      reply = "Bring the book to the library desk. Admin processes returns and calculates any fine.";
    } else if (/recommend|suggest|what.*read/.test(msg)) {
      reply = "Go to AI Recommendations in the sidebar for personalized picks! 🤖📚";
    } else if (/polic|rule|how.*work/.test(msg)) {
      reply = "📋 Policies: 14-day borrow | ₹5/day fine | 2 renewals | Max 5 loans at a time";
    } else {
      reply = `Hi ${req.user.name}! Ask me:\n• "What books do I have?"\n• "Do I have fines?"\n• "How do I renew?"\n• "Recommend me a book"`;
    }

    res.json({ success: true, reply, mode: "fallback" });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.json({ success: true, reply: "I had a momentary issue. Please try again!", mode: "error" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   POST /api/ai/search
═══════════════════════════════════════════════════════════════════ */
router.post("/search", protect, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) return res.status(400).json({ success: false, message: "Query required" });

    let books = [];
    let intent = `Searching for: "${query}"`;

    const aiText = await callGroq(
      "You are a library search assistant. Extract the core search keywords from the user query. Return ONLY valid JSON, nothing else.",
      [{ role: "user", content: `Query: "${query}"\nReturn: {"keywords":"main search terms","intent":"one sentence"}` }],
      100
    );

    const kw = aiText ? (parseJSON(aiText, { keywords: query }).keywords || query) : query;
    intent = aiText ? (parseJSON(aiText, { intent }).intent || intent) : intent;

    books = await Book.find({
      $or: [
        { title: { $regex: kw, $options: "i" } },
        { author: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } },
        { category: { $regex: kw, $options: "i" } },
        { tags: { $in: [new RegExp(kw, "i")] } },
      ],
    }).limit(12);

    if (!books.length) {
      books = await Book.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      }).limit(12);
    }

    res.json({ success: true, intent, books, total: books.length });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   POST /api/ai/recommendations  —  FULLY FIXED
═══════════════════════════════════════════════════════════════════ */
router.post("/recommendations", protect, async (req, res) => {
  try {
    /* ── 1. Get user's borrowing history ── */
    const history = await Transaction.find({
      user: req.user._id,
      status: { $in: ["returned", "active", "overdue"] },
    }).populate("book", "title author category tags").sort({ createdAt: -1 }).limit(20);

    const validHistory = history.filter(t => t.book);
    const borrowedIds  = validHistory.map(t => t.book._id);

    /* ── 2. Build available book pool (exclude already borrowed) ── */
    const pool = await Book.find({
      availableCopies: { $gt: 0 },
      _id: { $nin: borrowedIds },
    }).sort({ rating: -1 }).limit(40).lean();

    if (!pool.length) {
      return res.json({ success: true, recommendations: [], message: "No available books to recommend right now." });
    }

    /* ── 3. If user HAS history → ask Groq for personalized picks ── */
    if (validHistory.length > 0) {
      const histText = validHistory
        .map(t => `"${t.book.title}" by ${t.book.author} [${t.book.category}]`)
        .join(", ");

      const poolLines = pool
        .map(b => `ID:${b._id} | "${b.title}" by ${b.author} | category:${b.category} | rating:${b.rating || 3}`)
        .join("\n");

      const prompt = `You are a book recommendation engine for a library app.

User's reading history: ${histText}

Available books to recommend from:
${poolLines}

Pick the top 5 books that best match the user's reading taste.
Return ONLY a JSON array like this (use exact IDs from above):
[
  {"bookId":"EXACT_ID_FROM_ABOVE","matchScore":92,"matchReason":"Why this suits their taste in 1 sentence","aiInsight":"One interesting fact about this book"}
]`;

      const aiText = await callGroq(
        "You are a book recommendation engine. Return ONLY valid JSON arrays. No markdown. No explanation outside the JSON.",
        [{ role: "user", content: prompt }],
        800
      );

      console.log("Groq recommendations raw response:", aiText?.slice(0, 300));

      if (aiText) {
        const recs = parseJSON(aiText, []);
        if (Array.isArray(recs) && recs.length > 0) {
          const enriched = recs
            .map(r => {
              const book = pool.find(b => b._id.toString() === String(r.bookId).trim());
              if (!book) {
                console.log("⚠️  bookId not found in pool:", r.bookId);
                return null;
              }
              return {
                ...book,
                matchScore: Number(r.matchScore) || 85,
                matchReason: r.matchReason || "Great match for your reading taste",
                aiInsight: r.aiInsight || "",
              };
            })
            .filter(Boolean);

          if (enriched.length > 0) {
            console.log(`✅ Groq returned ${enriched.length} personalized recommendations for ${req.user.name}`);
            return res.json({ success: true, recommendations: enriched, mode: "ai" });
          }
          console.log("⚠️  Parsed recs but none matched pool IDs — falling back");
        } else {
          console.log("⚠️  Could not parse Groq response as array — falling back");
        }
      }
    }

    /* ── 4. Fallback: smart category-based recommendations ── */
    const readCats = [...new Set(validHistory.map(t => t.book.category))];
    console.log("Using fallback recommendations. Read categories:", readCats);

    // Sort pool: matching categories first, then by rating
    const sorted = [
      ...pool.filter(b => readCats.includes(b.category)).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
      ...pool.filter(b => !readCats.includes(b.category)).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    ].slice(0, 5);

    const recommendations = sorted.map((b, i) => ({
      ...b,
      matchScore: Math.max(70, 95 - i * 5),
      matchReason: readCats.includes(b.category)
        ? `Based on your interest in ${b.category} books`
        : validHistory.length === 0
          ? "Highly rated book — borrow more to get personalized picks!"
          : `Top-rated ${b.category} book you haven't read yet`,
      aiInsight: validHistory.length === 0
        ? "Start borrowing books to unlock fully personalized AI recommendations!"
        : `⭐ Rated ${b.rating || "N/A"} by ${(b.ratingCount || 0).toLocaleString()} readers`,
    }));

    return res.json({ success: true, recommendations, mode: "fallback" });

  } catch (err) {
    console.error("Recommendations error:", err.message);
    res.status(500).json({ success: false, message: "Recommendations failed. Please try again." });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   GET /api/ai/test
═══════════════════════════════════════════════════════════════════ */
router.get("/test", protect, async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "YOUR_GROQ_API_KEY_HERE") {
    return res.json({ success: false, message: "Add GROQ_API_KEY to server/.env" });
  }
  const reply = await callGroq(
    "You are a test assistant.",
    [{ role: "user", content: "Say exactly: Groq AI is working!" }],
    20
  );
  res.json(reply
    ? { success: true, status: "connected", reply, model: "llama-3.3-70b-versatile" }
    : { success: false, status: "failed", message: "Check server console for error details." }
  );
});

module.exports = router;
