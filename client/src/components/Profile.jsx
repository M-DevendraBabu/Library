import React, { useState, useEffect } from "react";
import { authAPI } from "../services/api";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    membershipId: "LIB-2024-7890",
    membershipType: "Premium",
    membershipExpiry: "2024-12-31",
    joinDate: "2022-06-15",
    gender: "male",
    profileImage: "",
    address: "123 Library Street, Bookville, BV 12345",
    readingPreferences: ["Fiction", "Science", "History", "Biography"],
    favoriteGenres: ["Mystery", "Sci-Fi", "Historical Fiction"],
    currentlyReading: "The Silent Patient",
    booksBorrowed: 42,
    booksReserved: 3,
  });

  // Local gender-based avatars
  const genderAvatars = {
    male: "👨",
    female: "👩",
  };

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUserData((prev) => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
          membershipType: u.role === "admin" ? "Admin" : "Premium",
          profileImage: genderAvatars[prev.gender],
        }));
      } catch (e) {}
    }
    authAPI
      .getMe()
      .then((res) => {
        if (res.data?.user) {
          const u = res.data.user;
          setUserData((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            membershipType: u.role === "admin" ? "Admin" : "Premium",
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleGenderChange = (gender) => {
    // Update gender and profile image
    setUserData((prev) => ({
      ...prev,
      gender: gender,
      profileImage: genderAvatars[gender],
    }));
  };

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: "",
    securityQuestion: "What is your mother's maiden name?",
    securityAnswer: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    setLoading(true);
    authAPI
      .updateProfile({ name: userData.name, phone: userData.phone })
      .then((res) => {
        if (res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        setMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Profile updated!",
        });
      })
      .finally(() => {
        setLoading(false);
        setIsEditing(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      });
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword) {
      setMessage({
        type: "error",
        text: "Please enter your current password",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    setLoading(true);
    authAPI
      .changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      .then(() => {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setMessage({
          type: "success",
          text: "Password changed successfully!",
        });
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to update password",
        });
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      });
  };

  const handleForgotPasswordSubmit = () => {
    if (!forgotPasswordForm.email) {
      setMessage({
        type: "error",
        text: "Please enter your email address",
      });
      return;
    }

    if (!forgotPasswordForm.securityAnswer) {
      setMessage({
        type: "error",
        text: "Please answer the security question",
      });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setForgotPasswordForm({
        email: "",
        securityQuestion: "What is your mother's maiden name?",
        securityAnswer: "",
      });
      setShowForgotPassword(false);
      setMessage({
        type: "success",
        text: "Password reset link sent to your email!",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }, 1500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get gender icon
  const getGenderIcon = () => {
    return userData.gender === "female" ? "👩" : "👨";
  };

  // Get gender display text
  const getGenderDisplayText = () => {
    return userData.gender === "female" ? "Female" : "Male";
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "activity", label: "Activity", icon: "📊" },
  ];

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
      overflow-x: hidden;
    }

    .profile-page {
      min-height: 100vh;
      padding: 20px;
      position: relative;
    }

    /* Background Decorative Elements */
    .background-elements {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    }

    .bg-circle:nth-child(1) {
      width: 300px;
      height: 300px;
      top: -100px;
      right: -100px;
    }

    .bg-circle:nth-child(2) {
      width: 200px;
      height: 200px;
      bottom: -50px;
      left: -50px;
    }

    .bg-circle:nth-child(3) {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 10%;
    }

    /* Main Container */
    .main-container {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* Header */
    .page-header {
      text-align: center;
      margin-bottom: 40px;
      padding-top: 20px;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-header p {
      font-size: 1.1rem;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Tabs */
    .tabs-container {
      background: white;
      border-radius: 20px;
      padding: 10px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      display: flex;
      overflow-x: auto;
    }

    .tab-item {
      flex: 1;
      padding: 16px 24px;
      text-align: center;
      cursor: pointer;
      border-radius: 15px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 140px;
    }

    .tab-item:hover {
      background: #f8fafc;
      transform: translateY(-2px);
    }

    .tab-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
      transform: translateY(-2px);
    }

    .tab-icon {
      font-size: 24px;
      margin-bottom: 5px;
    }

    .tab-label {
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* Content Area */
    .content-area {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
    }

    @media (max-width: 768px) {
      .content-area {
        grid-template-columns: 1fr;
      }
    }

    /* Sidebar Profile Card */
    .profile-sidebar {
      position: sticky;
      top: 30px;
      height: fit-content;
    }

    .profile-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      text-align: center;
      overflow: hidden;
      position: relative;
      border: 1px solid #f1f5f9;
    }

    .profile-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 0;
    }

    .profile-image-container {
      position: relative;
      z-index: 1;
      margin-bottom: 20px;
    }

    /* Profile Image Styling */
    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 5px solid white;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      background: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
      color: white;
      margin: 0 auto;
      transition: all 0.3s ease;
    }

    .gender-badge {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: white;
      color: #1e293b;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .membership-badge {
      position: absolute;
      bottom: 40px;
      right: 10px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }

    .profile-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 5px;
    }

    .profile-email {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 15px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }

    /* Main Content Cards */
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .content-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      border: 1px solid #f1f5f9;
      animation: cardAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes cardAppear {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f1f5f9;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
    }

    .card-icon {
      font-size: 24px;
      color: #667eea;
    }

    .edit-btn {
      padding: 8px 20px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .edit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #475569;
      font-size: 14px;
    }

    .form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.3s ease;
      background: #f8fafc;
      color: #1e293b;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input:disabled {
      background: #f1f5f9;
      color: #94a3b8;
      cursor: not-allowed;
    }

    /* Gender Select Styles */
    .gender-select-container {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }

    .gender-option {
      flex: 1;
      padding: 15px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .gender-option:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      background: #f8fafc;
    }

    .gender-option.selected {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.1);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .gender-icon-large {
      font-size: 40px;
      margin-bottom: 5px;
    }

    .gender-label {
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .current-gender-display {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 15px;
      background: #f8fafc;
      border-radius: 10px;
      margin-top: 5px;
      font-size: 15px;
      font-weight: 500;
    }

    /* Password Form */
    .password-form {
      max-width: 500px;
      margin: 0 auto;
    }

    .forgot-password-link {
      display: inline-block;
      margin-top: 10px;
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .forgot-password-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    /* Preferences Grid */
    .preferences-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .preference-item {
      background: #f8fafc;
      padding: 20px;
      border-radius: 15px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .preference-item:hover {
      border-color: #667eea;
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
    }

    .preference-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .preference-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 5px;
    }

    .preference-value {
      font-size: 14px;
      color: #64748b;
      line-height: 1.5;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .tag {
      padding: 6px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    /* Activity Grid */
    .activity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .activity-item {
      background: #f8fafc;
      padding: 20px;
      border-radius: 15px;
      border-left: 4px solid #667eea;
    }

    .activity-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
    }

    .activity-details {
      font-size: 14px;
      color: #64748b;
      line-height: 1.5;
    }

    /* Buttons */
    .button-group {
      display: flex;
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 14px 28px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-width: 140px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
      border: 2px solid #e2e8f0;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
      transform: translateY(-3px);
    }

    .btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    }

    .btn-success:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
    }

    /* Message Alert */
    .message-alert {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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

    .message-alert.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .message-alert.error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(5px);
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f1f5f9;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Forgot Password Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      padding: 20px;
      backdrop-filter: blur(5px);
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      animation: modalAppear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    @keyframes modalAppear {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #64748b;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .close-btn:hover {
      color: #1e293b;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-page {
        padding: 15px;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .tabs-container {
        flex-wrap: wrap;
      }

      .tab-item {
        min-width: 120px;
        padding: 12px 16px;
      }

      .content-card {
        padding: 20px;
      }

      .button-group {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }

      .modal-content {
        padding: 25px;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .preferences-grid {
        grid-template-columns: 1fr;
      }

      .activity-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  const renderProfileTab = () => (
    <div className="content-card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">👤</span>
          Personal Information
        </div>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "✕ Cancel" : "✏️ Edit Profile"}
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            className="form-input"
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Gender</label>
          {isEditing ? (
            <div className="gender-select-container">
              <div
                className={`gender-option ${userData.gender === "male" ? "selected" : ""}`}
                onClick={() => handleGenderChange("male")}
              >
                <span className="gender-icon-large">👨</span>
                <span className="gender-label">Male</span>
              </div>
              <div
                className={`gender-option ${userData.gender === "female" ? "selected" : ""}`}
                onClick={() => handleGenderChange("female")}
              >
                <span className="gender-icon-large">👩</span>
                <span className="gender-label">Female</span>
              </div>
            </div>
          ) : (
            <div className="current-gender-display">
              <span>{getGenderIcon()}</span>
              <span>{getGenderDisplayText()}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Membership ID</label>
          <input
            type="text"
            value={userData.membershipId}
            className="form-input"
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Member Since</label>
          <input
            type="text"
            value={formatDate(userData.joinDate)}
            className="form-input"
            disabled
          />
        </div>
      </div>

      {isEditing && (
        <div className="button-group">
          <button className="btn btn-success" onClick={handleSaveProfile}>
            💾 Save Changes
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(false)}
          >
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="content-card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">🔒</span>
          Account Security
        </div>
      </div>

      <div className="password-form">
        <h3 style={{ marginBottom: "25px", color: "#1e293b" }}>
          Change Password
        </h3>

        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            className="form-input"
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            className="form-input"
            placeholder="Enter new password (min. 6 characters)"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
            className="form-input"
            placeholder="Confirm new password"
          />
        </div>

        <div className="button-group">
          <button className="btn btn-success" onClick={handleChangePassword}>
            🔑 Change Password
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowForgotPassword(true)}
          >
            🔓 Forgot Password?
          </button>
        </div>

        <p style={{ marginTop: "25px", fontSize: "14px", color: "#64748b" }}>
          <strong>Password Requirements:</strong>
          <br />
          • Minimum 6 characters
          <br />
          • Use a combination of letters, numbers, and symbols
          <br />• Avoid using personal information
        </p>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="content-card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">⚙️</span>
          Reading Preferences
        </div>
      </div>

      <div className="preferences-grid">
        <div className="preference-item">
          <div className="preference-icon">📚</div>
          <div className="preference-title">Reading Categories</div>
          <div className="tag-list">
            {userData.readingPreferences.map((pref, index) => (
              <span key={index} className="tag">
                {pref}
              </span>
            ))}
          </div>
        </div>

        <div className="preference-item">
          <div className="preference-icon">❤️</div>
          <div className="preference-title">Favorite Genres</div>
          <div className="tag-list">
            {userData.favoriteGenres.map((genre, index) => (
              <span key={index} className="tag">
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="preference-item">
          <div className="preference-icon">📖</div>
          <div className="preference-title">Currently Reading</div>
          <div className="preference-value">{userData.currentlyReading}</div>
        </div>

        <div className="preference-item">
          <div className="preference-icon">👤</div>
          <div className="preference-title">Gender</div>
          <div className="preference-value">
            <strong>{getGenderDisplayText()}</strong>
            <br />
            Profile picture updated automatically
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="content-card">
      <div className="card-header">
        <div className="card-title">
          <span className="card-icon">📊</span>
          Library Activity
        </div>
      </div>

      <div className="activity-grid">
        <div className="activity-item">
          <div className="activity-title">Books Borrowed</div>
          <div className="activity-details">
            <strong style={{ fontSize: "24px", color: "#667eea" }}>
              {userData.booksBorrowed}
            </strong>
            <br />
            Total books borrowed from library
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-title">Books Reserved</div>
          <div className="activity-details">
            <strong style={{ fontSize: "24px", color: "#10b981" }}>
              {userData.booksReserved}
            </strong>
            <br />
            Currently reserved books
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-title">Member Since</div>
          <div className="activity-details">
            <strong>{formatDate(userData.joinDate)}</strong>
            <br />
            {Math.floor(
              (new Date() - new Date(userData.joinDate)) /
                (1000 * 60 * 60 * 24 * 365),
            )}{" "}
            years of membership
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-title">Gender</div>
          <div className="activity-details">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{getGenderIcon()}</span>
              <strong style={{ fontSize: "18px", color: "#764ba2" }}>
                {getGenderDisplayText()}
              </strong>
            </div>
            Profile picture changes based on gender selection
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <style>{styles}</style>

      {/* Background Decorative Elements */}
      <div className="background-elements">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>

      <div className="main-container">
        {/* Header */}
        <header className="page-header">
          <h1>My Profile</h1>
          <p>
            Manage your personal information, security settings, and reading
            preferences
          </p>
        </header>

        {/* Tabs Navigation */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* Sidebar Profile Card */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-image-container">
                <div className="profile-image">{userData.profileImage}</div>
                <div className="gender-badge">
                  <span>{getGenderIcon()}</span>
                  <span>{getGenderDisplayText()}</span>
                </div>
                <div className="membership-badge">
                  {userData.membershipType}
                </div>
              </div>
              <h2 className="profile-name">{userData.name}</h2>
              <p className="profile-email">{userData.email}</p>

              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{userData.booksBorrowed}</div>
                  <div className="stat-label">Books Read</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData.booksReserved}</div>
                  <div className="stat-label">Reserved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "preferences" && renderPreferencesTab()}
            {activeTab === "activity" && renderActivityTab()}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">🔓 Forgot Password</h2>
              <button
                className="close-btn"
                onClick={() => setShowForgotPassword(false)}
              >
                ×
              </button>
            </div>

            <p style={{ marginBottom: "25px", color: "#64748b" }}>
              Enter your email and answer the security question to reset your
              password.
            </p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={forgotPasswordForm.email}
                onChange={handleForgotPasswordChange}
                className="form-input"
                placeholder="Enter your registered email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Security Question</label>
              <input
                type="text"
                value={forgotPasswordForm.securityQuestion}
                className="form-input"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Answer</label>
              <input
                type="text"
                name="securityAnswer"
                value={forgotPasswordForm.securityAnswer}
                onChange={handleForgotPasswordChange}
                className="form-input"
                placeholder="Enter your answer"
              />
            </div>

            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={handleForgotPasswordSubmit}
              >
                🔑 Reset Password
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowForgotPassword(false)}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p style={{ color: "#64748b", fontSize: "16px" }}>
            Processing your request...
          </p>
        </div>
      )}

      {/* Message Alert */}
      {message.text && (
        <div className={`message-alert ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"}
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Profile;
