// routes/adminRoutes.js
import express from "express";
import { protectRoute, authorizeRoles } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  deleteLecture,
} from "../controllers/adminControllers.js";

const router = express.Router();


router.get("/users", authorizeRoles("provider", "admin"),protectRoute,getAllUsers);
router.delete("/user/:id", authorizeRoles("provider", "admin"), protectRoute,deleteUser);
router.delete("/lecture/:id", authorizeRoles("provider", "admin"), protectRoute,deleteLecture);

export default router;
