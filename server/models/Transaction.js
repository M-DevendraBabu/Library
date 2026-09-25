const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    type: {
      type: String,
      enum: ["issue", "return", "renew", "reserve", "cancel_reserve"],
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: function () {
        return this.type === "issue" || this.type === "renew";
      },
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "returned", "overdue", "reserved", "cancelled"],
      default: "active",
    },
    renewalsLeft: {
      type: Number,
      default: 2,
    },
    fine: {
      type: Number,
      default: 0,
    },
    finePaid: {
      type: Boolean,
      default: false,
    },
    daysOverdue: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number, // reading progress 0-100%
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Calculate fine before saving
transactionSchema.pre("save", function (next) {
  if (this.dueDate && this.status === "active") {
    const now = new Date();
    if (now > this.dueDate) {
      this.status = "overdue";
      const diffMs = now - this.dueDate;
      this.daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      this.fine = this.daysOverdue * 5; // ₹5 per day
    }
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
