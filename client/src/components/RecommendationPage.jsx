import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { aiAPI } from "../services/api";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Brain,
  Filter,
  Star,
  User,
  Calendar,
  Bookmark,
  Target,
  RefreshCw,
  CheckCircle,
  ChevronDown,
  Coffee,
  TrendingUp,
  BookText,
} from "lucide-react";

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState({
    mood: "all",
    time: "all",
    genre: "all",
    difficulty: "all",
  });
  const [loading, setLoading] = useState(false);
  const [expandedBook, setExpandedBook] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    readingSpeed: "average",
  });

  const aiRecommendations = [
    {
      id: 1,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      genre: ["History", "Anthropology", "Science"],
      rating: 4.9,
      ratingCount: 24580,
      description:
        "Explores how Homo sapiens evolved from insignificant apes to rulers of the world through cognitive, agricultural, and scientific revolutions.",
      readingTime: 480,
      pages: 512,
      matchScore: 98,
      matchReasons: [
        "Matches your interest in human history",
        "Based on your reading of similar books",
        "Highly rated by readers with similar tastes",
      ],
      coverColor: "#8b5cf6",
      tags: ["Bestseller", "Award-winning", "Thought-provoking"],
      aiInsights: [
        "You'll enjoy the big-picture historical perspective",
        "Connects well with your interest in philosophy",
        "Reading pace matches your average speed",
      ],
      format: "Paperback",
      publishedYear: 2014,
    },
    {
      id: 2,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      genre: ["Psychology", "Science", "Philosophy"],
      rating: 4.7,
      ratingCount: 18765,
      description:
        "Presents the two systems that drive the way we think—System 1 (fast, intuitive) and System 2 (slow, deliberate).",
      readingTime: 560,
      pages: 499,
      matchScore: 92,
      matchReasons: [
        "Aligns with your psychology interests",
        "Recommended by our AI based on your activity",
        "Similar to books you've rated highly",
      ],
      coverColor: "#0ea5e9",
      tags: ["Psychology", "Nobel Prize", "Cognitive Science"],
      aiInsights: [
        "Complements your interest in human behavior",
        "Chapters are digestible for your reading habits",
        "Contains practical insights you'll appreciate",
      ],
      format: "Hardcover",
      publishedYear: 2011,
    },
    {
      id: 3,
      title: "The God Delusion",
      author: "Richard Dawkins",
      genre: ["Science", "Philosophy", "Religion"],
      rating: 4.5,
      ratingCount: 15432,
      description:
        "A passionate argument for atheism, presenting the scientific and philosophical case against religious belief.",
      readingTime: 420,
      pages: 374,
      matchScore: 88,
      matchReasons: [
        "Matches your philosophical interests",
        "Controversial perspective you might enjoy",
        "Well-researched scientific approach",
      ],
      coverColor: "#ef4444",
      tags: ["Controversial", "Scientific", "Philosophical"],
      aiInsights: [
        "Will challenge your perspectives",
        "Writing style matches your preference",
        "References align with your reading history",
      ],
      format: "Paperback",
      publishedYear: 2006,
    },
    {
      id: 4,
      title: "Cosmos",
      author: "Carl Sagan",
      genre: ["Science", "Astronomy", "Philosophy"],
      rating: 4.9,
      ratingCount: 22654,
      description:
        "A journey through the universe, exploring cosmic evolution, the development of science, and the place of humanity in the cosmos.",
      readingTime: 520,
      pages: 365,
      matchScore: 90,
      matchReasons: [
        "Matches your interest in cosmology",
        "Beautiful science writing style",
        "Complementary to your philosophical readings",
      ],
      coverColor: "#f59e0b",
      tags: ["Classic", "Astronomy", "Philosophical"],
      aiInsights: [
        "Perfect blend of science and philosophy",
        "Inspiring writing you'll enjoy",
        "Accessible for your reading level",
      ],
      format: "Hardcover",
      publishedYear: 1980,
    },
  ];

  const filterOptions = {
    mood: [
      { value: "all", label: "Any Mood", icon: "😊" },
      { value: "learn", label: "Learn", icon: "🧠" },
      { value: "relax", label: "Relax", icon: "😌" },
      { value: "escape", label: "Escape", icon: "🚀" },
      { value: "inspire", label: "Inspire", icon: "✨" },
    ],
    time: [
      { value: "all", label: "Any Time", icon: "⏰" },
      { value: "short", label: "Short (< 4h)", icon: "⚡" },
      { value: "medium", label: "Medium (4-8h)", icon: "📖" },
      { value: "long", label: "Long (> 8h)", icon: "📚" },
    ],
    genre: [
      { value: "all", label: "All Genres", icon: "📚" },
      { value: "history", label: "History", icon: "🏛️" },
      { value: "science", label: "Science", icon: "🔬" },
      { value: "philosophy", label: "Philosophy", icon: "🤔" },
    ],
    difficulty: [
      { value: "all", label: "Any Level", icon: "📊" },
      { value: "easy", label: "Easy", icon: "😊" },
      { value: "medium", label: "Medium", icon: "🤓" },
      { value: "challenging", label: "Challenging", icon: "🧠" },
    ],
  };

  const calculateReadingTime = (
    pages,
    speed = userPreferences.readingSpeed,
  ) => {
    const wordsPerPage = 250;
    const totalWords = pages * wordsPerPage;

    const readingSpeeds = {
      slow: 150,
      average: 250,
      fast: 350,
    };

    return Math.ceil(totalWords / readingSpeeds[speed]);
  };

  const formatReadingTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
    }
  };

  const getReadingSpeedLabel = (speed) => {
    const labels = {
      slow: "Slow (150 wpm)",
      average: "Average (250 wpm)",
      fast: "Fast (350 wpm)",
    };
    return labels[speed] || "Average (250 wpm)";
  };

  const filteredBooks = aiRecommendations.filter((book) => {
    if (selectedFilters.time !== "all") {
      const timeMap = {
        short: book.readingTime < 240,
        medium: book.readingTime >= 240 && book.readingTime <= 480,
        long: book.readingTime > 480,
      };
      if (!timeMap[selectedFilters.time]) return false;
    }

    if (selectedFilters.genre !== "all") {
      if (
        !book.genre
          .map((g) => g.toLowerCase())
          .includes(selectedFilters.genre.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });

  const handleBookClick = (book) => {
    navigate("/book-details", { state: { book } });
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    aiAPI
      .recommendations()
      .catch(() => {})
      .finally(() => {
        setTimeout(() => setLoading(false), 800);
      });
  };

  const handleReadingSpeedChange = (speed) => {
    setUserPreferences((prev) => ({
      ...prev,
      readingSpeed: speed,
    }));
  };

  const toggleBookExpansion = (bookId) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      mood: "all",
      time: "all",
      genre: "all",
      difficulty: "all",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              background: `radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)`,
              borderRadius: "50%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
            padding: "1rem 0",
          }}
        >
          <div>
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                marginBottom: "1rem",
              }}
            >
              <ArrowLeft size={20} />
            </motion.button>

            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Brain size={32} />
                AI Book Recommendations
              </h1>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                }}
              >
                Personalized suggestions based on your reading history and
                preferences
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: "0.875rem 1.5rem",
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
              height: "fit-content",
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <RefreshCw size={16} />
            )}
            {loading ? "Refreshing..." : "Refresh AI"}
          </motion.button>
        </motion.div>

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "2rem",
          }}
        >
          {/* Left Panel */}
          <div>
            {/* Reading Time Estimator */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Clock size={20} color="#8b5cf6" />
                Reading Time Estimator
              </h3>

              <div style={{ marginBottom: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <User size={14} />
                  Your Reading Speed
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {["slow", "average", "fast"].map((speed) => (
                    <motion.button
                      key={speed}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReadingSpeedChange(speed)}
                      style={{
                        padding: "0.75rem 0.5rem",
                        background:
                          userPreferences.readingSpeed === speed
                            ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
                            : "#f1f5f9",
                        color:
                          userPreferences.readingSpeed === speed
                            ? "white"
                            : "#64748b",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </motion.button>
                  ))}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    textAlign: "center",
                  }}
                >
                  {getReadingSpeedLabel(userPreferences.readingSpeed)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Clock size={14} />
                  Estimated Reading Times
                </div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { pages: 100, label: "Short book (100 pages)" },
                    { pages: 300, label: "Medium book (300 pages)" },
                    { pages: 500, label: "Long book (500 pages)" },
                  ].map((item, index) => {
                    const time = calculateReadingTime(item.pages);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        style={{
                          background: "#f8fafc",
                          borderRadius: "10px",
                          padding: "0.875rem",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              color: "#1e293b",
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#8b5cf6",
                            }}
                          >
                            {formatReadingTime(time)}
                          </div>
                        </div>
                        <div
                          style={{
                            height: "4px",
                            background: "#e2e8f0",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min((time / 600) * 100, 100)}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            style={{
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #8b5cf6 0%, #0ea5e9 100%)",
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* AI Filters */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "20px",
                padding: "1.5rem",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Filter size={20} color="#8b5cf6" />
                AI Filters
              </h3>

              {Object.entries(filterOptions).map(([filterType, options]) => (
                <div key={filterType} style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#475569",
                      marginBottom: "0.75rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {filterType}
                  </div>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleFilterChange(filterType, option.value)
                        }
                        style={{
                          padding: "0.5rem 0.75rem",
                          background:
                            selectedFilters[filterType] === option.value
                              ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)"
                              : "#f1f5f9",
                          color:
                            selectedFilters[filterType] === option.value
                              ? "white"
                              : "#64748b",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "500",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem" }}>
                          {option.icon}
                        </span>
                        {option.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Panel - Recommendations */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "0.25rem",
                  }}
                >
                  Personalized Recommendations
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                  {filteredBooks.length} books match your preferences
                </p>
              </div>
            </div>

            {/* Recommendations Grid */}
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleBookExpansion(book.id)}
                >
                  {/* Book Header */}
                  <div
                    style={{
                      padding: "1.5rem",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Book Cover */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      style={{
                        width: "80px",
                        height: "120px",
                        background: book.coverColor,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "2rem",
                        fontWeight: "700",
                        flexShrink: 0,
                        boxShadow: `0 10px 30px ${book.coverColor}40`,
                      }}
                    >
                      {book.title.charAt(0)}
                    </motion.div>

                    {/* Book Info */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              color: "#1e293b",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {book.title}
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              marginBottom: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <User size={14} color="#64748b" />
                              <span
                                style={{
                                  color: "#64748b",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {book.author}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <Calendar size={14} color="#64748b" />
                              <span
                                style={{
                                  color: "#64748b",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {book.publishedYear}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <BookText size={14} color="#64748b" />
                              <span
                                style={{
                                  color: "#64748b",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {book.pages} pages
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div
                          style={{
                            background:
                              "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontWeight: "700",
                            fontSize: "1.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            boxShadow: "0 5px 20px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <Target size={16} />
                          {book.matchScore}%
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        style={{
                          color: "#475569",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          marginBottom: "1rem",
                        }}
                      >
                        {book.description}
                      </p>

                      {/* Tags & Stats */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {book.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "0.25rem 0.75rem",
                                background: "rgba(139, 92, 246, 0.1)",
                                color: "#8b5cf6",
                                borderRadius: "20px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                border: "1px solid rgba(139, 92, 246, 0.2)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span
                              style={{
                                color: "#1e293b",
                                fontWeight: "600",
                                fontSize: "0.875rem",
                              }}
                            >
                              {book.rating}
                            </span>
                            <span
                              style={{ color: "#94a3b8", fontSize: "0.75rem" }}
                            >
                              ({book.ratingCount.toLocaleString()})
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Clock size={14} color="#64748b" />
                            <span
                              style={{
                                color: "#64748b",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                              }}
                            >
                              {formatReadingTime(
                                calculateReadingTime(book.pages),
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {expandedBook === book.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{
                        background:
                          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        padding: "1.5rem",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1.5rem",
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#1e293b",
                              marginBottom: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Target size={14} color="#8b5cf6" />
                            Why This Matches You
                          </h4>
                          <ul style={{ paddingLeft: "1.25rem" }}>
                            {book.matchReasons.map((reason, idx) => (
                              <li
                                key={idx}
                                style={{
                                  color: "#475569",
                                  fontSize: "0.875rem",
                                  marginBottom: "0.5rem",
                                  lineHeight: 1.5,
                                }}
                              >
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: "600",
                              color: "#1e293b",
                              marginBottom: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Brain size={14} color="#8b5cf6" />
                            AI Insights
                          </h4>
                          <ul style={{ paddingLeft: "1.25rem" }}>
                            {book.aiInsights.map((insight, idx) => (
                              <li
                                key={idx}
                                style={{
                                  color: "#475569",
                                  fontSize: "0.875rem",
                                  marginBottom: "0.5rem",
                                  lineHeight: 1.5,
                                }}
                              >
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          marginTop: "1rem",
                          paddingTop: "1rem",
                          borderTop: "1px solid #e2e8f0",
                        }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookClick(book);
                          }}
                          style={{
                            padding: "0.75rem 1.5rem",
                            background:
                              "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <BookOpen size={16} />
                          View Book Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: "0.75rem 1.5rem",
                            background: "#f1f5f9",
                            color: "#64748b",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Bookmark size={16} />
                          Save for Later
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Expand/Collapse Button */}
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      display: "flex",
                      justifyContent: "center",
                      borderTop: "1px solid #e2e8f0",
                      background: "#f8fafc",
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookExpansion(book.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8b5cf6",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                      }}
                    >
                      {expandedBook === book.id ? (
                        <>
                          Show Less
                          <ChevronDown
                            size={16}
                            style={{ transform: "rotate(180deg)" }}
                          />
                        </>
                      ) : (
                        <>
                          Show AI Analysis
                          <ChevronDown size={16} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredBooks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                  borderRadius: "20px",
                  padding: "4rem 2rem",
                  textAlign: "center",
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #0ea5e9 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    color: "white",
                  }}
                >
                  <Brain size={32} />
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    marginBottom: "0.5rem",
                  }}
                >
                  No matches found
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  Try adjusting your filters to see more recommendations
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetFilters}
                  style={{
                    padding: "0.875rem 1.5rem",
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    margin: "0 auto",
                  }}
                >
                  <RefreshCw size={16} />
                  Reset All Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;
