import axios from "axios";

const api = axios.create({
  baseURL: "https://walking-format-predictions-aids.trycloudflare.com/",
});

// 🔥 Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
