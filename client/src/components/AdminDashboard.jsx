import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "5 books overdue", type: "warning", time: "2 hours ago" },
    {
      id: 2,
      message: "New member registered",
      type: "info",
      time: "4 hours ago",
    },
    {
      id: 3,
      message: "Weekly report generated",
      type: "success",
      time: "1 day ago",
    },
  ]);

  // Show action message
  const showActionMessage = (message) => {
    setActionMessage(message);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userType = localStorage.getItem("userType");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (userType !== "admin") {
      // If user is not admin, redirect them to user dashboard
      alert("You don't have admin privileges!");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const confirmLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      handleLogout();
    }
  };

  // Mock Data
  const [stats, setStats] = useState({
    totalBooks: 2456,
    borrowedBooks: 342,
    availableBooks: 2114,
    totalMembers: 856,
    pendingReturns: 28,
    revenue: 12540,
  });

  const [borrowRequests, setBorrowRequests] = useState([
    {
      id: 1,
      book: "The Catcher in the Rye",
      member: "John Smith",
      memberEmail: "john@example.com",
      requestDate: "2024-01-10",
      dueDate: "2024-01-24",
      status: "pending",
      bookImage: "📘",
      bookColor: "#3B82F6",
    },
    {
      id: 2,
      book: "To Kill a Mockingbird",
      member: "Sarah Johnson",
      memberEmail: "sarah@example.com",
      requestDate: "2024-01-09",
      dueDate: "2024-01-23",
      status: "pending",
      bookImage: "📕",
      bookColor: "#EF4444",
    },
    {
      id: 3,
      book: "The Great Gatsby",
      member: "Michael Chen",
      memberEmail: "michael@example.com",
      requestDate: "2024-01-08",
      dueDate: "2024-01-22",
      status: "approved",
      bookImage: "📗",
      bookColor: "#10B981",
    },
    {
      id: 4,
      book: "1984",
      member: "Emma Wilson",
      memberEmail: "emma@example.com",
      requestDate: "2024-01-07",
      dueDate: "2024-01-21",
      status: "pending",
      bookImage: "📓",
      bookColor: "#8B5CF6",
    },
    {
      id: 5,
      book: "Pride and Prejudice",
      member: "David Brown",
      memberEmail: "david@example.com",
      requestDate: "2024-01-06",
      dueDate: "2024-01-20",
      status: "rejected",
      bookImage: "📙",
      bookColor: "#F59E0B",
    },
  ]);

  // Chart Data
  const monthlyBorrowData = [
    { month: "Jan", borrows: 120, returns: 115 },
    { month: "Feb", borrows: 135, returns: 130 },
    { month: "Mar", borrows: 150, returns: 145 },
    { month: "Apr", borrows: 165, returns: 160 },
    { month: "May", borrows: 180, returns: 175 },
    { month: "Jun", borrows: 200, returns: 195 },
  ];

  const categoryDistribution = [
    { name: "Fiction", value: 35, color: "#667eea" },
    { name: "Non-Fiction", value: 25, color: "#764ba2" },
    { name: "Science", value: 15, color: "#f093fb" },
    { name: "Technology", value: 12, color: "#f5576c" },
    { name: "Biography", value: 8, color: "#4facfe" },
  ];

  // Navigation items
  const navItems = [
    { id: "overview", icon: "📊", text: "Overview" },
    {
      id: "books",
      icon: "📚",
      text: "Books Management",
      path: "/admin/book-management",
    },
    {
      id: "members",
      icon: "👥",
      text: "User Management",
      path: "/admin/user-management",
    },
    {
      id: "transactions",
      icon: "🔄",
      text: "Issue/Return Management",
      path: "/admin/issue-return",
    },
    {
      id: "requests",
      icon: "📋",
      text: "Requests",
      badge: borrowRequests.filter((r) => r.status === "pending").length,
    },
    { id: "reports", icon: "📈", text: "Reports", path: "/admin/reports" },
    { id: "settings", icon: "⚙️", text: "Settings" },
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveTab(item.id);
    }
  };

  // Request handlers
  const handleApproveRequest = (requestId) => {
    setBorrowRequests((requests) =>
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req,
      ),
    );
    showActionMessage(`Request #${requestId} approved successfully!`);
  };

  const handleRejectRequest = (requestId) => {
    setBorrowRequests((requests) =>
      requests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req,
      ),
    );
    showActionMessage(`Request #${requestId} rejected.`);
  };

  const handleViewRequestDetails = (requestId) => {
    showActionMessage(`Viewing details for request #${requestId}`);
  };

  // Settings handlers
  const handleConfigureSystem = () => {
    showActionMessage("System configuration panel opened!");
  };

  const handleManagePermissions = () => {
    showActionMessage("Opening user permissions management...");
  };

  const handleBackupNow = () => {
    showActionMessage("Backup process started...");
  };

  const handleClearCache = () => {
    showActionMessage("System cache cleared successfully!");
  };

  const handleUpdateSettings = () => {
    showActionMessage("Settings updated successfully!");
  };

  const handleTestEmail = () => {
    showActionMessage("Test email sent successfully!");
  };

  const handleGenerateReport = () => {
    showActionMessage("Report generation started...");
  };

  return (
    <div className="admin-dashboard">
      <style jsx="true">{`
        .admin-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }

        /* Header Styles */
        .admin-header {
          background: white;
          padding: 0 30px;
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          font-size: 24px;
        }

        .logo h1 {
          font-size: 22px;
          font-weight: 600;
          color: #334155;
        }

        .admin-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }

        .search-bar {
          position: relative;
          width: 300px;
        }

        .search-bar input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #94a3b8;
          background: white;
        }

        .search-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #64748b;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 16px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #f8fafc;
        }

        .notification-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .profile-info h4 {
          margin: 0;
          font-size: 14px;
          color: #1e293b;
        }

        .profile-info p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .logout-btn {
          padding: 8px 16px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Action Message */
        .action-message {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          color: #065f46;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #a7f3d0;
          background: #ecfdf5;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          font-size: 14px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Main Layout */
        .dashboard-main {
          display: flex;
          min-height: calc(100vh - 70px);
        }

        /* Sidebar Styles */
        .admin-sidebar {
          width: 240px;
          background: white;
          padding: 20px 0;
          border-right: 1px solid #e2e8f0;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 15px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border: none;
          background: none;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          font-size: 14px;
          color: #475569;
        }

        .nav-btn:hover {
          background: #f8fafc;
        }

        .nav-btn.active {
          background: #f1f5f9;
          color: #1e293b;
          font-weight: 500;
        }

        .nav-icon {
          font-size: 18px;
        }

        .nav-text {
          font-size: 14px;
          font-weight: inherit;
        }

        .pending-badge {
          position: absolute;
          right: 15px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 20px 15px 0;
          border-top: 1px solid #e2e8f0;
        }

        .system-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 13px;
          color: #64748b;
        }

        .status-indicator {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          background: #dcfce7;
          color: #166534;
        }

        .version {
          color: #94a3b8;
          font-size: 12px;
          text-align: center;
        }

        /* Content Area */
        .admin-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .content-header h2 {
          margin: 0;
          color: #1e293b;
          font-size: 24px;
          font-weight: 600;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .stat-card:hover {
          border-color: #cbd5e1;
        }

        .stat-icon {
          font-size: 28px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f8fafc;
          color: #475569;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 28px;
          color: #1e293b;
          font-weight: 600;
        }

        .stat-info p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .stat-trend {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
          display: inline-block;
        }

        .stat-trend.up {
          background: #f0fdf4;
          color: #166534;
        }

        .stat-trend.down {
          background: #fef2f2;
          color: #991b1b;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .chart-card h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
        }

        .chart-container {
          height: 280px;
        }

        /* =============================== */
        /* REQUESTS SECTION */
        /* =============================== */
        .requests-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Request Stats with Light Color Backgrounds */
        .request-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .stat-item {
          flex: 1;
          text-align: center;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 4px 4px 0 0;
        }

        .stat-item:nth-child(1) {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid #fbbf24;
        }

        .stat-item:nth-child(1)::before {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
        }

        .stat-item:nth-child(2) {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #34d399;
        }

        .stat-item:nth-child(2)::before {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .stat-item:nth-child(3) {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid #f87171;
        }

        .stat-item:nth-child(3)::before {
          background: linear-gradient(90deg, #ef4444, #f87171);
        }

        .stat-item:nth-child(4) {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #60a5fa;
        }

        .stat-item:nth-child(4)::before {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-item:nth-child(1) .stat-value {
          color: #92400e;
        }

        .stat-item:nth-child(2) .stat-value {
          color: #065f46;
        }

        .stat-item:nth-child(3) .stat-value {
          color: #991b1b;
        }

        .stat-item:nth-child(4) .stat-value {
          color: #1e40af;
        }

        .stat-label {
          font-size: 14px;
          color: #475569;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .stat-label::before {
          font-size: 16px;
        }

        .stat-item:nth-child(1) .stat-label::before {
          content: "⏳";
        }

        .stat-item:nth-child(2) .stat-label::before {
          content: "✅";
        }

        .stat-item:nth-child(3) .stat-label::before {
          content: "❌";
        }

        .stat-item:nth-child(4) .stat-label::before {
          content: "📊";
        }

        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .request-item {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .request-item:hover {
          border-color: #cbd5e1;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .request-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(
            135deg,
            var(--book-color, #667eea),
            #94a3b8
          );
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .request-book {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .book-icon {
          font-size: 28px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            var(--book-color, #667eea) 0%,
            var(--book-color-light, #94a3b8) 100%
          );
          color: white;
          box-shadow: 0 4px 12px rgba(var(--book-color-rgb, 102, 126, 234), 0.2);
        }

        .book-info h4 {
          margin: 0 0 6px 0;
          font-size: 18px;
          color: #1e293b;
          font-weight: 600;
        }

        .book-info p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }

        .request-status {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 14px;
        }

        .status-pending {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 1px solid #fbbf24;
        }

        .status-approved {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border: 1px solid #34d399;
        }

        .status-rejected {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          border: 1px solid #f87171;
        }

        .request-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .detail-value {
          font-size: 15px;
          color: #1e293b;
          font-weight: 500;
        }

        .request-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-btn.approve {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          color: white;
          border: none;
        }

        .action-btn.approve:hover {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        }

        .action-btn.reject {
          background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
          color: white;
          border: none;
        }

        .action-btn.reject:hover {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        }

        .action-btn.details {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
        }

        .action-btn.details:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
        }

        /* =============================== */
        /* SETTINGS SECTION */
        /* =============================== */
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          margin-top: 30px;
        }

        .setting-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          border: 1px solid #e2e8f0;
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .setting-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: transparent;
        }

        .setting-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            var(--card-color, #667eea),
            var(--card-color-light, #94a3b8)
          );
        }

        .setting-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .setting-icon {
          font-size: 32px;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            var(--card-bg, #e0f2fe) 0%,
            var(--card-bg-light, #f0f9ff) 100%
          );
          color: var(--card-color, #0ea5e9);
          box-shadow: 0 8px 20px rgba(var(--card-color-rgb, 14, 165, 233), 0.15);
        }

        .setting-info h4 {
          margin: 0 0 8px 0;
          font-size: 20px;
          color: #1e293b;
          font-weight: 600;
        }

        .setting-info p {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }

        .setting-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            var(--card-color, #667eea) 0%,
            var(--card-color-light, #94a3b8) 100%
          );
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-size: 14px;
        }

        .setting-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(var(--card-color-rgb, 102, 126, 234), 0.3);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          margin-top: 20px;
        }

        .empty-state .icon {
          font-size: 64px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          color: #1e293b;
          margin-bottom: 12px;
          font-weight: 600;
          font-size: 24px;
        }

        .empty-state p {
          color: #64748b;
          font-size: 16px;
        }

        /* Footer */
        .dashboard-footer {
          background: white;
          padding: 20px 30px;
          border-top: 1px solid #e2e8f0;
          margin-top: 30px;
        }

        .quick-stats {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }

        .quick-stat {
          text-align: center;
          padding: 10px;
          min-width: 150px;
        }

        .quick-stat span {
          display: block;
          color: #64748b;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .quick-stat strong {
          font-size: 20px;
          color: #1e293b;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }

          .settings-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            height: auto;
            padding: 15px;
            gap: 15px;
          }

          .header-left,
          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .search-bar {
            width: 100%;
          }

          .dashboard-main {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }

          .admin-content {
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .request-stats {
            flex-direction: column;
            gap: 15px;
          }

          .request-details {
            grid-template-columns: 1fr;
          }

          .request-actions {
            flex-direction: column;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .quick-stats {
            gap: 15px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h1>Library Admin</h1>
            <span className="admin-badge">ADMIN</span>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" type="button">
              🔍
            </button>
          </div>
        </div>

        <div className="header-right">
          <button className="icon-btn notification-btn" type="button">
            <span>🔔</span>
            {notifications.length > 0 && (
              <span className="notification-count">{notifications.length}</span>
            )}
          </button>

          <div className="admin-profile">
            <div className="profile-avatar">
              <span>AD</span>
            </div>
            <div className="profile-info">
              <h4>Admin User</h4>
              <p>Super Administrator</p>
            </div>
          </div>

          <button className="logout-btn" onClick={confirmLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      {/* Action Message */}
      {showMessage && <div className="action-message">✅ {actionMessage}</div>}

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => handleNavigation(item)}
                type="button"
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.text}</span>
                {item.badge && item.badge > 0 && (
                  <span className="pending-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="system-info">
              <p>System Status</p>
              <div className="status-indicator">Online</div>
            </div>
            <p className="version">v2.1.4</p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-content">
          {activeTab === "overview" && (
            <div className="overview-content">
              <div className="content-header">
                <h2>Dashboard Overview</h2>
                <div className="date-filter">
                  <select
                    defaultValue="monthly"
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      background: "white",
                      fontSize: "14px",
                      color: "#475569",
                    }}
                  >
                    <option value="daily">Today</option>
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                    <option value="yearly">This Year</option>
                  </select>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>{stats.totalBooks.toLocaleString()}</h3>
                    <p>Total Books</p>
                    <div className="stat-trend up">+12%</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalMembers.toLocaleString()}</h3>
                    <p>Total Members</p>
                    <div className="stat-trend up">+8%</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📖</div>
                  <div className="stat-info">
                    <h3>{stats.borrowedBooks.toLocaleString()}</h3>
                    <p>Currently Borrowed</p>
                    <div className="stat-trend up">+5%</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⚠️</div>
                  <div className="stat-info">
                    <h3>{stats.pendingReturns}</h3>
                    <p>Pending Returns</p>
                    <div className="stat-trend down">-3%</div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Monthly Borrows & Returns</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={monthlyBorrowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="borrows"
                          stroke="#475569"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="returns"
                          stroke="#94a3b8"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Category Distribution</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="requests-management">
              <div className="content-header">
                <h2>📋 Borrow Requests</h2>
              </div>

              <div className="requests-container">
                {/* Request Stats with Beautiful Light Color Backgrounds */}
                <div className="request-stats">
                  <div className="stat-item">
                    <span className="stat-value">
                      {
                        borrowRequests.filter((r) => r.status === "pending")
                          .length
                      }
                    </span>
                    <span className="stat-label">Pending Requests</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {
                        borrowRequests.filter((r) => r.status === "approved")
                          .length
                      }
                    </span>
                    <span className="stat-label">Approved</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {
                        borrowRequests.filter((r) => r.status === "rejected")
                          .length
                      }
                    </span>
                    <span className="stat-label">Rejected</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{borrowRequests.length}</span>
                    <span className="stat-label">Total Requests</span>
                  </div>
                </div>

                <div className="requests-list">
                  {borrowRequests.map((request) => (
                    <div
                      key={request.id}
                      className="request-item"
                      style={{
                        "--book-color": request.bookColor,
                        "--book-color-light": `${request.bookColor}80`,
                        "--book-color-rgb": request.bookColor
                          .replace("#", "")
                          .match(/.{2}/g)
                          ?.map((x) => parseInt(x, 16))
                          .join(", "),
                      }}
                    >
                      <div className="request-header">
                        <div className="request-book">
                          <div className="book-icon">{request.bookImage}</div>
                          <div className="book-info">
                            <h4>{request.book}</h4>
                            <p>
                              {request.member} • {request.memberEmail}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`request-status status-${request.status}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </div>
                      </div>

                      <div className="request-details">
                        <div className="detail-item">
                          <span className="detail-label">Request Date</span>
                          <span className="detail-value">
                            {request.requestDate}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Due Date</span>
                          <span className="detail-value">
                            {request.dueDate}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Request ID</span>
                          <span className="detail-value">#{request.id}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">Borrow Request</span>
                        </div>
                      </div>

                      <div className="request-actions">
                        {request.status === "pending" && (
                          <>
                            <button
                              className="action-btn approve"
                              onClick={() => handleApproveRequest(request.id)}
                              type="button"
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="action-btn reject"
                              onClick={() => handleRejectRequest(request.id)}
                              type="button"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        <button
                          className="action-btn details"
                          onClick={() => handleViewRequestDetails(request.id)}
                          type="button"
                        >
                          👁️ View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {borrowRequests.length === 0 && (
                  <div className="empty-state">
                    <div className="icon">📋</div>
                    <h3>No Requests Found</h3>
                    <p>All requests have been processed</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-management">
              <div className="content-header">
                <h2>⚙️ System Settings</h2>
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Configure your library management system
                </p>
              </div>

              <div className="settings-grid">
                {/* System Configuration */}
                <div
                  className="setting-card"
                  style={{
                    "--card-color": "#0ea5e9",
                    "--card-color-light": "#38bdf8",
                    "--card-bg": "#e0f2fe",
                    "--card-bg-light": "#f0f9ff",
                    "--card-color-rgb": "14, 165, 233",
                  }}
                >
                  <div className="setting-header">
                    <div className="setting-icon">⚙️</div>
                    <div className="setting-info">
                      <h4>System Configuration</h4>
                      <p>
                        Configure library hours, borrowing limits, fine rates,
                        and general system settings
                      </p>
                    </div>
                  </div>
                  <button
                    className="setting-btn"
                    onClick={handleConfigureSystem}
                  >
                    Configure Settings
                  </button>
                </div>

                {/* User Permissions */}
                <div
                  className="setting-card"
                  style={{
                    "--card-color": "#8b5cf6",
                    "--card-color-light": "#a78bfa",
                    "--card-bg": "#f5f3ff",
                    "--card-bg-light": "#faf5ff",
                    "--card-color-rgb": "139, 92, 246",
                  }}
                >
                  <div className="setting-header">
                    <div className="setting-icon">🔐</div>
                    <div className="setting-info">
                      <h4>User Permissions</h4>
                      <p>
                        Manage admin and staff permissions, role-based access
                        controls, and user privileges
                      </p>
                    </div>
                  </div>
                  <button
                    className="setting-btn"
                    onClick={handleManagePermissions}
                  >
                    Manage Permissions
                  </button>
                </div>

                {/* Backup & Restore */}
                <div
                  className="setting-card"
                  style={{
                    "--card-color": "#f59e0b",
                    "--card-color-light": "#fbbf24",
                    "--card-bg": "#fef3c7",
                    "--card-bg-light": "#fffbeb",
                    "--card-color-rgb": "245, 158, 11",
                  }}
                >
                  <div className="setting-header">
                    <div className="setting-icon">💾</div>
                    <div className="setting-info">
                      <h4>Backup & Restore</h4>
                      <p>
                        Create system backups, restore from previous backups,
                        and manage backup schedules
                      </p>
                    </div>
                  </div>
                  <button className="setting-btn" onClick={handleBackupNow}>
                    Backup Now
                  </button>
                </div>

                {/* Clear Cache */}
                <div
                  className="setting-card"
                  style={{
                    "--card-color": "#10b981",
                    "--card-color-light": "#34d399",
                    "--card-bg": "#d1fae5",
                    "--card-bg-light": "#ecfdf5",
                    "--card-color-rgb": "16, 185, 129",
                  }}
                >
                  <div className="setting-header">
                    <div className="setting-icon">🧹</div>
                    <div className="setting-info">
                      <h4>Clear Cache</h4>
                      <p>
                        Clear system cache, temporary files, and optimize
                        database performance
                      </p>
                    </div>
                  </div>
                  <button className="setting-btn" onClick={handleClearCache}>
                    Clear Cache
                  </button>
                </div>

                {/* Email Settings */}
                <div
                  className="setting-card"
                  style={{
                    "--card-color": "#ef4444",
                    "--card-color-light": "#f87171",
                    "--card-bg": "#fee2e2",
                    "--card-bg-light": "#fef2f2",
                    "--card-color-rgb": "239, 68, 68",
                  }}
                >
                  <div className="setting-header">
                    <div className="setting-icon">📧</div>
                    <div className="setting-info">
                      <h4>Email Settings</h4>
                      <p>
                        Configure email notifications, SMTP settings, and email
                        templates for users
                      </p>
                    </div>
                  </div>
                  <button className="setting-btn" onClick={handleTestEmail}>
                    Test Email
                  </button>
                </div>

                {/* Update Settings */}
                <div
                  className="setting-card"
                  style={{
                    "--card-color": "#6366f1",
                    "--card-color-light": "#818cf8",
                    "--card-bg": "#e0e7ff",
                    "--card-bg-light": "#eef2ff",
                    "--card-color-rgb": "99, 102, 241",
                  }}
                >
                  <div className="setting-header">
                    <div className="setting-icon">🔄</div>
                    <div className="setting-info">
                      <h4>Update Settings</h4>
                      <p>
                        Save all configuration changes and apply updates to the
                        system settings
                      </p>
                    </div>
                  </div>
                  <button
                    className="setting-btn"
                    onClick={handleUpdateSettings}
                  >
                    Update All
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick Stats Footer */}
      <footer className="dashboard-footer">
        <div className="quick-stats">
          <div className="quick-stat">
            <span>Books Today</span>
            <strong>12</strong>
          </div>
          <div className="quick-stat">
            <span>New Members</span>
            <strong>5</strong>
          </div>
          <div className="quick-stat">
            <span>Pending</span>
            <strong>8</strong>
          </div>
          <div className="quick-stat">
            <span>Uptime</span>
            <strong>99.8%</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
