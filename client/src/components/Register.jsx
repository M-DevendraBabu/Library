import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, GraduationCap, Shield, KeyRound, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminSecret: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (role === "admin" && !formData.adminSecret) {
      setError("Admin Secret Key is required for admin accounts");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role === "admin" ? "admin" : "user",
        adminSecret: role === "admin" ? formData.adminSecret : undefined,
      });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", user.role);
      localStorage.setItem("isAdmin", user.role === "admin" ? "true" : "false");

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage:
          "url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2400&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(15,23,42,0.65), rgba(15,23,42,0.45))",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "1.5rem",
          padding: "2rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 700 }}>
            Create Account
          </h2>
          <p style={{ color: "#64748B", marginTop: "0.4rem" }}>
            Join the library community
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            onClick={() => {
              setRole("student");
              setError("");
            }}
            style={{
              cursor: "pointer",
              padding: "1rem",
              borderRadius: "0.75rem",
              border:
                role === "student" ? "2px solid #6366F1" : "1px solid #E5E7EB",
              background: role === "student" ? "#EEF2FF" : "#ffffff",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            <GraduationCap size={26} />
            <div style={{ marginTop: "0.4rem" }}>Student</div>
          </div>

          <div
            onClick={() => {
              setRole("admin");
              setError("");
            }}
            style={{
              cursor: "pointer",
              padding: "1rem",
              borderRadius: "0.75rem",
              border:
                role === "admin" ? "2px solid #6366F1" : "1px solid #E5E7EB",
              background: role === "admin" ? "#EEF2FF" : "#ffffff",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            <Shield size={26} />
            <div style={{ marginTop: "0.4rem" }}>Admin</div>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: "0.75rem 1rem",
                background: "#fee2e2",
                color: "#991b1b",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>Full Name</label>
            <div style={{ position: "relative", marginTop: "0.4rem" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                }}
              >
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #CBD5E1",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>Email Address</label>
            <div style={{ position: "relative", marginTop: "0.4rem" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                }}
              >
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #CBD5E1",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>Password</label>
            <div style={{ position: "relative", marginTop: "0.4rem" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                }}
              >
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #CBD5E1",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {role === "admin" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: 500, fontSize: "0.9rem", color: "#4F46E5" }}>
                Admin Secret Key
              </label>
              <div style={{ position: "relative", marginTop: "0.4rem" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6366F1",
                  }}
                >
                  <KeyRound size={18} />
                </span>
                <input
                  type="password"
                  name="adminSecret"
                  required
                  value={formData.adminSecret}
                  onChange={handleChange}
                  placeholder="Enter admin secret key"
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem 0.65rem 2.4rem",
                    borderRadius: "0.5rem",
                    border: "1.5px solid #818CF8",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.03 } : {}}
            whileTap={!isLoading ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "999px",
              border: "none",
              background: isLoading ? "#A5B4FC" : "#6366F1",
              color: "#ffffff",
              fontWeight: 600,
              marginTop: "0.5rem",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading
              ? "Creating Account..."
              : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </motion.button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.2rem",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#6366F1", fontWeight: 600 }}>
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
