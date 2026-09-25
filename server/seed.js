/**
 * seed.js — Run once to populate your MongoDB with sample data
 * Usage: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Book = require("./models/Book");

const sampleBooks = [
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", isbn: "978-0201616224", category: "tech", format: "physical", language: "english", description: "Classic software engineering book covering best practices and career advice for developers.", pages: 352, publishedYear: 2019, totalCopies: 5, availableCopies: 5, rating: 4.8, ratingCount: 12500, views: 38200, coverColor: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", tags: ["programming", "career", "best-practices"], isNew: false, isFeatured: true, location: "Shelf A-01" },
  { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "tech", format: "physical", language: "english", description: "A handbook of agile software craftsmanship that teaches programmers how to write clean, readable code.", pages: 431, publishedYear: 2008, totalCopies: 4, availableCopies: 4, rating: 4.7, ratingCount: 9800, views: 29100, coverColor: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", tags: ["clean-code", "refactoring", "best-practices"], isNew: false, isFeatured: true, location: "Shelf A-02" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "978-0743273565", category: "fiction", format: "physical", language: "english", description: "A portrait of the Jazz Age in all of its decadence and excess.", pages: 180, publishedYear: 1925, totalCopies: 8, availableCopies: 6, rating: 4.5, ratingCount: 32000, views: 95000, coverColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", tags: ["classic", "american-literature", "jazz-age"], isNew: false, isFeatured: false, location: "Shelf B-01" },
  { title: "1984", author: "George Orwell", isbn: "978-0451524935", category: "dystopian", format: "physical", language: "english", description: "A dystopian social science fiction novel about totalitarianism and mass surveillance.", pages: 328, publishedYear: 1949, totalCopies: 6, availableCopies: 2, rating: 4.8, ratingCount: 48000, views: 150000, coverColor: "linear-gradient(135deg, #374151 0%, #111827 100%)", tags: ["dystopian", "political", "classic"], isNew: false, isFeatured: true, location: "Shelf B-02" },
  { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0446310789", category: "fiction", format: "physical", language: "english", description: "A gripping, heart-wrenching tale of racial injustice in the American South.", pages: 281, publishedYear: 1960, totalCopies: 7, availableCopies: 5, rating: 4.9, ratingCount: 55000, views: 120000, coverColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)", tags: ["classic", "justice", "american-literature"], isNew: false, isFeatured: false, location: "Shelf B-03" },
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", category: "history", format: "physical", language: "english", description: "A brief history of humankind exploring how Homo sapiens became the dominant species on Earth.", pages: 512, publishedYear: 2014, totalCopies: 5, availableCopies: 5, rating: 4.9, ratingCount: 24580, views: 67000, coverColor: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", tags: ["history", "anthropology", "bestseller"], isNew: false, isFeatured: true, location: "Shelf C-01" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "978-0374533557", category: "science", format: "physical", language: "english", description: "Presents two systems of thought — fast intuition and slow deliberation — and how they shape our decisions.", pages: 499, publishedYear: 2011, totalCopies: 4, availableCopies: 4, rating: 4.7, ratingCount: 18765, views: 42000, coverColor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", tags: ["psychology", "cognitive-science", "decision-making"], isNew: false, isFeatured: true, location: "Shelf C-02" },
  { title: "Design Patterns", author: "Erich Gamma et al.", isbn: "978-0201633610", category: "tech", format: "physical", language: "english", description: "Elements of Reusable Object-Oriented Software — the classic Gang of Four patterns book.", pages: 395, publishedYear: 1994, totalCopies: 3, availableCopies: 3, rating: 4.6, ratingCount: 8900, views: 25000, coverColor: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", tags: ["patterns", "oop", "architecture"], isNew: false, isFeatured: false, location: "Shelf A-03" },
  { title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", category: "business", format: "physical", language: "english", description: "An easy and proven way to build good habits and break bad ones using tiny, incremental improvements.", pages: 320, publishedYear: 2018, totalCopies: 6, availableCopies: 6, rating: 4.8, ratingCount: 38000, views: 88000, coverColor: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", tags: ["habits", "productivity", "self-help", "bestseller"], isNew: false, isFeatured: true, location: "Shelf D-01" },
  { title: "Clean Architecture", author: "Robert C. Martin", isbn: "978-0134494166", category: "tech", format: "physical", language: "english", description: "A craftsman's guide to software structure and design principles.", pages: 429, publishedYear: 2017, totalCopies: 4, availableCopies: 4, rating: 4.7, ratingCount: 6700, views: 18000, coverColor: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", tags: ["architecture", "clean-code", "design"], isNew: false, isFeatured: false, location: "Shelf A-04" },
  { title: "Pride and Prejudice", author: "Jane Austen", isbn: "978-0141439518", category: "fiction", format: "physical", language: "english", description: "A romantic novel of manners that explores themes of marriage, morality, and misconception.", pages: 432, publishedYear: 1813, totalCopies: 5, availableCopies: 5, rating: 4.6, ratingCount: 29000, views: 73000, coverColor: "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)", tags: ["classic", "romance", "british-literature"], isNew: false, isFeatured: false, location: "Shelf B-04" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", isbn: "978-0547928227", category: "fiction", format: "physical", language: "english", description: "The precursor to The Lord of the Rings — a fantasy adventure about Bilbo Baggins.", pages: 310, publishedYear: 1937, totalCopies: 7, availableCopies: 7, rating: 4.9, ratingCount: 62000, views: 145000, coverColor: "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)", tags: ["fantasy", "adventure", "classic", "tolkien"], isNew: false, isFeatured: true, location: "Shelf B-05" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({ email: "admin@library.com" });
    console.log("🗑  Cleared existing library books and default admin");

    // Insert books
    await Book.insertMany(sampleBooks);
    console.log(`📚 Inserted ${sampleBooks.length} books`);

    // Create default admin
    const admin = await User.create({
      name: "Library Admin",
      email: "admin@library.com",
      password: "admin123",
      role: "admin",
    });
    console.log(`👤 Created admin: ${admin.email} / password: admin123`);

    console.log("\n✅ Seed complete! You can now run the server.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
