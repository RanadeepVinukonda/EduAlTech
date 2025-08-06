import express from "express";
import multer from "multer";
import {
  addLecture,
  getMyLectures,
  getAllLectures,
  deleteLecture,
} from "../controllers/lecturecontroller.js";

import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});


// Upload a lecture (Edu or AltEdu)
router.post(
  "/upload",
  authMiddleware,
  authorizeRoles("provider", "admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "materials", maxCount: 5 }, // Allow multiple
  ]),
  addLecture
);

// Get all lectures uploaded by the logged-in provider
router.get(
  "/mylectures",
  authMiddleware,
  authorizeRoles("provider"),
  getMyLectures
);

// Get all lectures (seeker or admin access)
router.get(
  "/all",
  authMiddleware,
  authorizeRoles("seeker", "admin"),
  getAllLectures
);


router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "provider"),
  deleteLecture
);

export default router;
