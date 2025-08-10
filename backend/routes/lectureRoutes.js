import express from "express";
import multer from "multer";
import {
  addLecture,
  getMyLectures,
  getAllLectures,
  deleteLecture,
  getLectureById,
} from "../controllers/lecturecontroller.js";

import { authMiddleware, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, 
  },
});


router.post(
  "/upload",
  authMiddleware,
  authorizeRoles("provider", "admin"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "materials", maxCount: 10 },
  ]),
  addLecture
);


router.get(
  "/mylectures",
  authMiddleware,
  authorizeRoles("provider"),
  getMyLectures
);

router.get(
  "/lecture/:id",
  authMiddleware,
  getLectureById
);

router.get(
  "/all",
  authMiddleware,
  authorizeRoles("seeker", "admin"),
  getAllLectures
);


router.delete(
  "/delete/:id",
  deleteLecture
);

export default router;
