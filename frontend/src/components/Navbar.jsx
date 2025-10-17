// Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
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
            EduAlTech
          </Link>

          {/* Links + Auth */}
          <div className="flex items-center space-x-6">
            {/* Main Links */}
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

            {/* Spacer */}
            <div className="border-l border-gray-300 h-6 mx-3"></div>

            {/* Auth Buttons / Profile */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Provider/Admin Links */}
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

                {/* Profile Dropdown */}
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          user.profileImg ||
                          `https://placehold.co/120x120?text=${user.username}`
                        }
                        alt="Profile"
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-40"
                  >
                    <li>
                      <NavLink to="/profile">Profile</NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink to="/login" className="btn btn-sm btn-primary">
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="btn btn-sm btn-outline btn-primary"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
