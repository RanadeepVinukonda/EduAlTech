import React from "react";
import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import CoursePlayer from "./pages/CoursePlayer"; // for watch now
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import MyLectures from "./pages/MyLectures"; // for provider's lectures
const App = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen flex flex-col font-sans">
      {/* Notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Navigation */}
      <Navbar />

      {/* Main Routes */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectRoute>
                <Profile />
              </ProtectRoute>
            }
          />
          <Route
            path="/updateprofile"
            element={
              <ProtectRoute>
                <UpdateProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/course/:id"
            element={
              <ProtectRoute>
                <CoursePlayer />
              </ProtectRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectRoute>
            }
          />
          <Route
            path="/my-lectures"
            element={
              <ProtectRoute role="provider">
                <MyLectures />
              </ProtectRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
