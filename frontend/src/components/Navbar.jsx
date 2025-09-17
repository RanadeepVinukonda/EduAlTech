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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-green-600 font-bold text-2xl">
            EduAltTech
          </Link>

          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
              }
            >
              Courses
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
              }
            >
              Contact
            </NavLink>

            {user ? (
              <>
                {user.role === "provider" && (
                  <NavLink
                    to="/my-lectures"
                    className={({ isActive }) =>
                      `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
                    }
                  >
                    My Lectures
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
                    }
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `hover:text-green-600 ${isActive ? "text-green-600" : ""}`
                  }
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline btn-success"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-sm btn-success">
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="btn btn-sm btn-outline btn-success"
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
