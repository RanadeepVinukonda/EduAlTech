import express from "express";
import multer from "multer";
import { addLecture, getMyLectures ,getAllLectures,deleteLecture} from "../controllers/lectureController.js";
import { protectRoute, authorizeRoles,authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  authMiddleware,
  authorizeRoles("provider", "admin"),
  upload.fields([{ name: "thumbnail" }, { name: "video" }]),
  addLecture
);
router.get(
  "/mylectures",
  authMiddleware,
  authorizeRoles("provider"),
  getMyLectures
);
router.get(
  "/all",
  authMiddleware,
  authorizeRoles("seeker", "admin"),
  getAllLectures
);
router.delete("/:id", authMiddleware, authorizeRoles("admin","provider"), deleteLecture);

export default router;
