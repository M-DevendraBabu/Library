const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { protect, adminOnly } = require("../middleware/auth");

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Admin: get all users
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const { search, status, membership, page = 1, limit = 20 } = req.query;
    const query = { role: "user" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "active") query.isActive = true;
    if (status === "inactive") query.isActive = false;
    if (membership) query.membershipType = membership;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// ─── GET /api/users/stats ─────────────────────────────────────────────────────
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [total, active, premium, inactive] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", isActive: true }),
      User.countDocuments({ role: "user", membershipType: "Premium" }),
      User.countDocuments({ role: "user", isActive: false }),
    ]);

    res.json({ success: true, stats: { total, active, premium, inactive } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Admin: update user
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const allowedFields = ["name", "email", "phone", "membershipType", "isActive", "membershipExpiry"];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User updated", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

// ─── GET /api/users/:id/transactions ─────────────────────────────────────────
router.get("/:id/transactions", protect, adminOnly, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.id })
      .populate("book", "title author")
      .sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
});

module.exports = router;
