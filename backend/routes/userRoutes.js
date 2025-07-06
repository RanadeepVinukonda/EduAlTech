// backend/routes/userRoutes.js
import express from "express";
import { updateUser } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/update",
  protectRoute,
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  updateUser
);

export default router;
