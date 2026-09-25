import React, { useState } from "react";
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

const Report = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("overview");
  const [dateRange, setDateRange] = useState("monthly");

  // Mock Data
  const monthlyBorrowData = [
    { month: "Jan", borrows: 120, returns: 115, fines: 245 },
    { month: "Feb", borrows: 135, returns: 130, fines: 280 },
    { month: "Mar", borrows: 150, returns: 145, fines: 310 },
    { month: "Apr", borrows: 165, returns: 160, fines: 340 },
    { month: "May", borrows: 180, returns: 175, fines: 365 },
    { month: "Jun", borrows: 200, returns: 195, fines: 410 },
  ];

  const categoryDistribution = [
    { name: "Fiction", value: 35, color: "#0088FE" },
    { name: "Non-Fiction", value: 25, color: "#00C49F" },
    { name: "Science", value: 15, color: "#FFBB28" },
    { name: "Technology", value: 12, color: "#FF8042" },
    { name: "Biography", value: 8, color: "#8884D8" },
  ];

  const topBorrowedBooks = [
    { name: "The Hobbit", borrows: 120, rating: 4.8 },
    { name: "1984", borrows: 97, rating: 4.7 },
    { name: "Pride & Prejudice", borrows: 85, rating: 4.6 },
    { name: "The Great Gatsby", borrows: 78, rating: 4.5 },
    { name: "To Kill a Mockingbird", borrows: 65, rating: 4.9 },
  ];

  const revenueData = {
    fines: 12540,
    membership: 8500,
    lateReturns: 3240,
    reservations: 1200,
    total: 25480,
  };

  const userStats = {
    newUsers: 45,
    activeUsers: 856,
    premiumUsers: 234,
    inactiveUsers: 89,
  };

  const handleBackToDashboard = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
  };

  const handleGenerateReport = () => {
    alert("Report generation started...");
  };

  const handleExportPDF = () => {
    alert("Exporting as PDF...");
  };

  const handleExportExcel = () => {
    alert("Exporting as Excel...");
  };

  return (
    <div className="page-container">
      <style jsx="true">{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
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
          align-items: center;
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

        .export-btn {
          padding: 10px 20px;
          background: #10b981;
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

        .export-btn:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .filter-section {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 500;
          color: #475569;
          font-size: 14px;
        }

        .filter-group select {
          padding: 10px 15px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          min-width: 200px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .report-type-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .report-tab {
          padding: 12px 24px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          color: #475569;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .report-tab:hover {
          border-color: #4f46e5;
          color: #4f46e5;
        }

        .report-tab.active {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          border-color: transparent;
        }

        .stats-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          text-align: center;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .stat-card.blue {
          border-top: 4px solid #3b82f6;
        }
        .stat-card.green {
          border-top: 4px solid #10b981;
        }
        .stat-card.purple {
          border-top: 4px solid #8b5cf6;
        }
        .stat-card.orange {
          border-top: 4px solid #f59e0b;
        }

        .stat-value {
          font-size: 36px;
          font-weight: bold;
          color: #1e293b;
          margin: 10px 0 5px 0;
        }

        .stat-label {
          color: #64748b;
          font-size: 14px;
        }

        .stat-trend {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-block;
          margin-top: 10px;
          font-weight: 600;
        }

        .trend-up {
          background: #d1fae5;
          color: #065f46;
        }
        .trend-down {
          background: #fee2e2;
          color: #991b1b;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        @media (max-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-container {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .chart-title {
          margin: 0 0 20px 0;
          color: #1e293b;
          font-size: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chart-wrapper {
          height: 300px;
        }

        .revenue-breakdown {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
        }

        .revenue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .revenue-item:last-child {
          border-bottom: none;
        }

        .revenue-label {
          color: #475569;
        }

        .revenue-value {
          font-weight: 600;
          color: #1e293b;
        }

        .revenue-total {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
          margin-top: 10px;
        }

        .detailed-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
        }

        .detailed-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .detailed-table th {
          background: #f8fafc;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          border-bottom: 2px solid #e2e8f0;
        }

        .detailed-table td {
          padding: 15px;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
        }

        .detailed-table tr:hover {
          background: #f8fafc;
        }

        .rating-badge {
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .insights-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .insight-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .insight-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .insight-icon {
          font-size: 24px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insight-content p {
          margin: 8px 0;
          color: #64748b;
          line-height: 1.6;
        }

        .insight-content strong {
          color: #1e293b;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .filter-section {
            flex-direction: column;
            align-items: stretch;
          }

          .report-type-tabs {
            justify-content: center;
          }

          .stats-summary {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .stats-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="header-left">
          <h1>📈 Reports & Analytics</h1>
          <p>Comprehensive insights and analytics for library management</p>
        </div>
        <div className="header-actions">
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <button className="export-btn" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="financial">Financial</option>
            <option value="usage">Usage Statistics</option>
            <option value="members">Member Analytics</option>
            <option value="inventory">Inventory Report</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <button className="export-btn" onClick={handleGenerateReport}>
          📊 Generate Report
        </button>
      </div>

      <div className="report-type-tabs">
        <button
          className={`report-tab ${reportType === "overview" ? "active" : ""}`}
          onClick={() => setReportType("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`report-tab ${reportType === "financial" ? "active" : ""}`}
          onClick={() => setReportType("financial")}
        >
          💰 Financial
        </button>
        <button
          className={`report-tab ${reportType === "usage" ? "active" : ""}`}
          onClick={() => setReportType("usage")}
        >
          📚 Usage Stats
        </button>
        <button
          className={`report-tab ${reportType === "members" ? "active" : ""}`}
          onClick={() => setReportType("members")}
        >
          👥 Members
        </button>
        <button
          className={`report-tab ${reportType === "inventory" ? "active" : ""}`}
          onClick={() => setReportType("inventory")}
        >
          📦 Inventory
        </button>
      </div>

      <div className="stats-summary">
        <div className="stat-card blue">
          <div className="stat-icon">📚</div>
          <div className="stat-value">2,456</div>
          <div className="stat-label">Total Books</div>
          <div className="stat-trend trend-up">+12%</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">👥</div>
          <div className="stat-value">856</div>
          <div className="stat-label">Active Members</div>
          <div className="stat-trend trend-up">+8%</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            ${revenueData.total.toLocaleString()}
          </div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-trend trend-up">+15%</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">📖</div>
          <div className="stat-value">342</div>
          <div className="stat-label">Current Borrows</div>
          <div className="stat-trend trend-down">-3%</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-title">
            <h3>Monthly Borrows & Returns</h3>
            <button
              className="export-btn"
              onClick={handleExportExcel}
              style={{ padding: "8px 16px", fontSize: "12px" }}
            >
              📥 Export Data
            </button>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBorrowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="borrows"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Book Categories Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="revenue-breakdown">
        <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>
          Revenue Breakdown
        </h3>
        <div className="revenue-item">
          <span className="revenue-label">Fines & Penalties</span>
          <span className="revenue-value">
            ${revenueData.fines.toLocaleString()}
          </span>
        </div>
        <div className="revenue-item">
          <span className="revenue-label">Membership Fees</span>
          <span className="revenue-value">
            ${revenueData.membership.toLocaleString()}
          </span>
        </div>
        <div className="revenue-item">
          <span className="revenue-label">Late Returns</span>
          <span className="revenue-value">
            ${revenueData.lateReturns.toLocaleString()}
          </span>
        </div>
        <div className="revenue-item">
          <span className="revenue-label">Reservation Fees</span>
          <span className="revenue-value">
            ${revenueData.reservations.toLocaleString()}
          </span>
        </div>
        <div className="revenue-item">
          <span className="revenue-label">Total Revenue</span>
          <span className="revenue-total">
            ${revenueData.total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="detailed-table">
        <h3 style={{ padding: "20px 20px 10px", margin: 0, color: "#1e293b" }}>
          Top Borrowed Books
        </h3>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Book Title</th>
              <th>Borrow Count</th>
              <th>User Rating</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {topBorrowedBooks.map((book, index) => (
              <tr key={index}>
                <td>#{index + 1}</td>
                <td>
                  <strong>{book.name}</strong>
                </td>
                <td>{book.borrows} times</td>
                <td>
                  <span className="rating-badge">⭐ {book.rating}/5</span>
                </td>
                <td>Fiction</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="insights-section">
        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon">📈</div>
            <h3 style={{ margin: 0 }}>Key Insight</h3>
          </div>
          <div className="insight-content">
            <p>
              <strong>Peak Borrowing Hours:</strong> 2 PM - 5 PM
            </p>
            <p>
              <strong>Most Active Day:</strong> Saturday
            </p>
            <p>
              <strong>Growth Trend:</strong> 15% increase in new members this
              month
            </p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon">💡</div>
            <h3 style={{ margin: 0 }}>Recommendations</h3>
          </div>
          <div className="insight-content">
            <p>• Increase Fiction category books by 20%</p>
            <p>• Introduce weekend membership discounts</p>
            <p>• Add more copies of top 5 borrowed books</p>
            <p>• Implement automated fine reminders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
