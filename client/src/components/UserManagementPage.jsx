import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../services/api";

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      membership: "Premium",
      joinDate: "2023-01-15",
      booksBorrowed: 12,
      overdueBooks: 1,
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 234-567-8901",
      membership: "Standard",
      joinDate: "2023-02-20",
      booksBorrowed: 8,
      overdueBooks: 0,
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 234-567-8902",
      membership: "Premium",
      joinDate: "2023-03-10",
      booksBorrowed: 23,
      overdueBooks: 2,
      status: "Active",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "+1 234-567-8903",
      membership: "Standard",
      joinDate: "2023-04-05",
      booksBorrowed: 5,
      overdueBooks: 0,
      status: "Inactive",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      phone: "+1 234-567-8904",
      membership: "Premium",
      joinDate: "2023-05-12",
      booksBorrowed: 17,
      overdueBooks: 0,
      status: "Active",
    },
    {
      id: 6,
      name: "Lisa Taylor",
      email: "lisa@example.com",
      phone: "+1 234-567-8905",
      membership: "Standard",
      joinDate: "2023-06-18",
      booksBorrowed: 9,
      overdueBooks: 1,
      status: "Active",
    },
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "Active").length,
    premiumUsers: users.filter((u) => u.membership === "Premium").length,
    totalOverdue: users.reduce((acc, u) => acc + u.overdueBooks, 0),
  };

  useEffect(() => {
    usersAPI
      .getAll({ limit: 50 })
      .then((res) => {
        if (res.data?.users && res.data.users.length > 0) {
          const mapped = res.data.users.map((u, idx) => ({
            id: u._id || idx + 1,
            _id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone || "+1 234-567-8900",
            membership: u.membership || (u.role === "admin" ? "Admin" : "Premium"),
            joinDate: u.createdAt ? u.createdAt.split("T")[0] : "2023-01-15",
            booksBorrowed: u.borrowedBooksCount || 0,
            overdueBooks: 0,
            status: u.isActive !== false ? "Active" : "Inactive",
          }));
          setUsers(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleBackToDashboard = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
  };

  const handleUpdateStatus = (userId, newStatus) => {
    const target = users.find((u) => u.id === userId);
    if (target?._id) {
      usersAPI
        .update(target._id, { isActive: newStatus === "Active" })
        .catch(() => {});
    }
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user,
      ),
    );
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const target = users.find((u) => u.id === userId);
      if (target?._id) {
        usersAPI.delete(target._id).catch(() => {});
      }
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="page-container">
      <style jsx="true">{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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

        .search-bar {
          position: relative;
          width: 300px;
        }

        .search-bar input {
          width: 100%;
          padding: 12px 40px 12px 15px;
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
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #64748b;
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
        .stat-card.green {
          border-top: 4px solid #10b981;
        }
        .stat-card.purple {
          border-top: 4px solid #8b5cf6;
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

        .users-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          background: #f8fafc;
          padding: 18px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          border-bottom: 2px solid #e2e8f0;
        }

        .users-table td {
          padding: 18px;
          border-bottom: 1px solid #f1f5f9;
        }

        .users-table tr:hover {
          background: #f8fafc;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }

        .user-details h4 {
          margin: 0 0 5px 0;
          color: #1e293b;
        }

        .user-details p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        .membership-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .membership-badge.premium {
          background: linear-gradient(135deg, #fcd34d, #f59e0b);
          color: #78350f;
        }

        .membership-badge.standard {
          background: linear-gradient(135deg, #93c5fd, #3b82f6);
          color: #1e3a8a;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.active {
          background: linear-gradient(135deg, #a7f3d0, #10b981);
          color: #064e3b;
        }

        .status-badge.inactive {
          background: linear-gradient(135deg, #fca5a5, #ef4444);
          color: #7f1d1d;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
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

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .action-btn.edit {
          background: linear-gradient(135deg, #93c5fd, #3b82f6);
          color: white;
        }

        .action-btn.delete {
          background: linear-gradient(135deg, #fca5a5, #ef4444);
          color: white;
        }

        .action-btn.suspend {
          background: linear-gradient(135deg, #fcd34d, #f59e0b);
          color: white;
        }

        .action-btn.activate {
          background: linear-gradient(135deg, #a7f3d0, #10b981);
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state .icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
          }

          .header-left,
          .header-right {
            width: 100%;
          }

          .search-bar {
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .users-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="page-header">
        <div className="header-left">
          <h1>👥 User Management</h1>
          <p>Manage library users, memberships, and access permissions</p>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" type="button">
              🔍
            </button>
          </div>
        </div>
      </div>

      <div className="header-actions">
        <button className="back-btn" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
        <button className="btn btn-primary">
          <span>+</span> Add New User
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{stats.premiumUsers}</h3>
            <p>Premium Members</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.totalOverdue}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        {filteredUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Membership</th>
                <th>Join Date</th>
                <th>Books</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="user-details">
                        <h4>{user.name}</h4>
                        <p>ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p style={{ marginBottom: "5px" }}>{user.email}</p>
                      <p style={{ color: "#64748b", fontSize: "13px" }}>
                        {user.phone}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`membership-badge ${user.membership.toLowerCase()}`}
                    >
                      {user.membership}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div>
                      <p style={{ marginBottom: "5px" }}>
                        Borrowed: {user.booksBorrowed}
                      </p>
                      <p
                        style={{
                          color: user.overdueBooks > 0 ? "#ef4444" : "#10b981",
                          fontSize: "13px",
                        }}
                      >
                        Overdue: {user.overdueBooks}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit">Edit</button>
                      <button
                        className={`action-btn ${user.status === "Active" ? "suspend" : "activate"}`}
                        onClick={() =>
                          handleUpdateStatus(
                            user.id,
                            user.status === "Active" ? "Inactive" : "Active",
                          )
                        }
                      >
                        {user.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No users found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
