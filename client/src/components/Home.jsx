import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  UserCheck,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import libraryBg from "../assets/library-bg.jpg";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Auth check on load
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const adminFlag = localStorage.getItem("isAdmin") === "true" || user.role === "admin";

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);
      setIsAdmin(adminFlag);
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  // Clear auth properly
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("isAdmin");
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    clearAuth();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    clearAuth();
    setIsAuthenticated(false);
    navigate("/register");
  };

  const handleLogout = () => {
    clearAuth();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div>
      <section
        className="hero"
        style={{
          backgroundImage: `url(${libraryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.35), rgba(0,0,0,0.65))",
            zIndex: 0,
          }}
        />

        {/* Top Buttons */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            display: "flex",
            gap: "1rem",
            zIndex: 2,
          }}
        >
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="btn btn-primary btn-tilt"
              >
                Logout
              </button>
              <Link
                to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                className="btn btn-primary btn-tilt"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="btn btn-primary btn-tilt"
              >
                Login
              </button>
              <button
                onClick={handleRegisterClick}
                className="btn btn-primary btn-tilt"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Hero Content */}
        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "900px",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "999px",
              padding: "6px 18px",
              width: "fit-content",
              fontSize: "14px",
              marginBottom: "1.5rem",
            }}
          >
            Next Gen Library System
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "800",
              lineHeight: "1.1",
              marginBottom: "1.2rem",
            }}
          >
            Manage Your Knowledge <br />
            <span style={{ color: "#c7d2fe" }}>Effortlessly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontSize: "1.1rem",
              maxWidth: "650px",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "2.5rem",
            }}
          >
            A unified digital library platform for students and administrators.
            Borrow books, track inventory, and manage accounts seamlessly.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" style={{ padding: "4rem 0", background: "var(--bg-color)" }}>
        <div className="container">
          <div className="grid-3">
            <div className="feature-card" style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", marginBottom: "1rem" }}>
                <UserCheck size={32} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>User Management</h3>
              <p style={{ color: "var(--text-muted)" }}>Manage students and staff easily.</p>
            </div>

            <div className="feature-card" style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9", marginBottom: "1rem" }}>
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Digital Catalog</h3>
              <p style={{ color: "var(--text-muted)" }}>Search books in real time.</p>
            </div>

            <div className="feature-card" style={{ background: "white", padding: "2rem", borderRadius: "1rem", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", marginBottom: "1rem" }}>
                <Shield size={32} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Secure Access</h3>
              <p style={{ color: "var(--text-muted)" }}>Role-based secure access.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
