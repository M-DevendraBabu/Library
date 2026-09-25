import React, { useState, useEffect } from "react";
import { notificationsAPI } from "../services/api";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sidebarAnimation, setSidebarAnimation] = useState("");

  const sampleNotifications = [
    {
      id: 1,
      title: "Book Due Tomorrow: The Great Gatsby",
      message:
        "Your copy of 'The Great Gatsby' by F. Scott Fitzgerald is due tomorrow. Please return or renew it online to avoid late fees of $1 per day.",
      type: "due_date",
      read: false,
      time: "2 hours ago",
      date: "2024-01-15",
      dueDate: "2024-01-16",
      priority: "high",
      category: "borrowing",
      bookCover: "📗",
      actionRequired: true,
      relatedId: "BK-00123",
      color: "#3B82F6",
    },
    {
      id: 2,
      title: "Reservation Confirmed: To Kill a Mockingbird",
      message:
        "Your reservation for 'To Kill a Mockingbird' has been confirmed! The book is now available for pickup at the main desk. Please collect within 3 days.",
      type: "reservation",
      read: true,
      time: "1 day ago",
      date: "2024-01-14",
      priority: "medium",
      category: "reservation",
      bookCover: "📘",
      actionRequired: false,
      relatedId: "RSV-00456",
      color: "#8B5CF6",
    },
    {
      id: 3,
      title: "New Sci-Fi Collection Available",
      message:
        "15 new science fiction titles including the latest from Neal Stephenson and Martha Wells have been added to our digital collection. Available for immediate download.",
      type: "new_arrival",
      read: false,
      time: "3 days ago",
      date: "2024-01-12",
      priority: "low",
      category: "collection",
      bookCover: "📚",
      actionRequired: false,
      relatedId: "NEW-00789",
      color: "#10B981",
    },
    {
      id: 4,
      title: "Late Fee Added to Your Account",
      message:
        "A late fee of $2.50 has been added to your account for '1984' by George Orwell. Total balance due: $2.50. Please settle your account to continue borrowing.",
      type: "fine",
      read: false,
      time: "1 week ago",
      date: "2024-01-08",
      amount: "$2.50",
      priority: "high",
      category: "account",
      bookCover: "💰",
      actionRequired: true,
      relatedId: "FINE-00112",
      color: "#EF4444",
    },
    {
      id: 5,
      title: "Library Membership Renewal Due",
      message:
        "Your premium library membership expires in 7 days. Renew now to continue enjoying unlimited access to physical books, e-books, and premium databases.",
      type: "membership",
      read: true,
      time: "2 weeks ago",
      date: "2024-01-01",
      expiryDate: "2024-01-22",
      priority: "medium",
      category: "account",
      bookCover: "🎫",
      actionRequired: true,
      relatedId: "MEM-00345",
      color: "#F59E0B",
    },
    {
      id: 6,
      title: "Return Confirmed: Pride and Prejudice",
      message:
        "Thank you for returning 'Pride and Prejudice'. Your account has been updated. You can now borrow up to 10 more books this month.",
      type: "return",
      read: true,
      time: "3 weeks ago",
      date: "2023-12-25",
      priority: "low",
      category: "borrowing",
      bookCover: "✅",
      actionRequired: false,
      relatedId: "RET-00678",
      color: "#06B6D4",
    },
    {
      id: 7,
      title: "Reading Marathon Event This Saturday",
      message:
        "Join us for the annual 6-hour Reading Marathon! Free snacks, coffee, and certificates for participants. Special guest: Author Jane Smith.",
      type: "event",
      read: false,
      time: "Just now",
      date: "2024-01-15",
      eventDate: "2024-01-20",
      priority: "medium",
      category: "events",
      bookCover: "📖",
      actionRequired: false,
      relatedId: "EVT-00234",
      color: "#EC4899",
    },
    {
      id: 8,
      title: "URGENT: Book Overdue - 3 Days Late",
      message:
        "'The Catcher in the Rye' is 3 days overdue. Additional daily fine: $1. Total due: $3. Please return immediately or renew online.",
      type: "overdue",
      read: false,
      time: "5 minutes ago",
      date: "2024-01-15",
      priority: "high",
      category: "borrowing",
      bookCover: "🚨",
      actionRequired: true,
      relatedId: "OVD-00901",
      color: "#DC2626",
    },
  ];

  useEffect(() => {
    notificationsAPI
      .getAll()
      .then((res) => {
        if (res.data?.notifications && res.data.notifications.length > 0) {
          const mapped = res.data.notifications.map((n, idx) => ({
            id: n._id || idx + 1,
            _id: n._id,
            title: n.title,
            message: n.message,
            type: n.type || "system",
            read: n.isRead || false,
            time: "Recently",
            date: n.createdAt ? n.createdAt.split("T")[0] : "2024-01-15",
            dueDate: "2024-01-20",
            priority: n.priority || "medium",
            category: "borrowing",
            bookCover: "📗",
            actionRequired: false,
            relatedId: "SYS-001",
            color: "#3B82F6",
          }));
          setNotifications(mapped);
        } else {
          setNotifications(sampleNotifications);
        }
      })
      .catch(() => setNotifications(sampleNotifications));
  }, []);

  const getNotificationIcon = (type) => {
    const icons = {
      due_date: "⏰",
      reservation: "📚",
      new_arrival: "📦",
      fine: "💰",
      membership: "👤",
      return: "✅",
      event: "📅",
      overdue: "🚨",
      digital: "💻",
      maintenance: "🔧",
      hold: "⏳",
      club: "👥",
    };
    return icons[type] || "🔔";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const markAsRead = (id) => {
    const target = notifications.find((n) => n.id === id);
    if (target?._id) {
      notificationsAPI.markRead(target._id).catch(() => {});
    }
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    notificationsAPI.markAllRead().catch(() => {});
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (id) => {
    const target = notifications.find((n) => n.id === id);
    if (target?._id) {
      notificationsAPI.delete(target._id).catch(() => {});
    }
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
    setSelectedNotifications((prev) =>
      prev.filter((notifId) => notifId !== id),
    );
  };

  const deleteSelected = () => {
    setNotifications((prev) =>
      prev.filter(
        (notification) => !selectedNotifications.includes(notification.id),
      ),
    );
    setSelectedNotifications([]);
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id)
        ? prev.filter((notifId) => notifId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "all") return true;
      if (filter === "unread") return !notification.read;
      if (filter === "action") return notification.actionRequired;
      if (filter === "high") return notification.priority === "high";
      return notification.type === filter;
    })
    .filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date_desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date_asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter(
    (n) => n.priority === "high",
  ).length;
  const actionRequiredCount = notifications.filter(
    (n) => n.actionRequired,
  ).length;

  const getTypeLabel = (type) => {
    const typeMap = {
      due_date: "Due Date",
      reservation: "Reservation",
      new_arrival: "New Arrivals",
      fine: "Fines",
      membership: "Membership",
      return: "Returns",
      event: "Events",
      overdue: "Overdue",
    };
    return typeMap[type] || type;
  };

  const handleCategoryClick = (type) => {
    setSidebarAnimation("pulse");
    setTimeout(() => setSidebarAnimation(""), 300);
    setActiveCategory(type);
    setFilter(type);
  };

  const categories = [
    {
      type: "all",
      label: "All Notifications",
      icon: "📋",
      count: notifications.length,
      color: "#64748b",
    },
    {
      type: "unread",
      label: "Unread",
      icon: "📨",
      count: unreadCount,
      color: "#3B82F6",
    },
    {
      type: "high",
      label: "High Priority",
      icon: "⚠️",
      count: highPriorityCount,
      color: "#EF4444",
    },
    {
      type: "action",
      label: "Action Required",
      icon: "⚡",
      count: actionRequiredCount,
      color: "#F59E0B",
    },
    {
      type: "due_date",
      label: "Due Dates",
      icon: "⏰",
      count: notifications.filter((n) => n.type === "due_date").length,
      color: "#3B82F6",
    },
    {
      type: "overdue",
      label: "Overdue",
      icon: "🚨",
      count: notifications.filter((n) => n.type === "overdue").length,
      color: "#DC2626",
    },
    {
      type: "reservation",
      label: "Reservations",
      icon: "📚",
      count: notifications.filter((n) => n.type === "reservation").length,
      color: "#8B5CF6",
    },
    {
      type: "fine",
      label: "Fines",
      icon: "💰",
      count: notifications.filter((n) => n.type === "fine").length,
      color: "#EF4444",
    },
  ];

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      overflow-x: hidden;
    }

    .notification-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0;
      position: relative;
    }

    .notification-page::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 0;
    }

    .main-container {
      max-width: 100%;
      margin: 0;
      padding: 0;
      position: relative;
      z-index: 1;
    }

    /* Header */
    .page-header {
      padding: 20px 24px;
      background: white;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border-bottom: 1px solid #e2e8f0;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      gap: 24px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 22px;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    .header-text h1 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .header-text p {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }

    .header-stats {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .stat-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      min-width: 140px;
    }

    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
    }

    .stat-icon.unread {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    }

    .stat-icon.high {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .stat-info h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .stat-info p {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }

    /* Main Content */
    .main-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 24px;
      min-height: calc(100vh - 140px);
    }

    /* Sidebar */
    .sidebar {
      position: sticky;
      top: 120px;
      height: fit-content;
    }

    .sidebar-section {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f1f5f9;
    }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .category-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: #f8fafc;
      border: 1px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .category-item::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.1);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .category-item:active::after {
      width: 200px;
      height: 200px;
    }

    .category-item:hover {
      background: #f1f5f9;
      transform: translateX(4px);
      border-color: #cbd5e1;
    }

    .category-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transform: translateX(8px) scale(1.02);
      animation: pulse 0.3s ease;
    }

    .pulse-animation {
      animation: pulse 0.3s ease !important;
    }

    @keyframes pulse {
      0% {
        transform: translateX(8px) scale(1);
      }
      50% {
        transform: translateX(8px) scale(1.05);
      }
      100% {
        transform: translateX(8px) scale(1.02);
      }
    }

    .category-item.active .category-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .category-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      transition: all 0.3s ease;
    }

    .category-item.active .category-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      transform: rotate(10deg);
    }

    .category-name {
      font-weight: 600;
      font-size: 13px;
      color: #334155;
      transition: all 0.3s ease;
    }

    .category-item.active .category-name {
      color: white;
      font-weight: 700;
    }

    .category-count {
      background: white;
      color: #475569;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      min-width: 24px;
      text-align: center;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    /* Quick Actions */
    .quick-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      color: #334155;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
      position: relative;
      overflow: hidden;
    }

    .action-btn::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.1);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .action-btn:active::after {
      width: 200px;
      height: 200px;
    }

    .action-btn:hover {
      background: #f1f5f9;
      transform: translateX(4px);
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .action-icon {
      font-size: 18px;
      opacity: 0.8;
      transition: transform 0.3s ease;
    }

    .action-btn:hover .action-icon {
      transform: scale(1.1);
    }

    /* Notifications Content */
    .notifications-content {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      border: 1px solid #f1f5f9;
      min-height: 600px;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f1f5f9;
    }

    .header-left-group h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
    }

    .header-left-group p {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-box {
      position: relative;
      width: 280px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 16px;
    }

    .search-input {
      width: 100%;
      padding: 12px 16px 12px 42px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 13px;
      background: #f8fafc;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .sort-select {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      background: #f8fafc;
      color: #334155;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      min-width: 160px;
      transition: all 0.3s ease;
    }

    .sort-select:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Notifications List */
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .notification-item {
      background: white;
      border-radius: 14px;
      padding: 20px;
      border: 2px solid #f1f5f9;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      gap: 16px;
    }

    .notification-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--item-color, #667eea);
      transition: width 0.3s ease;
    }

    .notification-item:hover::before {
      width: 6px;
    }

    .notification-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border-color: #e2e8f0;
    }

    .notification-item.unread {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.04) 0%, rgba(255, 255, 255, 0.98) 100%);
    }

    /* FIXED: Checkbox container */
    .checkbox-container {
      flex-shrink: 0;
      margin-top: 2px;
      position: relative;
      z-index: 1;
    }

    .select-checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid #cbd5e1;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease;
      appearance: none;
      position: relative;
    }

    .select-checkbox:checked {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
    }

    .select-checkbox:checked::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .select-checkbox:hover {
      border-color: #667eea;
      transform: scale(1.1);
    }

    .item-content-wrapper {
      flex: 1;
      display: flex;
      gap: 16px;
      min-width: 0;
    }

    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
      background: var(--item-color, #667eea);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .notification-item:hover .item-icon {
      transform: scale(1.05) rotate(5deg);
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }

    .item-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      gap: 10px;
    }

    .item-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.4;
      flex: 1;
    }

    .item-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .badge-high {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
    }

    .badge-medium {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #92400e;
    }

    .badge-low {
      background: linear-gradient(135deg, #ecfdf5 0%, #a7f3d0 100%);
      color: #065f46;
    }

    .item-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .item-type {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.05);
      color: var(--item-color, #667eea);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .item-time {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .item-message {
      color: #475569;
      line-height: 1.5;
      font-size: 14px;
      margin-bottom: 16px;
      padding-right: 8px;
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }

    .item-date {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
    }

    .item-actions {
      display: flex;
      gap: 10px;
    }

    .action-button {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .action-button::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .action-button:active::after {
      width: 200px;
      height: 200px;
    }

    .read-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
    }

    .read-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .delete-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
    }

    .delete-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 24px;
      text-align: center;
    }

    .empty-icon {
      font-size: 60px;
      margin-bottom: 20px;
      opacity: 0.1;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 10px;
    }

    .empty-text {
      font-size: 14px;
      color: #64748b;
      max-width: 360px;
      margin: 0 auto 20px;
      line-height: 1.5;
    }

    .clear-filters-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .clear-filters-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    /* Batch Actions */
    .batch-actions {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 14px 20px;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 1000;
      border: 1px solid #e2e8f0;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }

    .batch-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .batch-count {
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }

    .batch-buttons {
      display: flex;
      gap: 10px;
    }

    .batch-btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .batch-mark-read {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .batch-mark-read:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .batch-delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .batch-delete:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .sidebar {
        position: static;
      }
      
      .header-stats {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .stat-badge {
        min-width: 180px;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
      
      .page-header {
        padding: 16px;
      }
      
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .header-controls {
        flex-direction: column;
        width: 100%;
      }
      
      .search-box {
        width: 100%;
      }
      
      .content-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .notification-item {
        flex-direction: column;
        gap: 12px;
      }
      
      .item-content-wrapper {
        width: 100%;
      }
      
      .item-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .item-actions {
        width: 100%;
        justify-content: flex-end;
      }
      
      .batch-actions {
        width: calc(100% - 32px);
        flex-direction: column;
        gap: 12px;
      }
      
      .batch-buttons {
        width: 100%;
      }
      
      .batch-btn {
        flex: 1;
      }
    }
  `;

  return (
    <div className="notification-page">
      <style>{styles}</style>

      <div className="main-container">
        {/* Header */}
        <header className="page-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">🔔</div>
              <div className="header-text">
                <h1>Library Notifications</h1>
                <p>Stay updated with your library activities</p>
              </div>
            </div>

            <div className="header-stats">
              <div className="stat-badge">
                <div className="stat-icon unread">📨</div>
                <div className="stat-info">
                  <h3>{unreadCount}</h3>
                  <p>Unread Notifications</p>
                </div>
              </div>
              <div className="stat-badge">
                <div className="stat-icon high">⚠️</div>
                <div className="stat-info">
                  <h3>{highPriorityCount}</h3>
                  <p>High Priority</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-grid">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-section">
                <h3 className="section-title">Categories</h3>
                <div className="categories-list">
                  {categories.map((category) => (
                    <div
                      key={category.type}
                      className={`category-item ${filter === category.type ? "active" : ""} ${sidebarAnimation === "pulse" && filter === category.type ? "pulse-animation" : ""}`}
                      onClick={() => handleCategoryClick(category.type)}
                      style={{ "--item-color": category.color }}
                    >
                      <div className="category-left">
                        <div className="category-icon">{category.icon}</div>
                        <span className="category-name">{category.label}</span>
                      </div>
                      {category.count > 0 && (
                        <span className="category-count">{category.count}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions">
                  <button
                    className="action-btn"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <span className="action-icon">✓</span>
                    <span>Mark All as Read</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                      setActiveCategory("all");
                    }}
                  >
                    <span className="action-icon">🔄</span>
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="notifications-content">
              <div className="content-header">
                <div className="header-left-group">
                  <h2>
                    {filter === "all"
                      ? "All Notifications"
                      : filter === "unread"
                        ? "Unread Notifications"
                        : filter === "action"
                          ? "Action Required"
                          : filter === "high"
                            ? "High Priority"
                            : getTypeLabel(filter)}
                  </h2>
                  <p>{filteredNotifications.length} notifications found</p>
                </div>

                <div className="header-controls">
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>

              {/* Notifications List */}
              <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3 className="empty-title">No notifications found</h3>
                    <p className="empty-text">
                      {searchTerm
                        ? `No notifications match "${searchTerm}"`
                        : "You're all caught up! No notifications to display."}
                    </p>
                    {(searchTerm || filter !== "all") && (
                      <button
                        className="clear-filters-btn"
                        onClick={() => {
                          setSearchTerm("");
                          setFilter("all");
                          setActiveCategory("all");
                        }}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.read ? "" : "unread"}`}
                      style={{ "--item-color": notification.color }}
                    >
                      {/* FIXED: Checkbox container */}
                      <div className="checkbox-container">
                        <input
                          type="checkbox"
                          className="select-checkbox"
                          checked={selectedNotifications.includes(
                            notification.id,
                          )}
                          onChange={() =>
                            toggleSelectNotification(notification.id)
                          }
                        />
                      </div>

                      <div className="item-content-wrapper">
                        <div className="item-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="item-content">
                          <div className="item-title-row">
                            <h3 className="item-title">{notification.title}</h3>
                            <span
                              className={`item-badge badge-${notification.priority}`}
                            >
                              {notification.priority === "high"
                                ? "🔴"
                                : notification.priority === "medium"
                                  ? "🟡"
                                  : "🟢"}
                              {notification.priority}
                            </span>
                          </div>

                          <div className="item-meta">
                            <span className="item-type">
                              {getTypeLabel(notification.type)}
                            </span>
                            <span className="item-time">
                              🕒 {notification.time}
                            </span>
                          </div>

                          <p className="item-message">{notification.message}</p>

                          <div className="item-footer">
                            <div className="item-date">
                              📅 {formatDate(notification.date)}
                              {notification.dueDate && (
                                <>
                                  <span>•</span>
                                  <span>
                                    ⏰ Due: {formatDate(notification.dueDate)}
                                  </span>
                                </>
                              )}
                              {notification.amount && (
                                <>
                                  <span>•</span>
                                  <span>💰 {notification.amount}</span>
                                </>
                              )}
                            </div>

                            <div className="item-actions">
                              {!notification.read && (
                                <button
                                  className="action-button read-btn"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  ✓ Mark Read
                                </button>
                              )}
                              <button
                                className="action-button delete-btn"
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Batch Actions */}
        {selectedNotifications.length > 0 && (
          <div className="batch-actions">
            <div className="batch-info">
              <span className="batch-count">
                {selectedNotifications.length}
              </span>
              <span>notifications selected</span>
            </div>
            <div className="batch-buttons">
              <button
                className="batch-btn batch-mark-read"
                onClick={() => {
                  selectedNotifications.forEach((id) => markAsRead(id));
                  setSelectedNotifications([]);
                }}
              >
                ✓ Mark as Read
              </button>
              <button
                className="batch-btn batch-delete"
                onClick={deleteSelected}
              >
                🗑️ Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
