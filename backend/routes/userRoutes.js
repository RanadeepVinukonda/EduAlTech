import express from "express";
import {
  updateUser,
  forgotPassword,
  resetPassword,
  submitContact
} from "../controllers/userController.js";
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

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/submit", submitContact);

export default router;
