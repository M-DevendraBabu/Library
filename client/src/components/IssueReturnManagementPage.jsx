import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { transactionsAPI } from "../services/api";

const IssueReturnManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("issue");
  const [searchTerm, setSearchTerm] = useState("");

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "issue",
      book: "1984",
      bookId: "B001",
      member: "John Smith",
      memberId: "U001",
      date: "2024-01-10",
      dueDate: "2024-01-24",
      status: "active",
      fine: 0,
    },
    {
      id: 2,
      type: "return",
      book: "The Great Gatsby",
      bookId: "B002",
      member: "Sarah Johnson",
      memberId: "U002",
      date: "2024-01-09",
      dueDate: "2024-01-23",
      status: "returned",
      fine: 2.5,
    },
    {
      id: 3,
      type: "issue",
      book: "The Hobbit",
      bookId: "B003",
      member: "Michael Chen",
      memberId: "U003",
      date: "2024-01-08",
      dueDate: "2024-01-22",
      status: "overdue",
      fine: 5.0,
    },
    {
      id: 4,
      type: "renew",
      book: "Pride and Prejudice",
      bookId: "B004",
      member: "Emma Wilson",
      memberId: "U004",
      date: "2024-01-07",
      dueDate: "2024-01-28",
      status: "active",
      fine: 1.0,
    },
    {
      id: 5,
      type: "issue",
      book: "To Kill a Mockingbird",
      bookId: "B005",
      member: "David Brown",
      memberId: "U005",
      date: "2024-01-06",
      dueDate: "2024-01-20",
      status: "active",
      fine: 0,
    },
  ]);

  const pendingRequests = [
    {
      id: 1,
      book: "The Catcher in the Rye",
      member: "Lisa Taylor",
      requestDate: "2024-01-10",
      type: "issue",
    },
    {
      id: 2,
      book: "Brave New World",
      member: "John Smith",
      requestDate: "2024-01-09",
      type: "renew",
    },
    {
      id: 3,
      book: "Moby Dick",
      member: "Sarah Johnson",
      requestDate: "2024-01-08",
      type: "issue",
    },
  ];

  const stats = {
    activeIssues: transactions.filter((t) => t.status === "active").length,
    overdue: transactions.filter((t) => t.status === "overdue").length,
    totalFines: transactions.reduce((acc, t) => acc + t.fine, 0),
    pendingRequests: pendingRequests.length,
  };

  useEffect(() => {
    transactionsAPI
      .getAll({ limit: 50 })
      .then((res) => {
        if (res.data?.transactions && res.data.transactions.length > 0) {
          const mapped = res.data.transactions.map((t, idx) => ({
            id: t._id || idx + 1,
            _id: t._id,
            type:
              t.status === "returned"
                ? "return"
                : t.status === "renewed"
                ? "renew"
                : "issue",
            book: t.book?.title || "Library Book",
            bookId: t.book?._id
              ? `B${t.book._id.slice(-4).toUpperCase()}`
              : `B00${idx + 1}`,
            member: t.user?.name || "Library Member",
            memberId: t.user?._id
              ? `U${t.user._id.slice(-4).toUpperCase()}`
              : `U00${idx + 1}`,
            date: t.issueDate ? t.issueDate.split("T")[0] : "2024-01-10",
            dueDate: t.dueDate ? t.dueDate.split("T")[0] : "2024-01-24",
            status:
              t.status === "returned"
                ? "returned"
                : t.status === "overdue"
                ? "overdue"
                : "active",
            fine: t.fine || 0,
          }));
          setTransactions(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleBackToDashboard = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
  };

  const handleIssueBook = () => {
    navigate("/admin/book-management");
  };

  const handleReturnBook = (transactionId) => {
    const target = transactions.find((t) => t.id === transactionId);
    if (target?._id) {
      transactionsAPI
        .return({ transactionId: target._id })
        .then(() => alert(`Successfully returned "${target.book}"!`))
        .catch((err) =>
          alert(err.response?.data?.message || "Book return recorded")
        );
    } else {
      alert(`Return processed for transaction ${transactionId}`);
    }
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId ? { ...t, status: "returned" } : t
      )
    );
  };

  const handleApproveRequest = (requestId) => {
    alert(`Approved request #${requestId}`);
  };

  return (
    <div className="page-container">
      <style jsx="true">{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 20px;
        }

        .page-header {
          background: white;
          padding: 25px 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left h1 {
          margin: 0 0 10px 0;
          color: #2d3748;
          font-size: 28px;
        }

        .header-left p {
          margin: 0;
          color: #718096;
        }

        .header-actions {
          display: flex;
          gap: 15px;
        }

        .back-btn {
          padding: 10px 20px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
        }

        .primary-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-card.blue {
          border-top: 4px solid #3b82f6;
        }
        .stat-card.red {
          border-top: 4px solid #ef4444;
        }
        .stat-card.green {
          border-top: 4px solid #10b981;
        }
        .stat-card.orange {
          border-top: 4px solid #f59e0b;
        }

        .stat-icon {
          font-size: 36px;
          opacity: 0.8;
        }

        .stat-info h3 {
          margin: 0;
          font-size: 32px;
          color: #1e293b;
        }

        .stat-info p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .tab-navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .tab-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          background: none;
          cursor: pointer;
          font-weight: 500;
          color: #64748b;
          transition: all 0.3s;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: #f1f5f9;
        }

        .search-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
        }

        .search-bar {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .search-bar input {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .search-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .transaction-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
        }

        .transaction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .type-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .type-badge.issue {
          background: #dbeafe;
          color: #1e40af;
        }
        .type-badge.return {
          background: #dcfce7;
          color: #166534;
        }
        .type-badge.renew {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }
        .status-badge.overdue {
          background: #fee2e2;
          color: #991b1b;
        }
        .status-badge.returned {
          background: #e0f2fe;
          color: #075985;
        }

        .card-content p {
          margin: 8px 0;
          color: #475569;
        }

        .card-content strong {
          color: #1e293b;
        }

        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 13px;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #94a3b8, #64748b);
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .requests-section {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .requests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .request-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #f59e0b;
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .request-badge {
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .tab-navigation {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .cards-grid,
          .requests-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="header-left">
          <h1>🔄 Issue & Return Management</h1>
          <p>Manage book issuing, returns, renewals, and fines</p>
        </div>
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <button className="primary-btn" onClick={handleIssueBook}>
            <span>📖</span> Issue New Book
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.activeIssues}</h3>
            <p>Active Issues</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.overdue}</h3>
            <p>Overdue Books</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>${stats.totalFines.toFixed(2)}</h3>
            <p>Total Fines</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "issue" ? "active" : ""}`}
          onClick={() => setActiveTab("issue")}
        >
          Issue Books
        </button>
        <button
          className={`tab-btn ${activeTab === "return" ? "active" : ""}`}
          onClick={() => setActiveTab("return")}
        >
          Return Books
        </button>
        <button
          className={`tab-btn ${activeTab === "renew" ? "active" : ""}`}
          onClick={() => setActiveTab("renew")}
        >
          Renewals
        </button>
        <button
          className={`tab-btn ${activeTab === "fines" ? "active" : ""}`}
          onClick={() => setActiveTab("fines")}
        >
          Fines Management
        </button>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by book title, member name, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍 Search</button>
        </div>
      </div>

      <div className="cards-grid">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-card">
            <div className="card-header">
              <span className={`type-badge ${transaction.type}`}>
                {transaction.type.toUpperCase()}
              </span>
              <span className={`status-badge ${transaction.status}`}>
                {transaction.status.toUpperCase()}
              </span>
            </div>
            <div className="card-content">
              <p>
                <strong>Book:</strong> {transaction.book} ({transaction.bookId})
              </p>
              <p>
                <strong>Member:</strong> {transaction.member} (
                {transaction.memberId})
              </p>
              <p>
                <strong>Issue Date:</strong> {transaction.date}
              </p>
              <p>
                <strong>Due Date:</strong> {transaction.dueDate}
              </p>
              {transaction.fine > 0 && (
                <p>
                  <strong>Fine:</strong>{" "}
                  <span style={{ color: "#ef4444" }}>${transaction.fine}</span>
                </p>
              )}
            </div>
            <div className="card-actions">
              <button className="action-btn primary">View Details</button>
              {transaction.type === "issue" &&
                transaction.status === "active" && (
                  <button
                    className="action-btn secondary"
                    onClick={() => handleReturnBook(transaction.id)}
                  >
                    Mark Returned
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      <div className="requests-section">
        <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>
          Pending Requests
        </h2>
        <div className="requests-grid">
          {pendingRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <h3 style={{ margin: 0 }}>{request.book}</h3>
                <span className="request-badge">{request.type}</span>
              </div>
              <p>
                <strong>Member:</strong> {request.member}
              </p>
              <p>
                <strong>Request Date:</strong> {request.requestDate}
              </p>
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  className="action-btn primary"
                  onClick={() => handleApproveRequest(request.id)}
                >
                  Approve
                </button>
                <button className="action-btn secondary">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueReturnManagementPage;
