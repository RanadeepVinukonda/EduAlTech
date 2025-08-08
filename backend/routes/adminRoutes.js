// routes/adminRoutes.js
import express from "express";
import { protectRoute, isProviderOrAdmin } from "../middleware/auth.js";
import {
  getAllUsers,
  deleteUser,
  deleteLecture,
} from "../controllers/adminControllers.js";

const router = express.Router();


router.get("/users", isProviderOrAdmin,protectRoute,getAllUsers);
router.delete("/user/:id", isProviderOrAdmin, protectRoute,deleteUser);
router.delete("/lecture/:id", isProviderOrAdmin, protectRoute,deleteLecture);

export default router;
