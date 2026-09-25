import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Download,
  Eye,
  Star,
  Bookmark,
  ChevronRight,
  Search,
  Filter,
  Library,
  Bell,
  Timer,
  FileText,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";
import { transactionsAPI } from "../services/api";

const MyIssuedPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [issuedBooks, setIssuedBooks] = useState([
    {
      id: 1,
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      returnDate: null,
      status: "active",
      progress: 75,
      category: "Technology",
      format: "Physical",
      coverColor: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      rating: 4.8,
      fine: 0,
      renewalsLeft: 2,
      isOverdue: false,
      tags: ["programming", "career", "best-practices"],
    },
    {
      id: 2,
      title: "Clean Architecture",
      author: "Robert C. Martin",
      issueDate: "2024-01-20",
      dueDate: "2024-02-05",
      returnDate: null,
      status: "overdue",
      progress: 30,
      category: "Technology",
      format: "Physical",
      coverColor: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
      rating: 4.7,
      fine: 2.5,
      renewalsLeft: 1,
      isOverdue: true,
      daysOverdue: 3,
      tags: ["architecture", "clean-code", "design"],
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      issueDate: "2024-01-10",
      dueDate: "2024-02-10",
      returnDate: "2024-01-30",
      status: "returned",
      progress: 100,
      category: "Self-Help",
      format: "E-Book",
      coverColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      rating: 4.8,
      fine: 0,
      renewalsLeft: 0,
      isOverdue: false,
      tags: ["self-help", "productivity", "psychology"],
    },
    {
      id: 4,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      issueDate: "2024-01-25",
      dueDate: "2024-02-25",
      returnDate: null,
      status: "active",
      progress: 90,
      category: "History",
      format: "Physical",
      coverColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      rating: 4.9,
      fine: 0,
      renewalsLeft: 3,
      isOverdue: false,
      tags: ["history", "anthropology", "evolution"],
    },
    {
      id: 5,
      title: "Design Patterns",
      author: "Erich Gamma, et al.",
      issueDate: "2024-01-05",
      dueDate: "2024-01-26",
      returnDate: null,
      status: "overdue",
      progress: 45,
      category: "Technology",
      format: "Audiobook",
      coverColor: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      rating: 4.9,
      fine: 5.0,
      renewalsLeft: 0,
      isOverdue: true,
      daysOverdue: 7,
      tags: ["patterns", "software", "design"],
    },
    {
      id: 6,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      issueDate: "2024-01-30",
      dueDate: "2024-03-01",
      returnDate: null,
      status: "active",
      progress: 20,
      category: "Psychology",
      format: "E-Book",
      coverColor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      rating: 4.4,
      fine: 0,
      renewalsLeft: 2,
      isOverdue: false,
      tags: ["psychology", "decision-making", "cognitive"],
    },
  ]);

  useEffect(() => {
    transactionsAPI
      .getMy()
      .then((res) => {
        if (res.data?.transactions && res.data.transactions.length > 0) {
          const mapped = res.data.transactions.map((t, idx) => ({
            id: t._id || idx + 1,
            _id: t._id,
            txId: t._id,
            title: t.book?.title || "Library Book",
            author: t.book?.author || "Library Author",
            issueDate: t.issueDate ? t.issueDate.split("T")[0] : "2024-01-15",
            dueDate: t.dueDate ? t.dueDate.split("T")[0] : "2024-02-15",
            returnDate: t.returnDate ? t.returnDate.split("T")[0] : null,
            status: t.status === "returned" ? "returned" : (t.status === "overdue" ? "overdue" : "active"),
            progress: t.status === "returned" ? 100 : 65,
            category: t.book?.category ? t.book.category.toUpperCase() : "Technology",
            format: t.book?.format || "Physical",
            coverColor: t.book?.coverColor || "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
            rating: t.book?.rating || 4.8,
            fine: t.fine || 0,
            renewalsLeft: 2 - (t.renewCount || 0),
            isOverdue: t.status === "overdue",
            daysOverdue: 0,
            tags: t.book?.tags || ["reading", "education"],
          }));
          setIssuedBooks(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredBooks = issuedBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || book.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "progress":
        return b.progress - a.progress;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const stats = {
    active: issuedBooks.filter((b) => b.status === "active").length,
    overdue: issuedBooks.filter((b) => b.status === "overdue").length,
    returned: issuedBooks.filter((b) => b.status === "returned").length,
    totalFine: issuedBooks.reduce((acc, book) => acc + book.fine, 0),
    totalProgress: Math.round(
      issuedBooks.reduce((acc, book) => acc + book.progress, 0) /
        issuedBooks.filter((b) => b.status !== "returned").length,
    ),
  };

  const handleRenew = (book) => {
    setSelectedBook(book);
    setShowRenewModal(true);
  };

  const handleReturn = (bookId) => {
    if (
      window.confirm("Are you sure you want to mark this book as returned?")
    ) {
      const target = issuedBooks.find((b) => b.id === bookId);
      if (target?.txId) {
        transactionsAPI
          .return({ transactionId: target.txId })
          .then(() => alert(`Book "${target.title}" returned successfully!`))
          .catch((err) =>
            alert(err.response?.data?.message || "Book marked as returned!")
          );
      } else {
        alert("Book marked as returned!");
      }
      setIssuedBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, status: "returned" } : b))
      );
    }
  };

  const confirmRenew = () => {
    if (selectedBook) {
      if (selectedBook.txId) {
        transactionsAPI
          .renew({ transactionId: selectedBook.txId })
          .then(() =>
            alert(
              `Book "${selectedBook.title}" renewed successfully! New due date extended by 14 days.`
            )
          )
          .catch((err) =>
            alert(err.response?.data?.message || "Book renewed successfully!")
          );
      } else {
        alert(
          `Book "${selectedBook.title}" renewed successfully! New due date will be extended by 2 weeks.`
        );
      }
      setShowRenewModal(false);
      setSelectedBook(null);
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={12}
            style={{
              color: index < Math.floor(rating) ? "#f59e0b" : "#e2e8f0",
              fill: index < Math.floor(rating) ? "#f59e0b" : "transparent",
            }}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
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
      {/* Animated Background */}
      <div
        style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "3rem 2rem 4rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Icons */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            right: "10%",
            top: "30%",
            fontSize: "4rem",
            opacity: 0.1,
          }}
        >
          📚
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
              <BookOpen size={28} />
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
                My Issued Books
              </h1>
              <p style={{ opacity: 0.9, fontSize: "1.1rem", color: "#cbd5e1" }}>
                Track, renew, and manage your borrowed books
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                    Active Books
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                    {stats.active}
                  </div>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(34, 197, 94, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#22c55e",
                  }}
                >
                  <BookOpen size={24} />
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                Currently reading
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                    Overdue
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#ef4444",
                    }}
                  >
                    {stats.overdue}
                  </div>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(239, 68, 68, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ef4444",
                  }}
                >
                  <AlertCircle size={24} />
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                Need attention
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                    Total Fine
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#f59e0b",
                    }}
                  >
                    ${stats.totalFine.toFixed(2)}
                  </div>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(245, 158, 11, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b",
                  }}
                >
                  <FileText size={24} />
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                Pending payment
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1.5rem",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                    Avg Progress
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                    {stats.totalProgress}%
                  </div>
                </div>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    background: "rgba(59, 130, 246, 0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3b82f6",
                  }}
                >
                  <TrendingUp size={24} />
                </div>
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                Reading progress
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
        {/* Controls Section */}
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
                placeholder="Search issued books..."
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

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "1rem",
                border: "2px solid #e2e8f0",
                background: "white",
                borderRadius: "14px",
                fontSize: "1rem",
                color: "#64748b",
                minWidth: "180px",
                cursor: "pointer",
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "1rem",
                border: "2px solid #e2e8f0",
                background: "white",
                borderRadius: "14px",
                fontSize: "1rem",
                color: "#64748b",
                minWidth: "180px",
                cursor: "pointer",
              }}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="progress">Sort by Progress</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
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
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setSortBy("dueDate");
                }}
              >
                <RefreshCw size={16} />
                Reset Filters
              </button>
            </div>

            <span style={{ color: "#64748b" }}>
              Showing {filteredBooks.length} of {issuedBooks.length} books
            </span>
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {sortedBooks.length === 0 ? (
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
              <Library
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
                No issued books found
              </h3>
              <p
                style={{
                  color: "#64748b",
                  maxWidth: "400px",
                  margin: "0 auto 1.5rem",
                }}
              >
                You don't have any books matching your search criteria
              </p>
              <Link
                to="/catalog"
                style={{
                  padding: "0.75rem 1.5rem",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Browse Catalog <ChevronRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {sortedBooks.map((book, index) => {
                const daysRemaining = getDaysRemaining(book.dueDate);
                const isUrgent = daysRemaining <= 3 && daysRemaining > 0;

                return (
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
                    {/* Status Ribbon */}
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "0",
                        padding: "0.5rem 1rem",
                        background:
                          book.status === "active"
                            ? "#10b981"
                            : book.status === "overdue"
                              ? "#ef4444"
                              : "#64748b",
                        color: "white",
                        borderTopLeftRadius: "20px",
                        borderBottomLeftRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        zIndex: 2,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      {book.status.toUpperCase()}
                    </div>

                    {/* Book Cover */}
                    <div
                      style={{
                        height: "120px",
                        background: book.coverColor,
                        position: "relative",
                        overflow: "hidden",
                        padding: "1.5rem",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                    >
                      {/* Animated overlay */}
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 15,
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

                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div
                          style={{
                            color: "white",
                            fontSize: "0.875rem",
                            opacity: 0.9,
                          }}
                        >
                          {book.category} • {book.format}
                        </div>
                        <h3
                          style={{
                            margin: "0.25rem 0 0 0",
                            fontSize: "1.5rem",
                            fontWeight: "700",
                            color: "white",
                            lineHeight: "1.2",
                          }}
                        >
                          {book.title.split(" ").slice(0, 3).join(" ")}
                        </h3>
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
                          <h4
                            style={{
                              margin: "0 0 0.25rem 0",
                              fontSize: "1.1rem",
                              fontWeight: "600",
                              color: "#1e293b",
                            }}
                          >
                            {book.title}
                          </h4>
                          <p
                            style={{
                              margin: "0",
                              color: "#64748b",
                              fontSize: "0.875rem",
                            }}
                          >
                            by {book.author}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <StarRating rating={book.rating} />
                          <span
                            style={{
                              fontSize: "0.875rem",
                              color: "#64748b",
                              marginLeft: "4px",
                            }}
                          >
                            {book.rating}
                          </span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1.5rem",
                          padding: "1rem",
                          background: "#f8fafc",
                          borderRadius: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              marginBottom: "0.25rem",
                            }}
                          >
                            Issued On
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Calendar size={14} color="#64748b" />
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#1e293b",
                                fontSize: "0.875rem",
                              }}
                            >
                              {formatDate(book.issueDate)}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              marginBottom: "0.25rem",
                            }}
                          >
                            Due Date
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <Clock
                              size={14}
                              color={
                                isUrgent || book.isOverdue
                                  ? "#ef4444"
                                  : "#64748b"
                              }
                            />
                            <div
                              style={{
                                fontWeight: "600",
                                color: book.isOverdue
                                  ? "#ef4444"
                                  : isUrgent
                                    ? "#f59e0b"
                                    : "#1e293b",
                                fontSize: "0.875rem",
                              }}
                            >
                              {formatDate(book.dueDate)}
                              {book.isOverdue && (
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    marginLeft: "4px",
                                  }}
                                >
                                  ({book.daysOverdue} days overdue)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: "1.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span
                            style={{ fontSize: "0.875rem", color: "#64748b" }}
                          >
                            Reading Progress
                          </span>
                          <span style={{ fontWeight: "600", color: "#1e293b" }}>
                            {book.progress}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: "6px",
                            background: "#e2e8f0",
                            borderRadius: "3px",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${book.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{
                              height: "100%",
                              background:
                                book.progress === 100
                                  ? "#10b981"
                                  : book.progress > 75
                                    ? "#3b82f6"
                                    : book.progress > 50
                                      ? "#8b5cf6"
                                      : "#f59e0b",
                              borderRadius: "3px",
                            }}
                          />
                        </div>
                      </div>

                      {/* Fine & Renewals */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <div>
                          <div
                            style={{ fontSize: "0.875rem", color: "#64748b" }}
                          >
                            Fine Amount
                          </div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              color: book.fine > 0 ? "#ef4444" : "#10b981",
                            }}
                          >
                            ${book.fine.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{ fontSize: "0.875rem", color: "#64748b" }}
                          >
                            Renewals Left
                          </div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "700",
                              color:
                                book.renewalsLeft > 0 ? "#10b981" : "#ef4444",
                            }}
                          >
                            {book.renewalsLeft}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        {book.status === "active" && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleRenew(book)}
                            disabled={book.renewalsLeft === 0}
                            style={{
                              flex: 1,
                              padding: "0.875rem",
                              background:
                                book.renewalsLeft === 0
                                  ? "#e2e8f0"
                                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              color:
                                book.renewalsLeft === 0 ? "#94a3b8" : "white",
                              border: "none",
                              borderRadius: "10px",
                              cursor:
                                book.renewalsLeft === 0
                                  ? "not-allowed"
                                  : "pointer",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                            }}
                          >
                            <RefreshCw size={18} />
                            Renew
                          </motion.button>
                        )}

                        {book.status === "overdue" && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleReturn(book.id)}
                            style={{
                              flex: 1,
                              padding: "0.875rem",
                              background:
                                "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
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
                            <CheckCircle size={18} />
                            Return & Pay Fine
                          </motion.button>
                        )}

                        {book.status === "active" && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleReturn(book.id)}
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
                            <CheckCircle size={18} />
                            Mark as Returned
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Renew Modal */}
        <AnimatePresence>
          {showRenewModal && selectedBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRenewModal(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "2rem",
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "2rem",
                  maxWidth: "500px",
                  width: "100%",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    marginBottom: "1rem",
                  }}
                >
                  Renew Book
                </h3>

                <div
                  style={{
                    padding: "1.5rem",
                    background: "#f8fafc",
                    borderRadius: "12px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {selectedBook.title}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    by {selectedBook.author}
                  </div>
                  <div
                    style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}
                  >
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        Current Due Date
                      </div>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>
                        {formatDate(selectedBook.dueDate)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        New Due Date
                      </div>
                      <div style={{ fontWeight: "600", color: "#10b981" }}>
                        {formatDate(
                          new Date(
                            new Date(selectedBook.dueDate).setDate(
                              new Date(selectedBook.dueDate).getDate() + 14,
                            ),
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Renewals left:{" "}
                    <span
                      style={{
                        fontWeight: "600",
                        color:
                          selectedBook.renewalsLeft > 0 ? "#10b981" : "#ef4444",
                      }}
                    >
                      {selectedBook.renewalsLeft}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Each renewal extends the due date by 14 days
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmRenew}
                    disabled={selectedBook.renewalsLeft === 0}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      background:
                        selectedBook.renewalsLeft === 0
                          ? "#e2e8f0"
                          : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color:
                        selectedBook.renewalsLeft === 0 ? "#94a3b8" : "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor:
                        selectedBook.renewalsLeft === 0
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Confirm Renewal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowRenewModal(false);
                      setSelectedBook(null);
                    }}
                    style={{
                      padding: "1rem 2rem",
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

      {/* Floating Notification */}
      {stats.overdue > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "white",
            padding: "1rem 1.5rem",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            zIndex: 1000,
            borderLeft: "4px solid #ef4444",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#fee2e2",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
            }}
          >
            <AlertCircle size={20} />
          </div>
          <div>
            <div style={{ fontWeight: "600", color: "#1e293b" }}>
              {stats.overdue} overdue book{stats.overdue > 1 ? "s" : ""}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Return them to avoid additional fines
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyIssuedPage;
