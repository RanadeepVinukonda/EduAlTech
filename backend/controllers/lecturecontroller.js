import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/lecturemodel.js";



export const addLecture = async (req, res) => {
  console.log("🟢 [addLecture] Request received");
  try {
    const { title, description, category, classLevel, subject, course } =
      req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];
    const materialFiles = req.files?.materials || [];

    console.log("📋 Body:", req.body);
    console.log(
      "🖼️ Thumbnail File:",
      thumbnailFile?.originalname || "Not Provided"
    );
    console.log("🎥 Video File:", videoFile?.originalname || "Not Provided");
    console.log(
      "📎 Material Files:",
      materialFiles.map((f) => f.originalname)
    );

    if (!title || !category || !videoFile || !thumbnailFile) {
      return res
        .status(400)
        .json({ error: "Title, category, video, and thumbnail are required" });
    }

    // Upload thumbnail
    let thumbnailUpload;
    try {
      thumbnailUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lectures/thumbnails" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          }
        );
        stream.end(thumbnailFile.buffer);
      });
      console.log("✅ Thumbnail uploaded:", thumbnailUpload);
    } catch (err) {
      console.error("❌ Thumbnail upload error:", err);
      return res.status(500).json({ error: "Thumbnail upload failed" });
    }

    // Upload video
    let videoUpload;
    try {
      videoUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lectures/videos", resource_type: "video" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          }
        );
        stream.end(videoFile.buffer);
      });
      console.log("✅ Video uploaded:", videoUpload);
    } catch (err) {
      console.error("❌ Video upload error:", err);
      return res.status(500).json({ error: "Video upload failed" });
    }

    // Upload materials
    let materialUploads = [];
    try {
      materialUploads = await Promise.all(
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
      console.log(
        "✅ Materials uploaded:",
        materialUploads.map((m) => m.title)
      );
    } catch (err) {
      console.error("❌ Material upload error:", err);
      return res.status(500).json({ error: "Material upload failed" });
    }

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
    console.log("📦 Lecture saved:", lecture._id);

    res.status(201).json({ message: "Lecture uploaded", lecture });
  } catch (error) {
    console.error("🔥 Unexpected server error in addLecture:", error);
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid lecture ID" });
    }

    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Optional: provider-specific check (if not in middleware)
    if (
      req.user.role === "provider" &&
      lecture.uploadedBy?.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this lecture" });
    }

    await Lecture.findByIdAndDelete(id);
    res.json({ message: "Lecture deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteLecture:", err);
    res.status(500).json({
      error: err.message || "Internal server error",
      stack: err.stack, // include this temporarily for debugging
    });
  }
};
