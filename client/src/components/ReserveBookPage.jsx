import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Clock,
  Users,
  Calendar,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { booksAPI, transactionsAPI } from "../services/api";

const ReserveBook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [reservedBooks, setReservedBooks] = useState([
    {
      id: 101,
      title: "Design Patterns",
      author: "Erich Gamma",
      reservedDate: "2024-02-01",
      position: 3,
    },
  ]);

  const categories = [
    { id: "all", name: "All Categories", color: "#6366f1", bgColor: "#e0e7ff" },
    {
      id: "programming",
      name: "Programming",
      color: "#0ea5e9",
      bgColor: "#e0f2fe",
    },
    {
      id: "software",
      name: "Software Engineering",
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
    },
    {
      id: "web",
      name: "Web Development",
      color: "#10b981",
      bgColor: "#d1fae5",
    },
    { id: "ai", name: "AI & ML", color: "#f59e0b", bgColor: "#fef3c7" },
  ];

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Pragmatic Programmer: Your Journey to Mastery",
      author: "David Thomas, Andrew Hunt",
      category: "software",
      isbn: "978-0201616224",
      waitlist: 5,
      expectedDate: "2024-02-20",
      totalCopies: 3,
      description:
        "Classic software engineering book covering best practices and career advice for developers.",
      rating: 4.8,
      coverColor: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 2,
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      category: "software",
      isbn: "978-0201633610",
      waitlist: 3,
      expectedDate: "2024-02-15",
      totalCopies: 2,
      description:
        "The definitive guide to software design patterns, essential for any serious developer.",
      rating: 4.9,
      coverColor: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
    },
    {
      id: 3,
      title: "Clean Architecture: A Craftsman's Guide to Software Structure",
      author: "Robert C. Martin",
      category: "software",
      isbn: "978-0134494166",
      waitlist: 2,
      expectedDate: "2024-02-18",
      totalCopies: 2,
      description:
        "Learn how to create software architectures that stand the test of time.",
      rating: 4.7,
      coverColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: 4,
      title: "You Don't Know JS: Up & Going",
      author: "Kyle Simpson",
      category: "web",
      isbn: "978-1491904240",
      waitlist: 4,
      expectedDate: "2024-02-10",
      totalCopies: 4,
      description:
        "Deep dive into JavaScript fundamentals. Perfect for developers who want to master JS.",
      rating: 4.6,
      coverColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: 5,
      title: "The Mythical Man-Month: Essays on Software Engineering",
      author: "Frederick P. Brooks Jr.",
      category: "software",
      isbn: "978-0201835953",
      waitlist: 1,
      expectedDate: "2024-02-25",
      totalCopies: 1,
      description:
        "Timeless essays on software project management and team dynamics.",
      rating: 4.5,
      coverColor: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    },
    {
      id: 6,
      title: "Refactoring: Improving the Design of Existing Code",
      author: "Martin Fowler",
      category: "programming",
      isbn: "978-0201485677",
      waitlist: 3,
      expectedDate: "2024-02-22",
      totalCopies: 3,
      description:
        "Essential techniques for improving code quality through systematic refactoring.",
      rating: 4.8,
      coverColor: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: 7,
      title: "Head First Design Patterns",
      author: "Eric Freeman, Elisabeth Robson",
      category: "software",
      isbn: "978-0596007126",
      waitlist: 6,
      expectedDate: "2024-03-01",
      totalCopies: 2,
      description:
        "Visual and engaging introduction to design patterns using a brain-friendly approach.",
      rating: 4.7,
      coverColor: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    },
    {
      id: 8,
      title: "Introduction to Machine Learning with Python",
      author: "Andreas C. Müller, Sarah Guido",
      category: "ai",
      isbn: "978-1449369415",
      waitlist: 4,
      expectedDate: "2024-02-28",
      totalCopies: 2,
      description:
        "Practical guide to machine learning using Python and scikit-learn.",
      rating: 4.6,
      coverColor: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    },
  ]);

  useEffect(() => {
    booksAPI
      .getAll({ limit: 50 })
      .then((res) => {
        if (res.data?.books && res.data.books.length > 0) {
          const mapped = res.data.books.map((b, idx) => ({
            id: b._id || idx + 1,
            _id: b._id,
            title: b.title,
            author: b.author,
            category: (b.category || "software").toLowerCase(),
            isbn: b.isbn || `978-${1000000000 + idx}`,
            waitlist: Math.max(1, 6 - (b.availableCopies || 0)),
            expectedDate: "2024-03-15",
            totalCopies: b.totalCopies || 1,
            description: b.description || "Comprehensive engineering volume.",
            rating: b.rating || 4.7,
            coverColor: b.coverColor || "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          }));
          setBooks(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReserveBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    const isAlreadyReserved = reservedBooks.some((r) => r.bookId === bookId);

    if (isAlreadyReserved) {
      alert(`You've already reserved "${book.title}"!`);
      return;
    }

    if (book?._id) {
      transactionsAPI
        .reserve({ bookId: book._id })
        .catch((err) => console.log(err));
    }

    const newReservation = {
      id: Date.now(),
      bookId: book.id,
      title: book.title,
      author: book.author,
      reservedDate: new Date().toISOString().split("T")[0],
      position: book.waitlist + 1,
      expectedDate: book.expectedDate,
      status: "waiting",
    };

    setReservedBooks([...reservedBooks, newReservation]);

    // Animation feedback
    const reserveBtn = document.getElementById(`reserve-btn-${bookId}`);
    if (reserveBtn) {
      reserveBtn.innerHTML = "<CheckCircle size={18} /> Reserved!";
      reserveBtn.style.background = "#10b981";
      reserveBtn.style.transform = "scale(0.95)";

      setTimeout(() => {
        reserveBtn.style.transform = "scale(1)";
      }, 300);
    }

    alert(
      `✅ Successfully reserved "${book.title}"!\n\nYou are #${book.waitlist + 1} in queue.\nExpected availability: ${book.expectedDate}`,
    );
  };

  const handleCancelReservation = (reservationId) => {
    const reservation = reservedBooks.find((r) => r.id === reservationId);
    if (window.confirm(`Cancel reservation for "${reservation.title}"?`)) {
      setReservedBooks(reservedBooks.filter((r) => r.id !== reservationId));
      alert(`Reservation for "${reservation.title}" has been cancelled.`);
    }
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.color : "#6366f1";
  };

  const getCategoryBgColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.bgColor : "#e0e7ff";
  };

  // ADDED: StarRating component to display star ratings properly
  const StarRating = ({ rating, size = 16 }) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={size}
            style={{
              color: index < Math.floor(rating) ? "#f59e0b" : "#e2e8f0",
              fill: index < Math.floor(rating) ? "#f59e0b" : "transparent",
            }}
          />
        ))}
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
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          padding: "3rem 2rem 4rem",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
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
                background: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <Bookmark size={28} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  marginBottom: "0.25rem",
                }}
              >
                Reserve Books
              </h1>
              <p style={{ opacity: 0.9, fontSize: "1.1rem" }}>
                Join waitlists for popular books. Get notified when available!
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <BookOpen size={20} />
                <span style={{ fontSize: "0.9rem" }}>Total Books</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {books.length}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Users size={20} />
                <span style={{ fontSize: "0.9rem" }}>Average Waitlist</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {Math.round(
                  books.reduce((acc, book) => acc + book.waitlist, 0) /
                    books.length,
                )}{" "}
                people
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              style={{
                background: "rgba(255,255,255,0.15)",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <TrendingUp size={20} />
                <span style={{ fontSize: "0.9rem" }}>Your Reservations</span>
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {reservedBooks.length}
              </div>
            </motion.div>
          </div>
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
        {/* Search and Filter Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
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
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 1rem 1rem 3rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  background: "#f8fafc",
                  transition: "all 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "1rem 1.5rem",
                border: "2px solid #e2e8f0",
                background: "white",
                borderRadius: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "500",
                color: "#64748b",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.borderColor = "#4f46e5")}
              onMouseOut={(e) => (e.target.style.borderColor = "#e2e8f0")}
            >
              <Filter size={18} /> Filters
            </button>
          </div>

          {/* Category Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    paddingTop: "1rem",
                  }}
                >
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        border:
                          selectedCategory === category.id
                            ? `2px solid ${category.color}`
                            : "2px solid #e2e8f0",
                        background:
                          selectedCategory === category.id
                            ? category.bgColor
                            : "white",
                        color:
                          selectedCategory === category.id
                            ? category.color
                            : "#64748b",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <span style={{ color: "#64748b" }}>
              Showing {filteredBooks.length} of {books.length} books
            </span>
            <Link
              to="/catalog"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#4f46e5",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Browse Available Books <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* My Reservations */}
        {reservedBooks.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: "2rem" }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#1e293b",
              }}
            >
              My Reservations ({reservedBooks.length})
            </h2>
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              {reservedBooks.map((reservation) => (
                <motion.div
                  key={reservation.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: 5 }}
                  style={{
                    padding: "1.5rem",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Bookmark size={24} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {reservation.title}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#64748b" }}>
                        Reserved: {reservation.reservedDate} • Position: #
                        {reservation.position}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#fff7ed",
                        color: "#f59e0b",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      }}
                    >
                      <Clock size={14} style={{ marginRight: "0.25rem" }} />
                      Waiting
                    </span>
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Books Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e293b",
              }}
            >
              Available for Reservation ({filteredBooks.length})
            </h2>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#8b5cf6",
              }}
            >
              <Sparkles size={20} />
              <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                Popular This Week
              </span>
            </motion.div>
          </div>

          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Search
                size={60}
                style={{ marginBottom: "1rem", opacity: 0.5, color: "#94a3b8" }}
              />
              <h3 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>
                No books found
              </h3>
              <p
                style={{
                  color: "#64748b",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredBooks.map((book, index) => {
                const isAlreadyReserved = reservedBooks.some(
                  (r) => r.bookId === book.id,
                );

                return (
                  <motion.div
                    key={book.id}
                    initial={{ y: 30, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    }}
                    style={{
                      background: "white",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Book Header */}
                    <div
                      style={{
                        height: "12px",
                        background: book.coverColor,
                      }}
                    />

                    <div style={{ padding: "1.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "1rem",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.25rem 0.75rem",
                              background: getCategoryBgColor(book.category),
                              color: getCategoryColor(book.category),
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              marginBottom: "0.75rem",
                            }}
                          >
                            {
                              categories.find((c) => c.id === book.category)
                                ?.name
                            }
                          </span>
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
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          {/* FIXED: Using StarRating component instead of single Star */}
                          <StarRating rating={book.rating} size={16} />
                          <span
                            style={{
                              fontWeight: "600",
                              color: "#1e293b",
                              marginLeft: "4px",
                            }}
                          >
                            {book.rating}
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          margin: "0 0 1rem 0",
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

                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          lineHeight: "1.5",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {book.description}
                      </p>

                      {/* Book Info */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          marginBottom: "1.5rem",
                          background: "#f8fafc",
                          padding: "1rem",
                          borderRadius: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Users size={16} style={{ color: "#64748b" }} />
                          <div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                            >
                              Waitlist
                            </div>
                            <div
                              style={{ fontWeight: "600", color: "#1e293b" }}
                            >
                              {book.waitlist} people
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <Calendar size={16} style={{ color: "#64748b" }} />
                          <div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                            >
                              Expected
                            </div>
                            <div
                              style={{ fontWeight: "600", color: "#1e293b" }}
                            >
                              {book.expectedDate}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              background: "#64748b",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "10px",
                            }}
                          >
                            #
                          </div>
                          <div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                            >
                              ISBN
                            </div>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#1e293b",
                                fontSize: "0.875rem",
                              }}
                            >
                              {book.isbn}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              background: "#64748b",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "10px",
                            }}
                          >
                            {book.totalCopies}
                          </div>
                          <div>
                            <div
                              style={{ fontSize: "0.75rem", color: "#94a3b8" }}
                            >
                              Total Copies
                            </div>
                            <div
                              style={{ fontWeight: "600", color: "#1e293b" }}
                            >
                              {book.totalCopies}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reserve Button */}
                      <motion.button
                        id={`reserve-btn-${book.id}`}
                        onClick={() => handleReserveBook(book.id)}
                        disabled={isAlreadyReserved}
                        whileHover={!isAlreadyReserved ? { scale: 1.03 } : {}}
                        whileTap={!isAlreadyReserved ? { scale: 0.97 } : {}}
                        style={{
                          width: "100%",
                          padding: "1rem",
                          background: isAlreadyReserved
                            ? "#10b981"
                            : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          cursor: isAlreadyReserved ? "default" : "pointer",
                          fontWeight: "600",
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          boxShadow: isAlreadyReserved
                            ? "none"
                            : "0 6px 20px rgba(79, 70, 229, 0.3)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {isAlreadyReserved ? (
                          <>
                            <CheckCircle size={18} /> Already Reserved
                          </>
                        ) : (
                          <>
                            <Bookmark size={18} /> Reserve This Book
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              style={{ marginLeft: "0.25rem" }}
                            >
                              →
                            </motion.span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: "3rem", textAlign: "center" }}
        >
          <Link
            to="/dashboard"
            style={{
              padding: "0.875rem 2rem",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              border: "2px solid #e2e8f0",
              background: "white",
              color: "#64748b",
              textDecoration: "none",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "#4f46e5";
              e.target.style.color = "#4f46e5";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.color = "#64748b";
            }}
          >
            ← Back to Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {reservedBooks.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
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
              borderLeft: "4px solid #10b981",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#d1fae5",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <Bookmark size={20} />
            </div>
            <div>
              <div style={{ fontWeight: "600", color: "#1e293b" }}>
                {reservedBooks.length} active reservation
                {reservedBooks.length > 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                You'll be notified when books become available
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReserveBook;
