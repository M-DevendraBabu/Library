const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const { protect, adminOnly } = require("../middleware/auth");

// ─── GET /api/books ───────────────────────────────────────────────────────────
// Public: get all books with filters
router.get("/", async (req, res) => {
  try {
    const {
      search, category, format, language, status,
      sort = "title", page = 1, limit = 20,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (category && category !== "all") query.category = category;
    if (format && format !== "all") query.format = format;
    if (language && language !== "all") query.language = language;
    if (status) query.status = status;

    const sortMap = {
      popular: { views: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
      title: { title: 1 },
    };

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortMap[sort] || { title: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      books,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch books" });
  }
});

// ─── GET /api/books/featured ──────────────────────────────────────────────────
router.get("/featured", async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true }).limit(6);
    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch featured books" });
  }
});

// ─── GET /api/books/:id ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });

    // Increment views
    book.views += 1;
    await book.save();

    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch book" });
  }
});

// ─── POST /api/books ──────────────────────────────────────────────────────────
// Admin only: add new book
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, message: "Book added successfully", book });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "ISBN already exists" });
    }
    res.status(500).json({ success: false, message: err.message || "Failed to add book" });
  }
});

// ─── PUT /api/books/:id ───────────────────────────────────────────────────────
// Admin only: update book
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.json({ success: true, message: "Book updated", book });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update book" });
  }
});

// ─── DELETE /api/books/:id ────────────────────────────────────────────────────
// Admin only: delete book
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete book" });
  }
});

module.exports = router;
