const express      = require("express");
const router       = express.Router();
const Transaction  = require("../models/Transaction");
const Book         = require("../models/Book");
const User         = require("../models/User");
const Notification = require("../models/Notification");
const mongoose     = require("mongoose");
const { protect, adminOnly } = require("../middleware/auth");

/* ── helper: create notification ─────────────────────────────────── */
async function notif(userId, data) {
  try { await Notification.create({ user: userId, ...data }); }
  catch(e) { console.error("Notif:", e.message); }
}

/* ── helper: find admin ───────────────────────────────────────────── */
async function getAdmin() {
  return User.findOne({ role: "admin" }).lean();
}

/* ═══════════════════════════════════════════════════════════════════
   GET /api/transactions/my  — user's own transactions
═══════════════════════════════════════════════════════════════════ */
router.get("/my", protect, async (req, res) => {
  try {
    const { status, type } = req.query;
    const q = { user: req.user._id };
    if (status) q.status = status;
    if (type)   q.type   = type;

    const rawTx = await Transaction.find(q)
      .populate("book", "title author category format coverColor rating tags location isbn")
      .sort({ createdAt: -1 });

    // Filter out transactions whose book has been deleted (stale references)
    const transactions = rawTx.filter(t => t.book && t.book.title);

    res.json({ success: true, transactions });
  } catch(err) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   GET /api/transactions  — admin: all transactions
   Supports ?status=active,overdue (comma-separated)
═══════════════════════════════════════════════════════════════════ */
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 100 } = req.query;
    const q = {};

    if (status) {
      const arr = status.split(",").map(s => s.trim()).filter(Boolean);
      if (arr.length === 1)  q.status = arr[0];
      else                   q.status = { $in: arr };
    }
    if (type) q.type = type;

    const total = await Transaction.countDocuments(q);
    const rawTxAdmin = await Transaction.find(q)
      .populate("book", "title author isbn category location coverColor")
      .populate("user", "name email studentId phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Filter stale book references (deleted books)
    const transactions = rawTxAdmin.filter(t => t.book && t.book.title);

    res.json({ success: true, total, transactions });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   GET /api/transactions/stats
═══════════════════════════════════════════════════════════════════ */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [totalIssued, totalReturned, totalOverdue, totalReserved] = await Promise.all([
      Transaction.countDocuments({ type: "issue" }),
      Transaction.countDocuments({ status: "returned" }),
      Transaction.countDocuments({ status: "overdue" }),
      Transaction.countDocuments({ status: "reserved" }),
    ]);
    // Sum fines from active overdue books (pending collection)
    const fineAgg = await Transaction.aggregate([
      { $match: { status: { $in: ["overdue", "active"] }, fine: { $gt: 0 } } },
      { $group: { _id: null, totalFines: { $sum: "$fine" } } },
    ]);
    res.json({
      success: true,
      stats: { totalIssued, totalReturned, totalOverdue, totalReserved, totalFines: fineAgg[0]?.totalFines || 0 },
    });
  } catch(err) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   POST /api/transactions/issue  (admin only)
═══════════════════════════════════════════════════════════════════ */
router.post("/issue", protect, adminOnly, async (req, res) => {
  try {
    const { bookId, userId } = req.body;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res.status(400).json({ success: false, message: "Invalid book ID" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ success: false, message: "Invalid user ID" });

    const [book, user] = await Promise.all([
      Book.findById(bookId),
      User.findById(userId),
    ]);

    if (!book) return res.status(404).json({ success: false, message: `Book not found (ID: ${bookId})` });
    if (!user) return res.status(404).json({ success: false, message: `User not found (ID: ${userId})` });
    if (book.availableCopies < 1)
      return res.status(400).json({ success: false, message: `"${book.title}" has no available copies` });

    // Check user doesn't already have this book active
    const alreadyIssued = await Transaction.findOne({
      user: userId, book: bookId, status: { $in: ["active", "overdue"] },
    });
    if (alreadyIssued)
      return res.status(400).json({ success: false, message: `"${book.title}" is already issued to this user` });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Cancel any existing reservation for this user+book
    await Transaction.updateMany(
      { user: userId, book: bookId, status: "reserved" },
      { status: "cancelled" }
    );

    const transaction = await Transaction.create({
      user: userId, book: bookId,
      type: "issue", dueDate, status: "active",
    });

    // Decrement available copies
    await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });
    await User.findByIdAndUpdate(userId, { $inc: { booksBorrowed: 1 } });

    // Notify user
    await notif(userId, {
      title: `📗 Book Issued: ${book.title}`,
      message: `"${book.title}" by ${book.author} has been issued to you.\nDue date: ${dueDate.toLocaleDateString("en-IN")}.\nLocation: ${book.location || "the library"}.`,
      type: "system", category: "borrowing", priority: "medium",
      bookCover: "📗", color: "#10B981",
      dueDate, relatedBook: bookId, relatedTransaction: transaction._id,
    });

    const populated = await Transaction.findById(transaction._id)
      .populate("book", "title author location isbn coverColor")
      .populate("user", "name email");

    res.status(201).json({ success: true, message: `"${book.title}" issued successfully to ${user.name}`, transaction: populated });
  } catch(err) {
    console.error("Issue error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to issue book" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   POST /api/transactions/return  (admin only)
═══════════════════════════════════════════════════════════════════ */
router.post("/return", protect, adminOnly, async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(transactionId))
      return res.status(400).json({ success: false, message: "Invalid transaction ID" });

    const tx = await Transaction.findById(transactionId)
      .populate("book")
      .populate("user", "name email");

    if (!tx)
      return res.status(404).json({ success: false, message: "Transaction not found" });
    if (tx.status === "returned")
      return res.status(400).json({ success: false, message: "This book has already been returned" });
    if (!["active","overdue"].includes(tx.status))
      return res.status(400).json({ success: false, message: "This transaction cannot be returned" });

    const now = new Date();
    tx.returnDate = now;
    tx.status     = "returned";

    // Calculate fine
    if (now > tx.dueDate) {
      const msOverdue  = now - new Date(tx.dueDate);
      const daysOverdue = Math.floor(msOverdue / (1000 * 60 * 60 * 24));
      tx.daysOverdue = daysOverdue;
      tx.fine        = daysOverdue * 5; // ₹5/day
    } else {
      tx.daysOverdue = 0;
      tx.fine        = 0;
    }

    await tx.save();

    // INCREMENT available copies
    const book = tx.book;
    if (book) {
      await Book.findByIdAndUpdate(book._id, { $inc: { availableCopies: 1 } });
    }

    // Notify user
    if (tx.fine > 0) {
      await notif(tx.user._id || tx.user, {
        title: "📚 Book Returned — Fine Applied",
        message: `"${book?.title}" returned ${tx.daysOverdue} day(s) late.\nFine: ₹${tx.fine}. Please clear this fine with the admin.`,
        type: "fine", category: "account", priority: "high",
        bookCover: "💰", color: "#EF4444", amount: `₹${tx.fine}`, actionRequired: true,
      });
    } else {
      await notif(tx.user._id || tx.user, {
        title: "✅ Book Returned Successfully",
        message: `"${book?.title}" has been returned on time. No fines applied. Thank you!`,
        type: "return", category: "borrowing", priority: "low",
        bookCover: "✅", color: "#10B981",
      });
    }

    const result = await Transaction.findById(tx._id)
      .populate("book", "title author location isbn coverColor")
      .populate("user", "name email");

    res.json({ success: true, message: tx.fine > 0 ? `Book returned. Fine: ₹${tx.fine}` : "Book returned successfully", transaction: result });
  } catch(err) {
    console.error("Return error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to return book" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   POST /api/transactions/renew  (user's own books)
═══════════════════════════════════════════════════════════════════ */
router.post("/renew", protect, async (req, res) => {
  try {
    const { transactionId } = req.body;

    const tx = await Transaction.findOne({ _id: transactionId, user: req.user._id })
      .populate("book", "title author location")
      .populate("user", "name email");

    if (!tx) return res.status(404).json({ success: false, message: "Transaction not found" });
    if (tx.renewalsLeft <= 0) return res.status(400).json({ success: false, message: "No renewals remaining for this book" });
    if (!["active","overdue"].includes(tx.status)) return res.status(400).json({ success: false, message: "Only active/overdue books can be renewed" });

    const newDue = new Date(tx.dueDate);
    newDue.setDate(newDue.getDate() + 14);

    tx.dueDate      = newDue;
    tx.renewalsLeft -= 1;
    tx.status       = "active";
    tx.daysOverdue  = 0;
    tx.fine         = 0;
    await tx.save();

    // Notify user
    await notif(req.user._id, {
      title: "🔄 Book Renewed Successfully",
      message: `"${tx.book?.title}" has been renewed. New due date: ${newDue.toLocaleDateString("en-IN")}. Renewals remaining: ${tx.renewalsLeft}.`,
      type: "system", category: "borrowing", priority: "low",
      bookCover: "🔄", color: "#6366F1",
    });

    // Notify admin
    const admin = await getAdmin();
    if (admin) {
      await notif(admin._id, {
        title: "🔄 Book Renewed by Member",
        message: `${req.user.name} (${req.user.email}) renewed "${tx.book?.title}". New due: ${newDue.toLocaleDateString("en-IN")}. Renewals left: ${tx.renewalsLeft}.`,
        type: "system", category: "borrowing", priority: "low",
        bookCover: "🔄", color: "#6366F1",
      });
    }

    res.json({ success: true, message: "Book renewed successfully", transaction: tx });
  } catch(err) {
    res.status(500).json({ success: false, message: "Failed to renew book" });
  }
});

/* ═══════════════════════════════════════════════════════════════════
   POST /api/transactions/reserve  (user)
   → Notifies admin to issue the book
═══════════════════════════════════════════════════════════════════ */
router.post("/reserve", protect, async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId))
      return res.status(400).json({ success: false, message: "Invalid book ID" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    // Don't allow double reservation
    const existing = await Transaction.findOne({
      user: req.user._id, book: bookId, status: "reserved",
    });
    if (existing) return res.status(400).json({ success: false, message: "You already have a reservation for this book" });

    // Don't allow if user already has it active
    const alreadyHas = await Transaction.findOne({
      user: req.user._id, book: bookId, status: { $in: ["active","overdue"] },
    });
    if (alreadyHas) return res.status(400).json({ success: false, message: "You already have this book issued" });

    const tx = await Transaction.create({
      user: req.user._id, book: bookId,
      type: "reserve", status: "reserved",
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { booksReserved: 1 } });

    // Notify user
    await notif(req.user._id, {
      title: `🔖 Reservation Confirmed: ${book.title}`,
      message: `Your reservation for "${book.title}" is confirmed. The librarian will issue it to you shortly.\nLocation: ${book.location || "see catalog"}.`,
      type: "reservation", category: "reservation", priority: "medium",
      bookCover: "🔖", color: "#8B5CF6",
      relatedBook: bookId, relatedTransaction: tx._id,
    });

    // Notify admin
    const admin = await getAdmin();
    if (admin) {
      await notif(admin._id, {
        title: "📋 New Reservation — Action Required",
        message: `${req.user.name} (${req.user.email}) reserved "${book.title}".\nPlease issue this book from Issue & Return → Reservations tab.`,
        type: "reservation", category: "reservation", priority: "high",
        bookCover: "📋", color: "#F59E0B",
        actionRequired: true, relatedBook: bookId, relatedTransaction: tx._id,
      });
    }

    const populated = await Transaction.findById(tx._id)
      .populate("book", "title author location coverColor");

    res.status(201).json({ success: true, message: "Book reserved successfully", transaction: populated });
  } catch(err) {
    console.error("Reserve error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to reserve book" });
  }
});

module.exports = router;
