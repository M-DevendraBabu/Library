import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import libraryBg from "../assets/login-bg.jpg";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(formData.email, formData.password);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", user.role || role);
      localStorage.setItem("isAdmin", user.role === "admin" ? "true" : "false");

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${libraryBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "12%",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: "#fff",
            width: "420px",
            padding: "2.5rem",
            borderRadius: "1rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {role === "admin" ? "Admin Portal" : "Welcome Back"}
          </h2>
          <p style={{ color: "#64748B", marginBottom: "1.5rem" }}>
            {role === "admin"
              ? "Access library controls"
              : "Access your digital library"}
          </p>

          {/* Role Toggle */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              {
                label: "Student",
                value: "user",
                icon: <GraduationCap size={18} />,
              },
              { label: "Admin", value: "admin", icon: <Shield size={18} /> },
            ].map((r) => (
              <div
                key={r.value}
                onClick={() => {
                  setRole(r.value);
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "0.6rem",
                  border:
                    role === r.value
                      ? "1px solid #4F46E5"
                      : "1px solid #E2E8F0",
                  background: role === r.value ? "#EEF2FF" : "#FFF",
                  color: role === r.value ? "#4F46E5" : "#000",
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {r.icon} {r.label}
              </div>
            ))}
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
                  borderRadius: "0.6rem",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapper}>
              <Mail style={inputIcon} size={18} />
              <input
                type="email"
                name="email"
                placeholder={
                  role === "admin" ? "admin@library.com" : "student@college.edu"
                }
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <label style={labelStyle}>Password</label>
            <div style={{ ...inputWrapper, marginBottom: "1.2rem" }}>
              <Lock style={inputIcon} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ ...inputStyle, paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button disabled={isLoading} style={loginBtn}>
              {isLoading
                ? "Logging in..."
                : `Login as ${role === "admin" ? "Admin" : "Student"}`}
              <ArrowRight size={18} />
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              color: "#64748B",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link style={{ color: "#4F46E5", fontWeight: 600 }} to="/register">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

/* 🔹 Internal Style Objects */
const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: 600,
  marginBottom: "0.3rem",
  display: "block",
};

const inputWrapper = {
  position: "relative",
  marginBottom: "1rem",
};

const inputIcon = {
  position: "absolute",
  left: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748B",
};

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  paddingLeft: "3rem",
  borderRadius: "0.6rem",
  border: "1px solid #E2E8F0",
  fontSize: "0.95rem",
};

const eyeBtn = {
  position: "absolute",
  right: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#64748B",
};

const loginBtn = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "0.6rem",
  background: "#4F46E5",
  color: "#FFF",
  border: "none",
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  gap: "0.5rem",
};

export default Login;
