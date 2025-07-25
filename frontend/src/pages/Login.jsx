import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) {
      navigate("/profile");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md bg-white shadow-md rounded-2xl p-6 md:p-8 space-y-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-green-600 text-center">
          Login
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input input-bordered w-full"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-between text-sm mt-1">
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        <button type="submit" className="btn btn-success w-full mt-2">
          Login
        </button>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
