import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import api from "../axios"; // Adjust the path as necessary
import { toast } from "react-hot-toast";

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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form, {
        withCredentials: true,
      });
      toast.success("Signup successful! Logging you in...");

      // Auto-login after signup
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Sign Up
        </h2>

        {/* Input fields */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

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

        <button type="submit" className="btn btn-success w-full">
          Sign Up
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
