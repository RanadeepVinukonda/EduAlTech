import { v2 as cloudinary } from "cloudinary";
import Lecture from "../models/lecturemodel.js";
import mongoose from "mongoose";

// Add Lecture (Provider/Admin)
export const addLecture = async (req, res) => {
  try {
    const { title, description, category, classLevel, subject, course } =
      req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];
    const materialFiles = req.files?.materials || [];

    if (!title || !category || !videoFile || !thumbnailFile)
      return res
        .status(400)
        .json({ error: "Title, category, video, and thumbnail are required" });

    // Helper for uploading to Cloudinary
    const uploadToCloudinary = (file, folder, resource_type = "image") => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type },
          (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    };

    const thumbnailUrl = await uploadToCloudinary(
      thumbnailFile,
      "lectures/thumbnails"
    );
    const videoUrl = await uploadToCloudinary(
      videoFile,
      "lectures/videos",
      "video"
    );

    const materials = await Promise.all(
      materialFiles.map(async (file) => ({
        title: file.originalname,
        fileUrl: await uploadToCloudinary(file, "lectures/materials", "raw"),
        type: file.mimetype.split("/")[1],
      }))
    );

    const lecture = await Lecture.create({
      title,
      description,
      category,
      classLevel: category === "Edu" ? classLevel : undefined,
      subject: category === "Edu" ? subject : undefined,
      course: category === "Edu" ? course : undefined,
      thumbnailUrl,
      videoUrl,
      uploadedBy: req.user._id,
      materials,
    });

    res.status(201).json({ message: "Lecture uploaded", lecture });
  } catch (err) {
    console.error("Error uploading lecture:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all lectures visible to everyone
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
  } catch (err) {
    console.error("Error fetching lectures:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Watch lecture by ID - requires login
export const getLectureById = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ error: "Login required to watch lecture" });

  try {
    const lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!lecture) return res.status(404).json({ error: "Lecture not found" });
    res.status(200).json(lecture);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get frequently viewed lectures
export const getFrequentlyViewed = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .sort({ views: -1 })
      .limit(5)
      .populate("uploadedBy", "fullName");
    res.status(200).json(lectures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get popular courses
export const getPopularCourses = async (req, res) => {
  try {
    const lectures = await Lecture.find()
      .sort({ enrollments: -1 })
      .limit(5)
      .populate("uploadedBy", "fullName");
    res.status(200).json(lectures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Provider/Admin - get own lectures
export const getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ uploadedBy: req.user._id }).populate(
      "uploadedBy",
      "fullName"
    );
    res.status(200).json(lectures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete lecture
export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid lecture ID" });

    const lecture = await Lecture.findById(id);
    if (!lecture) return res.status(404).json({ error: "Lecture not found" });

    await Lecture.findByIdAndDelete(id);
    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
