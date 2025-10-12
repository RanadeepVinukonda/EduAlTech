// Navbar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-primary font-bold text-2xl">
            EduAltTech
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-gray-700"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-gray-700"
                }`
              }
            >
              Courses
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-gray-700"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-gray-700"
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {user.role === "provider" && (
                  <NavLink
                    to="/my-lectures"
                    className={({ isActive }) =>
                      `hover:text-primary ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`
                    }
                  >
                    My Lectures
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `hover:text-primary ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-gray-700"
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `hover:text-primary ${
                      isActive ? "text-primary font-semibold" : "text-gray-700"
                    }`
                  }
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline btn-primary ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-sm btn-primary">
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
