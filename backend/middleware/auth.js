import User from "../models/usermodel.js";
import Lecture from "../models/lecturemodel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// ---------------- AUTH MIDDLEWARE ----------------
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ---------------- ROLE AUTHORIZATION ----------------
export const authorizeRoles =
  (...roles) =>
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No user found in request" });
      }

      const userRole = String(req.user.role).trim().toLowerCase();
      const allowedRoles = roles.map((role) =>
        String(role).trim().toLowerCase()
      );

      console.log("🟢 User role:", userRole);
      console.log("🔒 Allowed roles:", allowedRoles);

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: `Access denied: your role '${userRole}' is not in [${allowedRoles.join(
            ", "
          )}]`,
        });
      }

      // ✅ Provider ownership check for all deletes (course or lecture)
      if (req.method === "DELETE" && userRole === "provider") {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid lecture ID" });
        }

        const lecture = await Lecture.findById(id);
        if (!lecture) {
          return res.status(404).json({ error: "Lecture not found" });
        }

        if (lecture.uploadedBy?.toString() !== req.user._id.toString()) {
          return res
            .status(403)
            .json({ error: "You can only delete your own lectures/courses" });
        }
      }

      next();
    } catch (err) {
      console.error("❌ authorizeRoles error:", err);
      res.status(500).json({ error: "Internal server error in role check" });
    }
  };
