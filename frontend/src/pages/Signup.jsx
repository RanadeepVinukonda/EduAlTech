import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import api from "../axios";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "seeker",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", form, { withCredentials: true });
      toast.success("Signup successful! Logging you in...");

      const ok = await login({
        username: form.username,
        password: form.password,
      });

      if (ok) {
        navigate("/profile");
      } else {
        toast.error("Auto-login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-base-100 shadow-xl rounded-2xl p-8 w-full max-w-md md:max-w-lg space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-primary">
          Create Your Account
        </h2>

        <div className="form-control">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control relative">
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

        <div className="form-control">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="seeker">Seeker</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-primary cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
