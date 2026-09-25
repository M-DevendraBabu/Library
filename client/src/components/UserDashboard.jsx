import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BookMarked,
  BarChart2,
  Bell,
  LogOut,
  Clock,
  Star,
  Menu,
  Bookmark,
  BookOpen,
  User,
  Calendar,
  Home,
  Settings,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Eye,
  Download,
  Users,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Zap,
  Target,
  Flame,
  Coffee,
  BookText,
  Brain,
  HelpCircle,
} from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add authentication check at the beginning
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userType = localStorage.getItem("userType");
      const isAdmin = localStorage.getItem("isAdmin");

      // If not logged in, redirect to login
      if (!isLoggedIn || isLoggedIn !== "true") {
        navigate("/login");
        return;
      }

      // If admin tries to access user dashboard, redirect to admin dashboard
      if (isAdmin === "true" || userType === "admin") {
        navigate("/admin-dashboard");
        return;
      }

      // Set authentication state
      setIsAuthenticated(true);

      // Get active tab from URL
      const path = location.pathname;
      const tabMap = {
        "/dashboard": "dashboard",
        "/catalog": "catalog",
        "/my-books": "my-books",
        "/reserve": "reserve",
        "/recommendations": "recommendations",
        "/notifications": "notifications",
        "/profile": "profile",
        "/book-details": "book-details",
        "/support": "support",
      };

      const tab = tabMap[path] || "dashboard";
      setActiveTab(tab);

      // Set user data
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // Ensure role is "user" for students
          if (userData.role === "student") {
            userData.role = "user";
          }
          setUserData(userData);
        } catch (error) {
          // If parsing fails, set default user data
          setUserData({
            name: "John Student",
            email: "student@college.edu",
            studentId: "STU2024001",
            avatarColor: "#8b5cf6",
            role: "user",
          });
        }
      } else {
        // Set default user data if not found
        setUserData({
          name: "John Student",
          email: "student@college.edu",
          studentId: "STU2024001",
          avatarColor: "#8b5cf6",
          role: "user",
        });
      }
    };

    checkAuth();
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
      gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    },
    {
      id: "catalog",
      label: "Book Catalog",
      icon: <Search size={20} />,
      path: "/catalog",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
    },
    {
      id: "book-details",
      label: "Book Details",
      icon: <BookOpen size={20} />,
      path: "/book-details",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      id: "reserve",
      label: "Reserve Book",
      icon: <Bookmark size={20} />,
      path: "/reserve",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      id: "my-books",
      label: "My Books",
      icon: <BookMarked size={20} />,
      path: "/my-books",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    },
    {
      id: "recommendations",
      label: "AI Recommendations",
      icon: <Brain size={20} />,
      path: "/recommendations",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      path: "/notifications",
      gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User size={20} />,
      path: "/profile",
      gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    },
    {
      id: "support",
      label: "Help & Support",
      icon: <HelpCircle size={20} />,
      path: "/support",
      gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    },
  ];

  // Dashboard Home Content with enhanced cards
  const renderDashboardHome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ position: "relative", zIndex: 2 }}
    >
      {/* Animated Particles Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {[...Array(15)].map((_, i) => (
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
              width: "40px",
              height: "40px",
              opacity: 0.1,
              background: `linear-gradient(45deg, #${Math.floor(Math.random() * 16777215).toString(16)} 0%, #${Math.floor(Math.random() * 16777215).toString(16)} 100%)`,
              borderRadius: "10px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          marginBottom: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Sparkles size={24} />
          </motion.div>
          <div>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.25rem",
              }}
            >
              Welcome back, {userData?.name?.split(" ")[0] || "Student"}! 👋
            </h2>
            <span
              style={{
                color: "#64748b",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Coffee size={16} />
              Here's your library overview
            </span>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Issued Books Card */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          onHoverStart={() => setHoveredCard("issued")}
          onHoverEnd={() => setHoveredCard(null)}
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            padding: "1.5rem",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Animated background */}
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
                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(139, 92, 246, 0.2)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8b5cf6",
                    }}
                  >
                    <BookMarked size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                      Issued Books
                    </div>
                    <div
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        lineHeight: 1,
                      }}
                    >
                      3
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    opacity: 0.8,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <ArrowRight size={14} />
                  Currently reading
                </div>
              </div>
              <motion.div
                animate={{ rotate: hoveredCard === "issued" ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Eye size={20} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Overdue Card */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          onHoverStart={() => setHoveredCard("overdue")}
          onHoverEnd={() => setHoveredCard(null)}
          style={{
            background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
            padding: "1.5rem",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(239, 68, 68, 0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "200%",
              height: "200%",
              background:
                "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(239, 68, 68, 0.2)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ef4444",
                    }}
                  >
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                      Overdue Books
                    </div>
                    <div
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        lineHeight: 1,
                      }}
                    >
                      1
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    opacity: 0.8,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <Clock size={14} />
                  Needs attention
                </div>
              </div>
              <motion.div
                animate={{
                  scale: hoveredCard === "overdue" ? [1, 1.2, 1] : 1,
                  rotate: hoveredCard === "overdue" ? [0, 10, -10, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Flame size={20} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Reading Points Card */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          onHoverStart={() => setHoveredCard("points")}
          onHoverEnd={() => setHoveredCard(null)}
          style={{
            background: "linear-gradient(135deg, #065f46 0%, #047857 100%)",
            padding: "1.5rem",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(16, 185, 129, 0.2)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#10b981",
                    }}
                  >
                    <Star size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                      Reading Points
                    </div>
                    <div
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        lineHeight: 1,
                      }}
                    >
                      450
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    opacity: 0.8,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <TrendingUp size={14} />
                  +25 this week
                </div>
              </div>
              <motion.div
                animate={{
                  y: hoveredCard === "points" ? [0, -5, 0] : 0,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={20} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Reservations Card */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          onHoverStart={() => setHoveredCard("reservations")}
          onHoverEnd={() => setHoveredCard(null)}
          style={{
            background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
            padding: "1.5rem",
            borderRadius: "20px",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(79, 70, 229, 0.2)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
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
                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
              zIndex: 1,
            }}
          />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(79, 70, 229, 0.2)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5",
                    }}
                  >
                    <Bookmark size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                      Active Reservations
                    </div>
                    <div
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        lineHeight: 1,
                      }}
                    >
                      2
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    opacity: 0.8,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                  }}
                >
                  <Target size={14} />
                  In queue
                </div>
              </div>
              <motion.div
                animate={{
                  rotate: hoveredCard === "reservations" ? [0, 180, 360] : 0,
                }}
                transition={{ duration: 1 }}
                style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={20} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Due Soon Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          border: "1px solid rgba(226, 232, 240, 0.6)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            padding: "1.5rem 2rem",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Clock size={20} />
          </div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Due Soon
          </h3>
        </div>

        <div style={{ padding: "1.5rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Book Title
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Due Date
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  title:
                    "Clean Code: A Handbook of Agile Software Craftsmanship",
                  dueDate: "2024-02-15",
                  status: "active",
                  statusColor: "#10b981",
                  statusBg: "#d1fae5",
                },
                {
                  title: "Introduction to Algorithms",
                  dueDate: "2024-02-11",
                  status: "overdue",
                  statusColor: "#ef4444",
                  statusBg: "#fee2e2",
                },
              ].map((book, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                  }}
                >
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background:
                            "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                        }}
                      >
                        <BookText size={16} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#1e293b",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {book.title}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                          Various Authors
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Calendar size={16} color="#64748b" />
                      <span style={{ fontWeight: "600", color: "#1e293b" }}>
                        {book.dueDate}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <span
                      style={{
                        padding: "0.5rem 1rem",
                        background: book.statusBg,
                        color: book.statusColor,
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {book.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "0.5rem 1.25rem",
                        background:
                          book.status === "active"
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {book.status === "active" ? (
                        <>
                          <RefreshCw size={14} />
                          Renew
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} />
                          Return
                        </>
                      )}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );

  // Book Details Page
  const renderBookDetails = () => (
    <div style={{ maxWidth: "800px" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
        }}
      >
        Book Details
      </h2>
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        }}
      >
        <p>
          Book details will be shown here when you click on a book from the
          catalog.
        </p>
      </div>
    </div>
  );

  // AI Recommendations Page
  const renderRecommendations = () => (
    <div
      style={{
        textAlign: "center",
        padding: "4rem",
        color: "#64748b",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      }}
    >
      <Brain size={60} style={{ marginBottom: "1rem", opacity: 0.5 }} />
      <h2
        style={{
          marginBottom: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        AI Book Recommendations
      </h2>
      <p>Personalized book suggestions based on your reading history.</p>
      <Link
        to="/recommendations"
        style={{
          marginTop: "1.5rem",
          padding: "0.875rem 2rem",
          background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
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
        Go to Recommendations <ChevronRight size={16} />
      </Link>
    </div>
  );

  // Notifications Page
  const renderNotifications = () => (
    <div
      style={{
        textAlign: "center",
        padding: "4rem",
        color: "#64748b",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      }}
    >
      <Bell size={60} style={{ marginBottom: "1rem", opacity: 0.5 }} />
      <h2
        style={{
          marginBottom: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        Notifications
      </h2>
      <p>System alerts and due date reminders will appear here.</p>
      <Link
        to="/notifications"
        style={{
          marginTop: "1.5rem",
          padding: "0.875rem 2rem",
          background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
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
        Go to Notifications <ChevronRight size={16} />
      </Link>
    </div>
  );

  // Profile Page - Updated to navigate to actual Profile page
  const renderProfile = () => (
    <div
      style={{
        textAlign: "center",
        padding: "4rem",
        color: "#64748b",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      }}
    >
      <User size={60} style={{ marginBottom: "1rem", opacity: 0.5 }} />
      <h2
        style={{
          marginBottom: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        Profile
      </h2>
      <p>Manage your account settings and personal information.</p>
      <Link
        to="/profile"
        style={{
          marginTop: "1.5rem",
          padding: "0.875rem 2rem",
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
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
        Go to Profile <ChevronRight size={16} />
      </Link>
    </div>
  );

  // Help & Support Page
  const renderSupport = () => (
    <div
      style={{
        textAlign: "center",
        padding: "4rem",
        color: "#64748b",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
      }}
    >
      <HelpCircle size={60} style={{ marginBottom: "1rem", opacity: 0.5 }} />
      <h2
        style={{
          marginBottom: "0.5rem",
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#1e293b",
        }}
      >
        Help & Support
      </h2>
      <p>Get help, submit tickets, or contact our support team.</p>
      <Link
        to="/support"
        style={{
          marginTop: "1.5rem",
          padding: "0.875rem 2rem",
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
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
        Go to Support <ChevronRight size={16} />
      </Link>
    </div>
  );

  // Render loading state if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #4f46e5",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        position: "relative",
      }}
    >
      {/* Global Background Animations */}
      <div
        style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* FIXED SIDEBAR: Always visible on desktop, toggleable on mobile */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{
          width: "280px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          padding: "2rem 1.5rem",
          color: "white",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 100,
          boxShadow: "10px 0 30px rgba(0,0,0,0.1)",
          display: mobileMenuOpen ? "block" : { xs: "none", md: "block" },
        }}
      >
        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            padding: "1.5rem",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "20px",
            marginBottom: "2rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              style={{
                width: "60px",
                height: "60px",
                background: `linear-gradient(135deg, ${userData?.avatarColor || "#4f46e5"} 0%, ${userData?.avatarColor || "#7c3aed"}80 100%)`,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: "700",
              }}
            >
              {userData?.name?.charAt(0) || "U"}
            </motion.div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                {userData?.name || "Student"}
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                {userData?.studentId || "STU0001"}
              </div>
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
            {userData?.email || "user@example.com"}
          </div>
        </motion.div>

        <nav
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ x: 10 }}
              style={{
                background:
                  activeTab === item.id ? item.gradient : "transparent",
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "0.95rem",
                fontWeight: "500",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
                if (item.path && item.path !== "#") {
                  navigate(item.path);
                }
              }}
            >
              <motion.div
                animate={{ rotate: activeTab === item.id ? [0, 360] : 0 }}
                transition={{ duration: 0.5 }}
              >
                {item.icon}
              </motion.div>
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: "absolute",
                    right: "1rem",
                    width: "6px",
                    height: "6px",
                    background: "white",
                    borderRadius: "50%",
                  }}
                />
              )}
            </motion.div>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <motion.div
            whileHover={{ x: 10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
              fontWeight: "600",
              color: "white",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <LogOut size={20} />
            </motion.div>
            Logout
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "2rem 3rem",
          position: "relative",
          zIndex: 1,
          overflowY: "auto",
          maxHeight: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header - Removed logout button from header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid rgba(226, 232, 240, 0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Mobile menu button in header */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <Menu size={24} color="#64748b" />
            </button>
            <div>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  textTransform: "capitalize",
                  background:
                    "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.25rem",
                }}
              >
                {activeTab.replace("-", " ")}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#64748b",
                }}
              >
                <Home size={16} />
                <span style={{ fontSize: "0.875rem" }}>Dashboard</span>
                <ChevronRight size={14} />
                <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                  {activeTab.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Notification Bell with Indicator */}
            <div
              style={{
                position: "relative",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                setActiveTab("notifications");
                navigate("/notifications");
              }}
              title="Notifications"
            >
              <Bell size={20} color="#64748b" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                  background: "#ef4444",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* User Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                width: "44px",
                height: "44px",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                fontSize: "1.125rem",
                fontWeight: "600",
              }}
              onClick={() => {
                setActiveTab("profile");
                navigate("/profile");
              }}
            >
              {userData?.name?.charAt(0) || "U"}
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && renderDashboardHome()}
            {activeTab === "catalog" && (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "#64748b",
                  background: "white",
                  borderRadius: "24px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                }}
              >
                <Search
                  size={60}
                  style={{ marginBottom: "1rem", opacity: 0.5 }}
                />
                <h2
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  Book Catalog
                </h2>
                <p>Redirecting to Book Catalog page...</p>
                <Link
                  to="/catalog"
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.875rem 2rem",
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
                  Go to Catalog <ChevronRight size={16} />
                </Link>
              </div>
            )}
            {activeTab === "my-books" && (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "#64748b",
                  background: "white",
                  borderRadius: "24px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                }}
              >
                <BookMarked
                  size={60}
                  style={{ marginBottom: "1rem", opacity: 0.5 }}
                />
                <h2
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  My Issued Books
                </h2>
                <p>Redirecting to My Books page...</p>
                <Link
                  to="/my-books"
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.875rem 2rem",
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
                  Go to My Books <ChevronRight size={16} />
                </Link>
              </div>
            )}
            {activeTab === "reserve" && (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "#64748b",
                  background: "white",
                  borderRadius: "24px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
                }}
              >
                <Bookmark
                  size={60}
                  style={{ marginBottom: "1rem", opacity: 0.5 }}
                />
                <h2
                  style={{
                    marginBottom: "0.5rem",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1e293b",
                  }}
                >
                  Reserve Book
                </h2>
                <p>Redirecting to Reserve Book page...</p>
                <Link
                  to="/reserve"
                  style={{
                    marginTop: "1.5rem",
                    padding: "0.875rem 2rem",
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
                  Go to Reserve <ChevronRight size={16} />
                </Link>
              </div>
            )}
            {activeTab === "book-details" && renderBookDetails()}
            {activeTab === "recommendations" && renderRecommendations()}
            {activeTab === "notifications" && renderNotifications()}
            {activeTab === "profile" && renderProfile()}
            {activeTab === "support" && renderSupport()}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default UserDashboard;
