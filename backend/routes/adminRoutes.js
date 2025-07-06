// routes/adminRoutes.js
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  deleteLecture,
} from "../controllers/adminControllers.js";

const router = express.Router();

// Protect & check admin
const adminOnly = [
  protectRoute,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  },
];

router.get("/users", adminOnly, getAllUsers);
router.delete("/user/:id", adminOnly, deleteUser);
router.delete("/lecture/:id", adminOnly, deleteLecture);

export default router;
