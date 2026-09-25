import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { booksAPI, transactionsAPI } from "../services/api";
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  Tag,
  Star,
  Heart,
  Bookmark,
  Clock,
  Award,
  TrendingUp,
  ChevronRight,
  BookText,
  PenTool,
  Globe,
  Hash,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  MessageSquare,
  MapPin,
  Copy,
  Share2,
  Download,
  Eye,
  BookmarkCheck,
} from "lucide-react";

const BookDetailspage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (location.state?.book) {
      setBookData(location.state.book);
      setLoading(false);
    } else {
      // Fallback: fetch first available book from Atlas API so page never breaks
      booksAPI
        .getAll({ limit: 1 })
        .then((res) => {
          if (res.data?.books && res.data.books.length > 0) {
            const b = res.data.books[0];
            setBookData({
              id: b._id,
              _id: b._id,
              title: b.title,
              author: b.author,
              category: (b.category || "tech").toLowerCase(),
              format: b.format || "pdf",
              language: b.language || "english",
              rating: b.rating || 4.8,
              pages: b.pages || 350,
              downloads: b.downloads || 12000,
              views: b.views || 38000,
              isNew: b.isNew || false,
              isFeatured: true,
              description:
                b.description ||
                "Classic engineering book covering best practices and architecture.",
              coverColor:
                b.coverColor ||
                "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              fileSize: b.fileSize || "4.2 MB",
              tags: b.tags || ["programming", "engineering"],
              availableCopies: b.availableCopies !== undefined ? b.availableCopies : 1,
              totalCopies: b.totalCopies !== undefined ? b.totalCopies : 1,
              isbn: b.isbn || "978-0135957059",
            });
            setLoading(false);
          } else {
            navigate("/catalog");
          }
        })
        .catch(() => navigate("/catalog"));
    }
  }, [location.state, navigate]);

  const handleBorrow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(
        `Borrow request placed for "${bookData?.title}". Please collect from library shelf!`
      );
    }, 800);
  };

  const handleReserve = async () => {
    setLoading(true);
    try {
      if (bookData?._id) {
        const res = await transactionsAPI.reserve({ bookId: bookData._id });
        alert(`Successfully reserved "${bookData.title}"! ` + (res.data?.message || ""));
      } else {
        alert(`Reserved "${bookData?.title}"!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not reserve book");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !bookData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #e2e8f0",
              borderTopColor: "#8b5cf6",
              borderRadius: "50%",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "#64748b", fontSize: "1.125rem" }}>
            Loading book details...
          </p>
        </div>
      </div>
    );
  }

  const safeBookData = {
    ...bookData,
    title: bookData.title || "Unknown Book",
    author: bookData.author || "Unknown Author",
    description: bookData.description || "No description available.",
    coverColor: bookData.coverColor || "#8b5cf6",
    genre: Array.isArray(bookData.genre)
      ? bookData.genre
      : bookData.category
        ? [bookData.category]
        : ["General"],
    publishedYear: bookData.publishedYear || new Date().getFullYear(),
    pages: bookData.pages || 0,
    language: bookData.language || "English",
    isbn: bookData.isbn || "N/A",
    publisher: bookData.publisher || "Unknown",
    rating: bookData.rating || 0,
    totalRatings: bookData.totalRatings || 0,
    availableCopies: bookData.availableCopies || 0,
    totalCopies: bookData.totalCopies || 0,
    waitingList: bookData.waitingList || 0,
    dueDate: bookData.dueDate || "N/A",
    location: bookData.location || "Library",
    tags: Array.isArray(bookData.tags) ? bookData.tags : ["Book", "Reading"],
    reviews: Array.isArray(bookData.reviews) ? bookData.reviews : [],
    format: bookData.format || "Unknown",
    downloads: bookData.downloads || 0,
    views: bookData.views || 0,
    isNew: bookData.isNew || false,
    isFeatured: bookData.isFeatured || false,
  };

  const statsCards = [
    {
      title: "Average Rating",
      value: safeBookData.rating,
      icon: <Star size={20} />,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.1)",
      change: `${safeBookData.totalRatings.toLocaleString()} ratings`,
    },
    {
      title: "Pages",
      value: safeBookData.pages,
      icon: <BookOpen size={20} />,
      color: "#0ea5e9",
      bgColor: "rgba(14, 165, 233, 0.1)",
      change: `Format: ${safeBookData.format}`,
    },
    {
      title: "Available Copies",
      value: `${safeBookData.availableCopies}/${safeBookData.totalCopies}`,
      icon: <BookText size={20} />,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      change: `${safeBookData.waitingList} waiting`,
    },
    {
      title: "Publication Year",
      value: safeBookData.publishedYear,
      icon: <Calendar size={20} />,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.1)",
      change: `${new Date().getFullYear() - safeBookData.publishedYear} years ago`,
    },
  ];

  const similarBooks = [
    {
      id: 2,
      title: "The Girl on the Train",
      author: "Paula Hawkins",
      color: "#0ea5e9",
      rating: 4.2,
    },
    {
      id: 3,
      title: "Gone Girl",
      author: "Gillian Flynn",
      color: "#ec4899",
      rating: 4.3,
    },
    {
      id: 4,
      title: "The Woman in the Window",
      author: "A.J. Finn",
      color: "#10b981",
      rating: 4.0,
    },
    {
      id: 5,
      title: "Sharp Objects",
      author: "Gillian Flynn",
      color: "#f59e0b",
      rating: 4.1,
    },
  ];

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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: `${150 + i * 30}px`,
              height: `${150 + i * 30}px`,
              background: `radial-gradient(circle, rgba(${parseInt(
                safeBookData.coverColor.slice(1, 3),
                16,
              )}, ${parseInt(
                safeBookData.coverColor.slice(3, 5),
                16,
              )}, ${parseInt(safeBookData.coverColor.slice(5, 7), 16)}, 0.03) 0%, transparent 70%)`,
              borderRadius: "50%",
              top: `${10 + i * 12}%`,
              left: `${5 + i * 15}%`,
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
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
            padding: "1rem 0",
          }}
        >
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/catalog")}
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
            }}
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "0.25rem",
              }}
            >
              Book Details
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
              Complete information about {safeBookData.title}
            </p>
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              style={{
                background: `linear-gradient(135deg, ${safeBookData.coverColor}20, ${safeBookData.coverColor}40)`,
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                border: `1px solid ${safeBookData.coverColor}30`,
                marginBottom: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(45deg, transparent 30%, ${safeBookData.coverColor}10 50%, transparent 70%)`,
                  backgroundSize: "200% 200%",
                  zIndex: 0,
                }}
              />

              <div
                style={{ position: "relative", zIndex: 1, textAlign: "center" }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    boxShadow: [
                      `0 10px 40px ${safeBookData.coverColor}40`,
                      `0 20px 50px ${safeBookData.coverColor}60`,
                      `0 10px 40px ${safeBookData.coverColor}40`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    width: "200px",
                    height: "280px",
                    background: safeBookData.coverColor,
                    borderRadius: "12px",
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "3rem",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {safeBookData.title.charAt(0)}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  {safeBookData.title}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    color: "#64748b",
                    fontSize: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <User size={16} />
                  {safeBookData.author}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.125rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale:
                            i < Math.floor(safeBookData.rating)
                              ? [1, 1.2, 1]
                              : 1,
                          rotate:
                            i < Math.floor(safeBookData.rating)
                              ? [0, 10, -10, 0]
                              : 0,
                        }}
                        transition={{
                          delay: i * 0.1,
                          duration: 0.5,
                        }}
                      >
                        <Star
                          size={18}
                          fill={
                            i < Math.floor(safeBookData.rating)
                              ? "#f59e0b"
                              : "none"
                          }
                          color={
                            i < Math.floor(safeBookData.rating)
                              ? "#f59e0b"
                              : "#cbd5e1"
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    {safeBookData.rating} (
                    {safeBookData.totalRatings.toLocaleString()})
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "grid",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 15px 40px rgba(16, 185, 129, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBorrow}
                disabled={loading || safeBookData.availableCopies === 0}
                style={{
                  padding: "1rem",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor:
                    safeBookData.availableCopies === 0
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  opacity: safeBookData.availableCopies === 0 ? 0.6 : 1,
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.3)",
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                      }}
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <BookOpen size={20} />
                    {safeBookData.availableCopies === 0
                      ? "Not Available"
                      : "Borrow Now"}
                  </>
                )}
              </motion.button>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(14, 165, 233, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReserve}
                  disabled={loading}
                  style={{
                    padding: "0.875rem",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 8px 25px rgba(14, 165, 233, 0.2)",
                  }}
                >
                  <Bookmark size={16} />
                  Reserve
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    background: isFavorite ? "#fee2e2" : "#f8fafc",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  style={{
                    padding: "0.875rem",
                    background: isFavorite ? "#fee2e2" : "#f1f5f9",
                    color: isFavorite ? "#ef4444" : "#64748b",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Heart size={16} fill={isFavorite ? "#ef4444" : "none"} />
                  Favorite
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
              }}
            >
              <motion.h3
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <TrendingUp size={16} color="#8b5cf6" />
                Book Information
              </motion.h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {[
                  {
                    icon: <Hash size={14} />,
                    label: "Category",
                    value: safeBookData.genre[0],
                  },
                  {
                    icon: <Globe size={14} />,
                    label: "Language",
                    value: safeBookData.language,
                  },
                  {
                    icon: <PenTool size={14} />,
                    label: "Format",
                    value: safeBookData.format.toUpperCase(),
                  },
                  {
                    icon: <Tag size={14} />,
                    label: "Pages",
                    value: safeBookData.pages,
                  },
                  {
                    icon: <Download size={14} />,
                    label: "Downloads",
                    value: safeBookData.downloads.toLocaleString(),
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 0",
                      borderBottom: index < 4 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#64748b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {stat.icon}
                      {stat.label}
                    </div>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{
                    y: -5,
                    boxShadow: `0 15px 40px ${stat.color}20`,
                  }}
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #e2e8f0",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, transparent, ${stat.color}10, transparent)`,
                    }}
                  />

                  <div style={{ position: "relative", zIndex: 1 }}>
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
                          background: stat.bgColor,
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "#64748b",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {stat.title}
                        </div>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: stat.color,
                          }}
                        >
                          {stat.value}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {stat.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  padding: "1.5rem 2rem",
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FileText size={20} color="#8b5cf6" />
                  Book Description
                </h3>
              </div>
              <div style={{ padding: "2rem" }}>
                <p
                  style={{
                    color: "#475569",
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  {safeBookData.description}
                </p>

                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {safeBookData.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      style={{
                        padding: "0.375rem 0.875rem",
                        background: `linear-gradient(135deg, ${safeBookData.coverColor}15, ${safeBookData.coverColor}30)`,
                        color: safeBookData.coverColor,
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: `1px solid ${safeBookData.coverColor}30`,
                        cursor: "pointer",
                      }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* 📚 Book Insights & Additional Content - ADDED SECTION */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e2e8f0",
                marginBottom: "1.5rem",
                padding: "2rem",
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
                <BookText size={20} color="#8b5cf6" />
                Book Insights & Additional Content
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* Timeline Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Clock size={16} color="#8b5cf6" />
                    Key Revolutions Timeline
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      { period: "Cognitive Revolution", year: "70,000 BCE" },
                      { period: "Agricultural Revolution", year: "10,000 BCE" },
                      { period: "Unification of Humankind", year: "2,000 BCE" },
                      { period: "Scientific Revolution", year: "1500 CE+" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.5rem 0",
                          borderBottom:
                            index < 3 ? "1px solid #f1f5f9" : "none",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#8b5cf6",
                            borderRadius: "50%",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: "500",
                              color: "#1e293b",
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.period}
                          </div>
                          <div
                            style={{ color: "#64748b", fontSize: "0.75rem" }}
                          >
                            {item.year}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Author Insights Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <User size={16} color="#8b5cf6" />
                    About the Author
                  </h4>
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                    }}
                  >
                    Yuval Noah Harari is an Israeli historian, philosopher, and
                    bestselling author. He teaches at the Hebrew University of
                    Jerusalem and specializes in world history.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#8b5cf6",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                  >
                    <CheckCircle size={12} />
                    Award-winning Historian
                  </div>
                </motion.div>

                {/* Key Quote Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    borderLeft: "4px solid #8b5cf6",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <MessageSquare size={16} color="#8b5cf6" />
                    Memorable Quote
                  </h4>
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#475569",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      marginBottom: "1rem",
                      paddingLeft: "0.5rem",
                      borderLeft: "2px solid #e2e8f0",
                    }}
                  >
                    "The real difference between us and chimpanzees is the
                    mysterious glue that enables millions of humans to cooperate
                    effectively."
                  </p>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    — Yuval Noah Harari, <em>Sapiens</em>
                  </div>
                </motion.div>

                {/* Key Concepts Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  style={{
                    background: "#f8fafc",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Hash size={16} color="#8b5cf6" />
                    Key Concepts
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    {[
                      "Imagined Realities",
                      "Collective Fiction",
                      "Agricultural Paradox",
                      "Cognitive Revolution",
                      "Shared Myths",
                      "Human Cooperation",
                    ].map((concept, index) => (
                      <span
                        key={index}
                        style={{
                          padding: "0.375rem 0.75rem",
                          background: "rgba(139, 92, 246, 0.1)",
                          color: "#8b5cf6",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          border: "1px solid rgba(139, 92, 246, 0.2)",
                        }}
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailspage;
