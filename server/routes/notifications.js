const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/auth");

// ─── GET /api/notifications ───────────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const { filter, category, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (filter === "unread") query.read = false;
    if (filter === "read") query.read = true;
    if (category && category !== "all") query.category = category;

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, unreadCount, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

// ─── PUT /api/notifications/:id/read ─────────────────────────────────────────
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
});

// ─── PUT /api/notifications/read-all ─────────────────────────────────────────
router.put("/read-all/mark", protect, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark all as read" });
  }
});

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
});

// ─── POST /api/notifications/broadcast ───────────────────────────────────────
// Admin: send notification to all users
router.post("/broadcast", protect, adminOnly, async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find({ role: "user", isActive: true }).select("_id");

    const notifications = users.map((u) => ({
      user: u._id,
      ...req.body,
    }));

    await Notification.insertMany(notifications);
    res.json({ success: true, message: `Notification sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Broadcast failed" });
  }
});

module.exports = router;
