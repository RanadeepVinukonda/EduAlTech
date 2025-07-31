import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/lecturemodel.js";

export const addLecture = async (req, res) => {
  try {
    const { title, description, category, classLevel, subject, course } =
      req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];

    if (!title || !videoFile || !thumbnailFile || !category) {
      return res.status(400).json({
        error: "Title, category, video, and thumbnail are required",
      });
    }

    // Upload thumbnail
    const thumbnailUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "lectures/thumbnails" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(thumbnailFile.buffer);
    });

    // Upload video
    const videoUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "lectures/videos", resource_type: "video" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        }
      );
      stream.end(videoFile.buffer);
    });

    const lecture = new Lecture({
      title,
      description,
      category,
      classLevel: category === "Edu" ? classLevel : undefined,
      subject: category === "Edu" ? subject : undefined,
      course: category === "Edu" ? course : undefined,
      thumbnailUrl: thumbnailUpload,
      videoUrl: videoUpload,
      uploadedBy: req.user._id,
    });

    await lecture.save();

    res.status(201).json({ message: "Lecture uploaded", lecture });
  } catch (error) {
    console.error("Error in addLecture:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({
      uploadedBy: req.user._id,
    }).populate("uploadedBy", "fullName");
    res.status(200).json(lectures);
  } catch (error) {
    console.error("Error in getMyLectures:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllLectures = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.classLevel) filter.classLevel = req.query.classLevel;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.course) filter.course = req.query.course;

    const lectures = await Lecture.find(filter).populate(
      "uploadedBy",
      "fullName"
    );
    res.status(200).json(lectures);
  } catch (error) {
    console.error("Error in getAllLectures:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Only admin or the uploader can delete
    if (
      lecture.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete from Cloudinary (optional: add public_id tracking)
    await cloudinary.uploader.destroy(lecture.thumbnailUrl, {
      resource_type: "image",
    });
    await cloudinary.uploader.destroy(lecture.videoUrl, {
      resource_type: "video",
    });

    await lecture.remove();

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLecture:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
