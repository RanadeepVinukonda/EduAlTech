import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // ✅ fixed here

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


export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No user found in request" });
    }

    const userRole = String(req.user.role).trim().toLowerCase();
    const allowedRoles = roles.map((role) => String(role).trim().toLowerCase());

    console.log("🟢 User role:", userRole);
    console.log("🔒 Allowed roles:", allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied: your role '${userRole}' is not in [${allowedRoles.join(
          ", "
        )}]`,
      });
    }

    next();
  };
  export const isProviderOrAdmin = (req, res, next) => {
    if (req.user?.role === "provider" || req.user?.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Access denied" });
  };

