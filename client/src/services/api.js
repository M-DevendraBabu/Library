import axios from "axios";

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — force logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/update-profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// ─── Books ────────────────────────────────────────────────────────────────────
export const booksAPI = {
  getAll: (params) => api.get("/books", { params }),
  getFeatured: () => api.get("/books/featured"),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post("/books", data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactionsAPI = {
  getMy: (params) => api.get("/transactions/my", { params }),
  getAll: (params) => api.get("/transactions", { params }),
  getStats: () => api.get("/transactions/stats"),
  issue: (data) => api.post("/transactions/issue", data),
  return: (data) => api.post("/transactions/return", data),
  renew: (data) => api.post("/transactions/renew", data),
  reserve: (data) => api.post("/transactions/reserve", data),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getStats: () => api.get("/users/stats"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getTransactions: (id) => api.get(`/users/${id}/transactions`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: (params) => api.get("/notifications", { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all/mark"),
  delete: (id) => api.delete(`/notifications/${id}`),
  broadcast: (data) => api.post("/notifications/broadcast", data),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiAPI = {
  search: (query) => api.post("/ai/search", { query }),
  recommendations: () => api.post("/ai/recommendations"),
  chat: (message, history) => api.post("/ai/chat", { message, history }),
};

export default api;
