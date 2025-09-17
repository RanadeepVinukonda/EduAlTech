import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/usermodel.js";
import Lecture from "../models/lecturemodel.js";

// Get token from cookie or header
const getToken = (req) => {
  if (req.cookies?.jwt) return req.cookies.jwt;
  if (req.headers.authorization?.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

// Protect route
export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Check cookies first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // Or Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Not authorized" });
  }
};

// Role-based access
export const authorizeRoles =
  (...roles) =>
  async (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No user in request" });

    const userRole = String(req.user.role).trim().toLowerCase();
    const allowedRoles = roles.map((r) => String(r).trim().toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({
          error: `Access denied: your role '${userRole}' is not allowed`,
        });
    }

    // Only providers can delete their own lectures
    if (req.method === "DELETE" && userRole === "provider") {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ error: "Invalid lecture ID" });

      const lecture = await Lecture.findById(id);
      if (!lecture) return res.status(404).json({ error: "Lecture not found" });

      if (lecture.uploadedBy?.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ error: "You can only delete your own lectures" });
      }
    }

    next();
  };
