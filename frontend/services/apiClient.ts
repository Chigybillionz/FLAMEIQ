import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Synchronized key name with AuthProvider
      const token = localStorage.getItem("flameiq_token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("flameiq_token");
      localStorage.removeItem("user");
      // Optional: Emit event or rely on AuthProvider to route to /login
    }

    return Promise.reject({
      message: error.response?.data?.message || "An unexpected error occurred",
      status: status,
      raw: error,
    });
  }
);

export default apiClient;