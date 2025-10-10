// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import api from "../axios"; // ✅ using your axios.js setup
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👇 This uses your axios baseURL and calls /auth/login
      const res = await api.post("/auth/login", form);

      if (res.data?.success) {
        toast.success("Login successful!");
        navigate("/profile");
      } else {
        toast.error(res.data?.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message || "Login failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md md:max-w-lg space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-primary">Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full pr-10"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-500"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          Forgot password?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Reset Here
          </span>
        </p>
      </form>
    </div>
  );
}
