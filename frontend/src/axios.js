import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://edualtech.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ makes browser send cookies with every request
});

export default api;
