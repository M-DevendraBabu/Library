import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom"; // Added useNavigate
import { booksAPI, transactionsAPI } from "../services/api";
import {
  Search,
  Filter,
  BookOpen,
  Star,
  Heart,
  Download,
  Clock,
  Users,
  Bookmark,
  Eye,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Calendar,
  X,
  Hash,
  Library,
  BookText,
  ArrowDown,
} from "lucide-react";

const BookCatalog = () => {
  const navigate = useNavigate(); // Added for navigation
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [favorites, setFavorites] = useState([1, 3]);
  const [sortBy, setSortBy] = useState("popular");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "All Genres", color: "#6366f1", icon: "📚" },
    { id: "fiction", name: "Fiction", color: "#8b5cf6", icon: "📖" },
    { id: "tech", name: "Technology", color: "#0ea5e9", icon: "💻" },
    { id: "science", name: "Science", color: "#10b981", icon: "🔬" },
    { id: "history", name: "History", color: "#f59e0b", icon: "🏛️" },
    { id: "business", name: "Business", color: "#ef4444", icon: "💼" },
    { id: "art", name: "Art & Design", color: "#ec4899", icon: "🎨" },
    { id: "biography", name: "Biography", color: "#14b8a6", icon: "👤" },
  ];

  const formats = [
    { id: "all", name: "All Formats", color: "#64748b" },
    { id: "pdf", name: "PDF", color: "#ef4444" },
    { id: "epub", name: "EPUB", color: "#0ea5e9" },
    { id: "physical", name: "Physical", color: "#10b981" },
    { id: "audiobook", name: "Audiobook", color: "#f59e0b" },
  ];

  const languages = [
    { id: "all", name: "All Languages", color: "#64748b" },
    { id: "english", name: "English", color: "#3b82f6" },
    { id: "spanish", name: "Spanish", color: "#10b981" },
    { id: "french", name: "French", color: "#8b5cf6" },
    { id: "german", name: "German", color: "#f59e0b" },
  ];

  // Mock data fetch
  useEffect(() => {
    const mockBooks = [
      {
        id: 1,
        title: "The Pragmatic Programmer",
        author: "David Thomas & Andrew Hunt",
        category: "tech",
        format: "pdf",
        language: "english",
        rating: 4.8,
        pages: 352,
        downloads: 12500,
        views: 38200,
        isNew: true,
        isFeatured: true,
        description:
          "Classic software engineering book covering best practices and career advice for developers.",
        coverColor: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        fileSize: "4.2 MB",
        tags: ["programming", "career", "best-practices"],
      },
      {
        id: 2,
        title: "Clean Architecture",
        author: "Robert C. Martin",
        category: "tech",
        format: "pdf",
        language: "english",
        rating: 4.7,
        pages: 432,
        downloads: 8900,
        views: 25400,
        isNew: false,
        isFeatured: true,
        description:
          "Learn how to create software architectures that stand the test of time.",
        coverColor: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
        fileSize: "5.1 MB",
        tags: ["architecture", "clean-code", "design"],
      },
      {
        id: 3,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        category: "history",
        format: "epub",
        language: "english",
        rating: 4.9,
        pages: 512,
        downloads: 21500,
        views: 65400,
        isNew: false,
        isFeatured: true,
        description:
          "Explores the history of human evolution from the Stone Age to the modern era.",
        coverColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        fileSize: "6.8 MB",
        tags: ["history", "anthropology", "evolution"],
      },
      {
        id: 4,
        title: "Atomic Habits",
        author: "James Clear",
        category: "business",
        format: "physical",
        language: "english",
        rating: 4.8,
        pages: 320,
        downloads: 0,
        views: 18000,
        isNew: true,
        isFeatured: false,
        description:
          "An easy & proven way to build good habits & break bad ones.",
        coverColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        fileSize: "Physical",
        tags: ["self-help", "productivity", "psychology"],
      },
      {
        id: 5,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        category: "art",
        format: "pdf",
        language: "english",
        rating: 4.6,
        pages: 368,
        downloads: 7200,
        views: 19800,
        isNew: false,
        isFeatured: false,
        description:
          "Explains how design serves as the communication between object and user.",
        coverColor: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
        fileSize: "3.9 MB",
        tags: ["design", "usability", "user-experience"],
      },
      {
        id: 6,
        title: "Educated: A Memoir",
        author: "Tara Westover",
        category: "biography",
        format: "audiobook",
        language: "english",
        rating: 4.7,
        pages: 352,
        downloads: 3400,
        views: 12500,
        isNew: true,
        isFeatured: false,
        description:
          "A memoir about a woman who leaves her survivalist family and goes on to earn a PhD.",
        coverColor: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
        fileSize: "128 MB",
        tags: ["memoir", "education", "family"],
      },
      {
        id: 7,
        title: "Dune",
        author: "Frank Herbert",
        category: "fiction",
        format: "epub",
        language: "english",
        rating: 4.5,
        pages: 896,
        downloads: 18200,
        views: 43200,
        isNew: false,
        isFeatured: true,
        description:
          "Epic science fiction novel set in the distant future amidst a feudal interstellar society.",
        coverColor: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        fileSize: "7.2 MB",
        tags: ["sci-fi", "classic", "adventure"],
      },
      {
        id: 8,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        category: "science",
        format: "pdf",
        language: "english",
        rating: 4.4,
        pages: 499,
        downloads: 9600,
        views: 28700,
        isNew: false,
        isFeatured: false,
        description:
          "Presents the author's research on cognitive biases and prospect theory.",
        coverColor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        fileSize: "5.5 MB",
        tags: ["psychology", "decision-making", "cognitive-science"],
      },
    ];

    booksAPI
      .getAll({ limit: 100 })
      .then((res) => {
        if (res.data?.books && res.data.books.length > 0) {
          const mapped = res.data.books.map((b, idx) => ({
            id: b._id || idx + 1,
            _id: b._id,
            title: b.title,
            author: b.author,
            category: (b.category || "tech").toLowerCase(),
            format: b.format || "pdf",
            language: b.language || "english",
            rating: b.rating || 4.7,
            pages: b.pages || 350,
            downloads: b.downloads || 1200 + idx * 310,
            views: b.views || 3800 + idx * 750,
            isNew: b.isNew || false,
            isFeatured: b.isFeatured !== undefined ? b.isFeatured : true,
            description:
              b.description || "Comprehensive software and engineering resource.",
            coverColor:
              b.coverColor ||
              "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            fileSize: b.fileSize || "4.5 MB",
            tags:
              b.tags && b.tags.length > 0
                ? b.tags
                : [b.category || "tech", "reference"],
            availableCopies:
              b.availableCopies !== undefined ? b.availableCopies : 1,
            totalCopies: b.totalCopies !== undefined ? b.totalCopies : 1,
            isbn: b.isbn || `ISBN-${1000 + idx}`,
          }));
          setBooks(mapped);
          setLoading(false);
        } else {
          setBooks(mockBooks);
          setLoading(false);
        }
      })
      .catch(() => {
        setBooks(mockBooks);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some((tag) => tag.includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;

    const matchesFormat =
      selectedFormat === "all" || book.format === selectedFormat;

    const matchesLanguage =
      selectedLanguage === "all" || book.language === selectedLanguage;

    return matchesSearch && matchesCategory && matchesFormat && matchesLanguage;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "downloads":
        return b.downloads - a.downloads;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.isNew ? 1 : -1;
      default:
        return 0;
    }
  });

  const handleFavorite = (bookId) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  const handleDownload = (book) => {
    if (book.format === "physical") {
      alert(
        `📦 "${book.title}" is a physical book. Visit the library to borrow it.`,
      );
    } else {
      alert(`⬇️ Starting download of "${book.title}" (${book.fileSize})`);
      // Simulate download
    }
  };

  const handleRead = (book) => {
    // Navigate to book details page with book data
    navigate("/book-details", { state: { book } });
  };

  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            style={{
              color: index < Math.floor(rating) ? "#f59e0b" : "#e2e8f0",
              fill: index < Math.floor(rating) ? "#f59e0b" : "transparent",
            }}
          />
        ))}
        <span
          style={{ marginLeft: "4px", fontSize: "0.875rem", color: "#64748b" }}
        >
          {rating}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: "60px",
              height: "60px",
              opacity: 0.1,
              background: `linear-gradient(45deg, #${Math.floor(Math.random() * 16777215).toString(16)} 0%, #${Math.floor(Math.random() * 16777215).toString(16)} 100%)`,
              borderRadius: "12px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          padding: "3rem 2rem 4rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating books animation */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            right: "5%",
            top: "20%",
            fontSize: "3rem",
            opacity: 0.2,
          }}
        >
          📚
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          style={{
            position: "absolute",
            left: "10%",
            bottom: "30%",
            fontSize: "2.5rem",
            opacity: 0.2,
          }}
        >
          📖
        </motion.div>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Library size={28} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  marginBottom: "0.25rem",
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Book Catalog
              </h1>
              <p style={{ opacity: 0.9, fontSize: "1.1rem", color: "#cbd5e1" }}>
                Discover, read, and download thousands of books
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem 1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Total Books
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    {books.length}+
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem 1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Download size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Total Downloads
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    {books
                      .reduce((acc, book) => acc + book.downloads, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem 1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Users size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    Active Readers
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    2,843
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "-2rem auto 0",
          padding: "0 2rem 3rem",
          position: "relative",
          zIndex: 3,
        }}
      >
        {/* Search and Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                }}
              />
              <input
                type="text"
                placeholder="Search books, authors, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 1rem 1rem 3rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  background: "#f8fafc",
                  transition: "all 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              style={{
                padding: "1rem 1.5rem",
                border: "2px solid #e2e8f0",
                background: "white",
                borderRadius: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "600",
                color:
                  selectedCategory !== "all" ||
                  selectedFormat !== "all" ||
                  selectedLanguage !== "all"
                    ? "#4f46e5"
                    : "#64748b",
                transition: "all 0.2s",
                borderColor:
                  selectedCategory !== "all" ||
                  selectedFormat !== "all" ||
                  selectedLanguage !== "all"
                    ? "#4f46e5"
                    : "#e2e8f0",
              }}
            >
              <Filter size={18} />
              {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Category Filters */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    borderRadius: "12px",
                    border: "none",
                    background:
                      selectedCategory === category.id
                        ? `linear-gradient(135deg, ${category.color} 0%, ${category.color}99 100%)`
                        : "#f1f5f9",
                    color:
                      selectedCategory === category.id ? "white" : "#64748b",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "1.5rem",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}
                  >
                    {/* Format Filter */}
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Format
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {formats.map((format) => (
                          <button
                            key={format.id}
                            onClick={() => setSelectedFormat(format.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "20px",
                              border:
                                selectedFormat === format.id
                                  ? `2px solid ${format.color}`
                                  : "2px solid #e2e8f0",
                              background:
                                selectedFormat === format.id
                                  ? `${format.color}15`
                                  : "white",
                              color:
                                selectedFormat === format.id
                                  ? format.color
                                  : "#64748b",
                              fontWeight: "500",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {format.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language Filter */}
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Language
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => setSelectedLanguage(lang.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "20px",
                              border:
                                selectedLanguage === lang.id
                                  ? `2px solid ${lang.color}`
                                  : "2px solid #e2e8f0",
                              background:
                                selectedLanguage === lang.id
                                  ? `${lang.color}15`
                                  : "white",
                              color:
                                selectedLanguage === lang.id
                                  ? lang.color
                                  : "#64748b",
                              fontWeight: "500",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {lang.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Sort By
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {[
                          { id: "popular", name: "Most Popular", icon: "🔥" },
                          {
                            id: "downloads",
                            name: "Most Downloads",
                            icon: "⬇️",
                          },
                          { id: "rating", name: "Highest Rated", icon: "⭐" },
                          { id: "newest", name: "Newest", icon: "🆕" },
                        ].map((sort) => (
                          <button
                            key={sort.id}
                            onClick={() => setSortBy(sort.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "20px",
                              border:
                                sortBy === sort.id
                                  ? "2px solid #4f46e5"
                                  : "2px solid #e2e8f0",
                              background:
                                sortBy === sort.id ? "#4f46e5" : "white",
                              color: sortBy === sort.id ? "white" : "#64748b",
                              fontWeight: "500",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            {sort.icon} {sort.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.5rem",
            }}
          >
            <span style={{ color: "#64748b" }}>
              Found {sortedBooks.length} books
            </span>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedFormat("all");
                  setSelectedLanguage("all");
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <X size={16} /> Clear Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "60px",
                  height: "60px",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#4f46e5",
                  borderRadius: "50%",
                  margin: "0 auto 1rem",
                }}
              />
              <p style={{ color: "#64748b" }}>Loading books...</p>
            </div>
          ) : sortedBooks.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              }}
            >
              <Search
                size={80}
                style={{ marginBottom: "1rem", opacity: 0.5, color: "#94a3b8" }}
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                  fontSize: "1.5rem",
                }}
              >
                No books found
              </h3>
              <p
                style={{
                  color: "#64748b",
                  maxWidth: "400px",
                  margin: "0 auto 1.5rem",
                }}
              >
                Try adjusting your search criteria or browse all categories
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedFormat("all");
                  setSelectedLanguage("all");
                }}
                style={{
                  padding: "0.75rem 1.5rem",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Show All Books
              </button>
            </motion.div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {sortedBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ y: 30, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                  }}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                >
                  {/* Badges */}
                  {book.isNew && (
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        zIndex: 2,
                      }}
                    >
                      NEW
                    </motion.div>
                  )}

                  {book.isFeatured && (
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        zIndex: 2,
                      }}
                    >
                      FEATURED
                    </motion.div>
                  )}

                  {/* Book Cover */}
                  <div
                    style={{
                      height: "180px",
                      background: book.coverColor,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Animated gradient overlay */}
                    <motion.div
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                        backgroundSize: "200% 200%",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem",
                        color: "white",
                      }}
                    >
                      <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                        {book.format.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                        {book.title.split(" ").slice(0, 3).join(" ")}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            margin: "0 0 0.5rem 0",
                            fontSize: "1.25rem",
                            fontWeight: "700",
                            color: "#1e293b",
                            lineHeight: "1.3",
                          }}
                        >
                          {book.title}
                        </h3>
                        <p
                          style={{
                            margin: "0 0 0.75rem 0",
                            color: "#64748b",
                            fontSize: "0.95rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <BookOpen size={16} />
                          {book.author}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFavorite(book.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: favorites.includes(book.id)
                            ? "#ef4444"
                            : "#cbd5e1",
                        }}
                      >
                        <Heart
                          size={20}
                          fill={
                            favorites.includes(book.id) ? "#ef4444" : "none"
                          }
                        />
                      </motion.button>
                    </div>

                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#64748b",
                        lineHeight: "1.5",
                        marginBottom: "1.5rem",
                        height: "60px",
                        overflow: "hidden",
                      }}
                    >
                      {book.description}
                    </p>

                    {/* Rating */}
                    <div style={{ marginBottom: "1rem" }}>
                      <StarRating rating={book.rating} />
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "0.75rem",
                        marginBottom: "1.5rem",
                        background: "#f8fafc",
                        padding: "1rem",
                        borderRadius: "12px",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Pages
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <BookText size={14} color="#64748b" />
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>
                            {book.pages}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Downloads
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Download size={14} color="#64748b" />
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>
                            {book.downloads.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#94a3b8",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Views
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Eye size={14} color="#64748b" />
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>
                            {book.views.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {book.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#f1f5f9",
                            color: "#64748b",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleRead(book)} // Updated to use handleRead
                        style={{
                          flex: 2,
                          padding: "0.875rem",
                          background:
                            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <BookOpen size={18} /> Read Now
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleDownload(book)}
                        style={{
                          flex: 1,
                          padding: "0.875rem",
                          background: "#f1f5f9",
                          color: "#1e293b",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Download size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: "3rem", textAlign: "center" }}
        >
          <Link
            to="/dashboard"
            style={{
              padding: "1rem 2rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "white",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0",
            }}
            whileHover={{
              background: "#4f46e5",
              color: "white",
              borderColor: "#4f46e5",
            }}
          >
            <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
            Back to Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Floating Actions */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          display: "flex",
          gap: "1rem",
          zIndex: 1000,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowDown size={20} style={{ transform: "rotate(180deg)" }} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: "50px",
            height: "50px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
          }}
          onClick={() => alert("Viewing your reading history")}
        >
          <Clock size={20} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookCatalog;
