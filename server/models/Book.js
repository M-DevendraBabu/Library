const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "fiction", "tech", "science", "history", "business",
        "art", "biography", "dystopian", "programming",
        "software", "web", "ai", "other"
      ],
      lowercase: true,
    },
    format: {
      type: String,
      enum: ["pdf", "epub", "physical", "audiobook"],
      default: "physical",
    },
    language: {
      type: String,
      default: "english",
    },
    description: {
      type: String,
      trim: true,
    },
    coverColor: {
      type: String,
      default: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    pages: {
      type: Number,
    },
    publishedYear: {
      type: Number,
    },
    totalCopies: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    availableCopies: {
      type: Number,
      default: function () {
        return this.totalCopies;
      },
      min: 0,
    },
    location: {
      type: String, // e.g. "Shelf A-12"
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
    isNew: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Available", "Borrowed", "Reserved", "Unavailable"],
      default: "Available",
    },
    addedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Auto-update status based on available copies
bookSchema.pre("save", function (next) {
  if (this.availableCopies === 0) {
    this.status = "Borrowed";
  } else {
    this.status = "Available";
  }
  next();
});

// Text index for search
bookSchema.index({ title: "text", author: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Book", bookSchema);
