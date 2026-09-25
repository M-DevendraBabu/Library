const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["due_date", "reservation", "new_arrival", "fine", "system", "return"],
      default: "system",
    },
    category: {
      type: String,
      enum: ["borrowing", "reservation", "collection", "account", "general"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    read: {
      type: Boolean,
      default: false,
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
    relatedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    relatedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    bookCover: {
      type: String,
      default: "📚",
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    amount: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
