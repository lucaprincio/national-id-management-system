import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (d) => api.post("/auth/login", d),
  register: (d) => api.post("/auth/register", d),
  verifyOtp: (d) => api.post("/auth/verify-otp", d),
  setup2FA: () => api.post("/auth/setup-2fa"),
};

export const citoyenApi = {
  getAll: (s) => api.get("/citizens", { params: s ? { search: s } : {} }),
  getById: (id) => api.get(`/citizens/${id}`),
  create: (d) => api.post("/citizens", d),
  update: (id, d) => api.put(`/citizens/${id}`, d),
  delete: (id) => api.delete(`/citizens/${id}`),
};

export const demandeApi = {
  getAll: () => api.get("/requests"),
  getById: (id) => api.get(`/requests/${id}`),
  create: (d) => api.post("/requests", d),
  updateStatus: (id, d) => api.put(`/requests/${id}/status`, d),
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
};

export const verifyApi = {
  verify: (q) => api.get(`/verify/${encodeURIComponent(q)}`),
};

export const userApi = {
  getAll: () => api.get("/users"),
  create: (d) => api.post("/auth/register", d),
  toggleStatus: (id) => api.put(`/users/${id}/toggle`),
};

export default api;
