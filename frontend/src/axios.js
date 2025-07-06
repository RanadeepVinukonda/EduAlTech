import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://edualtech.onrender.com/api" // ⬅️ use local backend when developing
    : "/api"; // ⬅️ production backend

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ makes browser send cookies with every request
});

export default api;
