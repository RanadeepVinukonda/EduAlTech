import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleBasedLink = () => {
    if (user?.role === "admin")
      return { to: "/admin", label: "Admin Dashboard" };
    if (user?.role === "provider")
      return { to: "/my-lectures", label: "My Lectures" };
    return { to: "/courses", label: "Courses" };
  };

  const dynamicLink = getRoleBasedLink();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 md:px-10">
      {/* Left Logo - MP4 Video */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <video
            src="/logo.mp4"
            className="w-12 h-12 object-contain rounded-full"
            autoPlay
            loop
            muted
            playsInline
          />
          <span className="text-2xl font-extrabold text-green-700">
            EduAltTech
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className="btn btn-ghost text-green-700">
          Home
        </Link>
        <Link to="/about" className="btn btn-ghost text-green-700">
          About
        </Link>
        <Link to={dynamicLink.to} className="btn btn-ghost text-green-700">
          {dynamicLink.label}
        </Link>
        <Link to="/contact" className="btn btn-ghost text-green-700">
          Contact
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="btn btn-success btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline btn-success btn-sm">
              Signup
            </Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full border-2 border-green-500">
                <img
                  src={
                    user.profileImg ||
                    `https://placehold.co/40x40?text=${user.username}`
                  }
                  alt="Profile"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-40"
            >
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to={dynamicLink.to}>{dynamicLink.label}</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
