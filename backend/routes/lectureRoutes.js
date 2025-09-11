import express from "express";
import multer from "multer";
import {
  addLecture,
  getMyLectures,
  getAllLectures,
  deleteLecture,
  getLectureById,
  getFrequentlyViewed,
  getPopularCourses,
} from "../controllers/lecturecontroller.js";

import { protectRoute, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// ✅ Upload lecture (provider/admin)
router.post(
  "/upload",
  protectRoute,
  authorizeRoles("provider", "admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "materials", maxCount: 10 },
  ]),
  addLecture
);

// ✅ Get provider's own lectures
router.get(
  "/mylectures",
  protectRoute,
  authorizeRoles("provider"),
  getMyLectures
);

// ✅ Get lecture by id
router.get("/lecture/:id", protectRoute, getLectureById);

// ✅ Get all lectures (seeker/admin)
router.get(
  "/all",
  protectRoute,
  authorizeRoles("seeker", "admin"),
  getAllLectures
);

// ✅ Delete lecture (provider/admin)
router.delete(
  "/delete/:id",
  protectRoute,
  authorizeRoles("admin", "provider"),
  deleteLecture
);

// Public routes
router.get("/frequently-viewed", getFrequentlyViewed);
router.get("/popular", getPopularCourses);

export default router;
