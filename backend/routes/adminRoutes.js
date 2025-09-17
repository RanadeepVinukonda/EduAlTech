import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  deleteLecture,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/users",
  protectRoute,
  authorizeRoles("provider", "admin"),
  getAllUsers
);
router.delete(
  "/user/:id",
  protectRoute,
  authorizeRoles("provider", "admin"),
  deleteUser
);
router.delete(
  "/lecture/:id",
  protectRoute,
  authorizeRoles("provider", "admin"),
  deleteLecture
);

export default router;
