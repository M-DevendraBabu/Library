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
            Borrow books, track inventory, and manage accounts seamlessly in one powerful system.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              Why Choose LibraFlow?
            </h2>
            <p style={{ color: "#64748B" }}>
              Powerful features for everyone.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-card">
              <div className="feature-card-decoration"></div>
              <div className="feature-icon-box">
                <UserCheck size={32} />
              </div>
              <h3>User Management</h3>
              <p>
                Manage students and staff with ease. Track user activity and streamline onboarding with intuitive controls.
              </p>
              <span className="feature-badge">Easy Setup</span>
            </div>

            <div className="feature-card">
              <div className="feature-card-decoration"></div>
              <div className="feature-icon-box">
                <Search size={32} />
              </div>
              <h3>Digital Catalog</h3>
              <p>
                Search and manage books in real time. Advanced filtering and instant availability checks at your fingertips.
              </p>
              <span className="feature-badge">Real-time Search</span>
            </div>

            <div className="feature-card">
              <div className="feature-card-decoration"></div>
              <div className="feature-icon-box">
                <Shield size={32} />
              </div>
              <h3>Secure Access</h3>
              <p>
                Role-based authentication ensures data security. Protect sensitive information with granular permissions.
              </p>
              <span className="feature-badge">Enterprise Security</span>
            </div>
          </div>

          {/* CTA Banner */}
          <div
            style={{
              textAlign: "center",
              marginTop: "4rem",
              padding: "3rem",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Ready to Transform Your Library?
            </h3>
            <p
              style={{
                color: "#64748B",
                fontSize: "1.125rem",
                maxWidth: "600px",
                margin: "0 auto 2rem",
              }}
            >
              Join hundreds of institutions already using LibraFlow to manage their libraries efficiently.
            </p>
            <Link
              to="/register"
              className="btn btn-primary btn-tilt"
              style={{
                fontSize: "1.125rem",
                padding: "0.875rem 2.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              Start Free Trial <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
