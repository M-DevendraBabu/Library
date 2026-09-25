import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("new-ticket");
  const [user, setUser] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    category: "technical",
    subject: "",
    description: "",
    priority: "medium",
    attachment: null,
  });

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I renew a book?",
      answer:
        'You can renew a book from your dashboard by clicking the "Renew" button next to the book. Books can be renewed up to 2 times if there are no pending reservations.',
    },
    {
      id: 2,
      question: "What happens if I return a book late?",
      answer:
        "Late returns incur a fine of ₹5 per day. Your account may be temporarily suspended if you have multiple overdue books.",
    },
    {
      id: 3,
      question: "How do I reserve a book?",
      answer:
        'Browse the book catalog, find your desired book, and click "Reserve". You will be added to a queue and notified when the book becomes available.',
    },
    {
      id: 4,
      question: "How are reading points calculated?",
      answer:
        "You earn 10 points for each book returned on time, 25 points for completing a book, and bonus points for reading streaks.",
    },
    {
      id: 5,
      question: "Can I access e-books?",
      answer:
        'Yes! Many books have digital versions available. Click "Read Online" from your issued books to access e-books.',
    },
    {
      id: 6,
      question: "How do I update my profile information?",
      answer:
        "Go to your Profile page from the sidebar to update your personal information, password, and notification preferences.",
    },
  ];

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Get user data from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser({
          name: "John Student",
          email: "student@college.edu",
          studentId: "STU2024001",
        });
      }
    } else {
      setUser({
        name: "John Student",
        email: "student@college.edu",
        studentId: "STU2024001",
      });
    }
    fetchSupportTickets();
  }, [navigate]);

  const fetchSupportTickets = () => {
    // Mock data
    setTimeout(() => {
      setTickets([
        {
          id: "TKT001",
          subject: "Cannot renew book",
          category: "technical",
          status: "open",
          createdAt: "2024-01-15",
          lastUpdated: "2024-01-16",
        },
        {
          id: "TKT002",
          subject: "Late fee inquiry",
          category: "billing",
          status: "resolved",
          createdAt: "2024-01-10",
          lastUpdated: "2024-01-12",
        },
      ]);
    }, 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }));
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    // Mock success
    setTimeout(() => {
      alert(
        "Support ticket submitted successfully! Ticket ID: TKT" +
          Math.random().toString().slice(2, 8),
      );
      setFormData({
        category: "technical",
        subject: "",
        description: "",
        priority: "medium",
        attachment: null,
      });
      setActiveTab("my-tickets");
      fetchSupportTickets(); // Refresh tickets
      setLoading(false);
    }, 1000);
  };

  const handleBackToDashboard = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Check authentication directly
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";

  if (!isAuthenticated) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          color: "#1e293b",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Please login to access support
        </h2>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            boxShadow: "0 4px 6px rgba(79, 70, 229, 0.2)",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem",
          color: "#64748b",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "3rem",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            display: "inline-block",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid #e2e8f0",
              borderTopColor: "#4f46e5",
              borderRadius: "50%",
              margin: "0 auto 1rem",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p>Loading support...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        color: "#1e293b",
      }}
    >
      {/* Header Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          padding: "1.5rem 2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                padding: "0.75rem 1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 15px rgba(79, 70, 229, 0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.transform = "translateX(-5px)")
              }
              onMouseOut={(e) => (e.target.style.transform = "translateX(0)")}
            >
              ← Back to Dashboard
            </button>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: "800",
                background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Help & Support Center
            </h1>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.8)",
              padding: "0.75rem 1.25rem",
              borderRadius: "12px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
              }}
            >
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: "600" }}>{user.name}</div>
              <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                {user.studentId}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "2rem auto",
          padding: "0 2rem",
          display: "flex",
          gap: "2rem",
        }}
      >
        {/* Sidebar Card */}
        <div
          style={{
            width: "300px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            borderRadius: "20px",
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(226, 232, 240, 0.6)",
            height: "fit-content",
            position: "sticky",
            top: "100px",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {["new-ticket", "my-tickets", "faq", "contact"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem 1.25rem",
                    border: "none",
                    background:
                      activeTab === tab
                        ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                        : "rgba(226, 232, 240, 0.3)",
                    textAlign: "left",
                    color: activeTab === tab ? "white" : "#475569",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    transform: activeTab === tab ? "translateX(5px)" : "none",
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "new-ticket" && "📝"}
                  {tab === "my-tickets" && "📋"}
                  {tab === "faq" && "❓"}
                  {tab === "contact" && "📞"}
                  {tab
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Help Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid rgba(14, 165, 233, 0.2)",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{ marginTop: 0, color: "#0c4a6e", fontSize: "1.125rem" }}
            >
              Quick Help
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                "How to renew books",
                "How to reserve books",
                "Understanding reading points",
                "Late return fines",
              ].map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  style={{
                    color: "#0369a1",
                    textDecoration: "none",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    background: "rgba(14, 165, 233, 0.05)",
                    border: "1px solid rgba(14, 165, 233, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "rgba(14, 165, 233, 0.1)";
                    e.target.style.transform = "translateX(5px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "rgba(14, 165, 233, 0.05)";
                    e.target.style.transform = "translateX(0)";
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
              padding: "1.5rem",
              borderRadius: "16px",
              border: "1px solid rgba(202, 138, 4, 0.2)",
            }}
          >
            <h3
              style={{ marginTop: 0, color: "#713f12", fontSize: "1.125rem" }}
            >
              Support Stats
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(202, 138, 4, 0.1)",
                }}
              >
                <span style={{ color: "#713f12" }}>Open Tickets:</span>
                <span style={{ fontWeight: "600", color: "#713f12" }}>
                  {tickets.filter((t) => t.status === "open").length}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(202, 138, 4, 0.1)",
                }}
              >
                <span style={{ color: "#713f12" }}>Avg Response Time:</span>
                <span style={{ fontWeight: "600", color: "#713f12" }}>
                  24 hours
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                }}
              >
                <span style={{ color: "#713f12" }}>Support Rating:</span>
                <span style={{ fontWeight: "600", color: "#713f12" }}>
                  4.8/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          {/* New Ticket Card */}
          {activeTab === "new-ticket" && (
            <div
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(226, 232, 240, 0.6)",
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
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
                      fontSize: "1.5rem",
                    }}
                  >
                    📝
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      Submit a Support Request
                    </h2>
                    <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>
                      We're here to help! Please provide details about your
                      issue.
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmitTicket}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
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
                    <label
                      htmlFor="category"
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1e293b",
                      }}
                    >
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        color: "#1e293b",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Issue</option>
                      <option value="billing">Billing/Fines</option>
                      <option value="book">Book Related</option>
                      <option value="reservation">Reservation Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "600",
                        color: "#1e293b",
                      }}
                    >
                      Priority *
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        color: "#1e293b",
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your issue"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      color: "#1e293b",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your issue..."
                    rows="6"
                    required
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      fontSize: "1rem",
                      color: "#1e293b",
                      resize: "vertical",
                      minHeight: "150px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#1e293b",
                    }}
                  >
                    Attachment (Optional)
                  </label>
                  <div
                    style={{
                      padding: "1rem",
                      background: "white",
                      border: "2px dashed #e2e8f0",
                      borderRadius: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                    onMouseOver={(e) =>
                      (e.target.style.borderColor = "#4f46e5")
                    }
                    onMouseOut={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    <input
                      type="file"
                      id="file-input"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      style={{ display: "none" }}
                    />
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      📎
                    </div>
                    <div style={{ color: "#64748b" }}>
                      {formData.attachment
                        ? formData.attachment.name
                        : "Click to choose file or drag and drop"}
                    </div>
                    <small
                      style={{
                        color: "#94a3b8",
                        marginTop: "0.25rem",
                        display: "block",
                      }}
                    >
                      Supported formats: JPG, PNG, PDF, DOC (Max: 5MB)
                    </small>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        category: "technical",
                        subject: "",
                        description: "",
                        priority: "medium",
                        attachment: null,
                      })
                    }
                    style={{
                      padding: "0.875rem 2rem",
                      background:
                        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                      color: "#475569",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.transform = "translateY(-2px)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.transform = "translateY(0)")
                    }
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "0.875rem 2rem",
                      background: loading
                        ? "#94a3b8"
                        : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      fontSize: "1rem",
                      boxShadow: "0 4px 15px rgba(16, 185, 129, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      !loading &&
                      (e.target.style.transform = "translateY(-2px)")
                    }
                    onMouseOut={(e) =>
                      !loading && (e.target.style.transform = "translateY(0)")
                    }
                  >
                    {loading ? "Submitting..." : "Submit Ticket"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Tickets Card */}
          {activeTab === "my-tickets" && (
            <div
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(226, 232, 240, 0.6)",
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    📋
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      My Support Tickets
                    </h2>
                    <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>
                      Track all your support requests and their status
                    </p>
                  </div>
                </div>
              </div>

              {tickets.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    background:
                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    borderRadius: "16px",
                    border: "2px dashed #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      opacity: 0.5,
                    }}
                  >
                    📋
                  </div>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      color: "#64748b",
                      marginBottom: "1.5rem",
                    }}
                  >
                    You haven't submitted any support tickets yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("new-ticket")}
                    style={{
                      padding: "0.875rem 2rem",
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "1rem",
                      boxShadow: "0 4px 15px rgba(79, 70, 229, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.transform = "translateY(-2px)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.transform = "translateY(0)")
                    }
                  >
                    Submit Your First Ticket
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      style={{
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.transform = "translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.transform = "translateY(0)")
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "1rem",
                              fontWeight: "600",
                            }}
                          >
                            {ticket.id.slice(-3)}
                          </div>
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <span
                                style={{
                                  color: "#64748b",
                                  fontSize: "0.875rem",
                                }}
                              >
                                Ticket ID:
                              </span>
                              <span
                                style={{ fontWeight: "600", color: "#1e293b" }}
                              >
                                {ticket.id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "0.5rem 1rem",
                            background:
                              ticket.status === "open"
                                ? "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)"
                                : "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                            color:
                              ticket.status === "open" ? "#1e40af" : "#065f46",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            border: "1px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          {ticket.status.toUpperCase()}
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <h3
                          style={{
                            margin: "0 0 0.5rem 0",
                            color: "#1e293b",
                            fontSize: "1.125rem",
                          }}
                        >
                          {ticket.subject}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            gap: "1.5rem",
                            color: "#64748b",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span>
                            <strong>Category:</strong> {ticket.category}
                          </span>
                          <span>
                            <strong>Created:</strong> {ticket.createdAt}
                          </span>
                          <span>
                            <strong>Last Updated:</strong> {ticket.lastUpdated}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                          style={{
                            padding: "0.5rem 1rem",
                            background:
                              "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                            color: "#4f46e5",
                            border: "1px solid #4f46e5",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.transform = "translateY(-2px)")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.transform = "translateY(0)")
                          }
                        >
                          View Details
                        </button>
                        <button
                          style={{
                            padding: "0.5rem 1rem",
                            background:
                              "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                            color: "#475569",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            transition: "all 0.3s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.target.style.transform = "translateY(-2px)")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.transform = "translateY(0)")
                          }
                        >
                          Add Comment
                        </button>
                        {ticket.status === "open" && (
                          <button
                            style={{
                              padding: "0.5rem 1rem",
                              background:
                                "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              boxShadow: "0 2px 10px rgba(239, 68, 68, 0.2)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.transform = "translateY(-2px)")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.transform = "translateY(0)")
                            }
                          >
                            Close Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FAQ Card */}
          {activeTab === "faq" && (
            <div
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(226, 232, 240, 0.6)",
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background:
                        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    ❓
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      Frequently Asked Questions
                    </h2>
                    <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>
                      Find quick answers to common questions
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div
                style={{
                  display: "flex",
                  marginBottom: "2rem",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  style={{
                    flex: 1,
                    padding: "0.875rem 1rem",
                    border: "none",
                    fontSize: "1rem",
                    color: "#1e293b",
                    outline: "none",
                    background: "transparent",
                  }}
                />
                <button
                  style={{
                    padding: "0.875rem 1.5rem",
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  🔍
                </button>
              </div>

              {/* FAQ Items */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    style={{
                      background:
                        expandedFaq === faq.id
                          ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                          : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      borderRadius: "16px",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1.25rem 1.5rem",
                        cursor: "pointer",
                        background:
                          expandedFaq === faq.id
                            ? "rgba(14, 165, 233, 0.1)"
                            : "transparent",
                      }}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "1.125rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            width: "24px",
                            height: "24px",
                            background:
                              "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                          }}
                        >
                          Q{faq.id}
                        </span>
                        {faq.question}
                      </h3>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748b",
                          transition: "transform 0.3s ease",
                          transform:
                            expandedFaq === faq.id ? "rotate(180deg)" : "none",
                        }}
                      >
                        ▼
                      </div>
                    </div>
                    {expandedFaq === faq.id && (
                      <div
                        style={{
                          padding: "1.25rem 1.5rem",
                          borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                          background: "white",
                          animation: "slideDown 0.3s ease",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            color: "#475569",
                            lineHeight: "1.6",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                          }}
                        >
                          <span
                            style={{
                              width: "24px",
                              height: "24px",
                              background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              flexShrink: 0,
                            }}
                          >
                            A
                          </span>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* FAQ Footer */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                <p style={{ marginBottom: "1.5rem", color: "#64748b" }}>
                  Didn't find your answer?
                </p>
                <button
                  onClick={() => setActiveTab("new-ticket")}
                  style={{
                    padding: "0.875rem 2rem",
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "1rem",
                    boxShadow: "0 4px 15px rgba(79, 70, 229, 0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.transform = "translateY(0)")
                  }
                >
                  Submit a Question
                </button>
              </div>
            </div>
          )}

          {/* Contact Card */}
          {activeTab === "contact" && (
            <div
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: "1px solid rgba(226, 232, 240, 0.6)",
              }}
            >
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background:
                        "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    📞
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "#1e293b",
                      }}
                    >
                      Contact Support
                    </h2>
                    <p style={{ margin: "0.25rem 0 0 0", color: "#64748b" }}>
                      Reach out to us through multiple channels
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                {[
                  {
                    icon: "📧",
                    title: "Email Support",
                    desc: "support@librarysystem.edu",
                    time: "Response: Within 24 hours",
                    color: "#0ea5e9",
                  },
                  {
                    icon: "📞",
                    title: "Phone Support",
                    desc: "+91-XXX-XXX-XXXX",
                    time: "Mon-Fri: 9 AM - 6 PM",
                    color: "#10b981",
                  },
                  {
                    icon: "💬",
                    title: "Live Chat",
                    desc: "Available now",
                    time: "Instant response",
                    color: "#8b5cf6",
                  },
                  {
                    icon: "📍",
                    title: "Visit Us",
                    desc: "Library Building, Room 101",
                    time: "University Campus",
                    color: "#f59e0b",
                  },
                ].map((method, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.transform = "translateY(-5px)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        background: `linear-gradient(135deg, ${method.color} 0%, ${method.color}80 100%)`,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "2rem",
                        margin: "0 auto 1rem",
                      }}
                    >
                      {method.icon}
                    </div>
                    <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e293b" }}>
                      {method.title}
                    </h3>
                    <p style={{ margin: "0 0 0.5rem 0", color: "#475569" }}>
                      {method.desc}
                    </p>
                    <p
                      style={{
                        margin: "0 0 1rem 0",
                        color: "#64748b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {method.time}
                    </p>
                    <button
                      style={{
                        padding: "0.75rem 1.5rem",
                        background: `linear-gradient(135deg, ${method.color} 0%, ${method.color}80 100%)`,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    >
                      {method.title.includes("Email")
                        ? "Send Email"
                        : method.title.includes("Phone")
                          ? "Call Now"
                          : method.title.includes("Chat")
                            ? "Start Chat"
                            : "View on Map"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Support Hours Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  border: "1px solid rgba(202, 138, 4, 0.2)",
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                    color: "#713f12",
                    fontSize: "1.125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>⏰</span> Library Support Hours
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  {[
                    { day: "Monday-Friday", time: "9:00 AM - 6:00 PM" },
                    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
                    { day: "Sunday", time: "Closed" },
                    { day: "Emergency Support", time: "24/7 via email" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(202, 138, 4, 0.1)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#713f12",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.day}
                      </div>
                      <div
                        style={{
                          color: "#a16207",
                          fontSize: "0.875rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          padding: "1.5rem 2rem",
          marginTop: "3rem",
          borderTop: "1px solid rgba(226, 232, 240, 0.8)",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem" }}>
            Library Support Center • Need immediate help? Call: +91-XXX-XXX-XXXX
          </p>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            <Link
              to="/dashboard"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                margin: "0 0.5rem",
              }}
            >
              Return to Dashboard
            </Link>
            •
            <Link
              to="/privacy"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                margin: "0 0.5rem",
              }}
            >
              Privacy Policy
            </Link>
            •
            <Link
              to="/terms"
              style={{
                color: "#4f46e5",
                textDecoration: "none",
                margin: "0 0.5rem",
              }}
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Support;
