import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/lecturemodel.js";

// Upload Lecture with materials
export const addLecture = async (req, res) => {
  try {
    const { title, description, category, classLevel, subject, course } =
      req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];
    const materialFiles = req.files?.materials || [];

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

    // Upload materials
    const materialUploads = await Promise.all(
      materialFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "lectures/materials",
              resource_type: "raw",
            },
            (err, result) => {
              if (err) return reject(err);
              resolve({
                title: file.originalname,
                fileUrl: result.secure_url,
                type: file.mimetype.split("/")[1],
              });
            }
          );
          stream.end(file.buffer);
        });
      })
    );

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
      materials: materialUploads,
    });

    await lecture.save();

    res.status(201).json({ message: "Lecture uploaded", lecture });
  } catch (error) {
    console.error("Error in addLecture:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all lectures by provider
export const getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ uploadedBy: req.user._id }).populate(
      "uploadedBy",
      "fullName"
    );
    res.status(200).json(lectures);
  } catch (error) {
    console.error("Error in getMyLectures:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all lectures (filterable)
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

// Get one lecture by ID (used in CoursePlayer)
export const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }
    res.status(200).json(lecture);
  } catch (error) {
    console.error("Error in getLectureById:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete lecture and cloudinary files
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    if (
      lecture.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete media from Cloudinary
    await cloudinary.uploader.destroy(lecture.thumbnailUrl, {
      resource_type: "image",
    });

    await cloudinary.uploader.destroy(lecture.videoUrl, {
      resource_type: "video",
    });

    // Delete each material
    if (lecture.materials && lecture.materials.length > 0) {
      for (let material of lecture.materials) {
        await cloudinary.uploader.destroy(material.fileUrl, {
          resource_type: "raw",
        });
      }
    }

    await lecture.remove();

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLecture:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
