import {v2 as cloudinary} from "cloudinary";
import Lecture from "../models/lecturemodel.js";



export const addLecture = async (req, res) => {
  try {
    const { title, description, subject } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const videoFile = req.files?.video?.[0];

    if (!title || !thumbnailFile || !videoFile) {
      return res
        .status(400)
        .json({ error: "Title, thumbnail, and video are required" });
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
      subject,
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
    const lectures = await Lecture.find({ uploadedBy: req.user._id }).populate(
      "uploadedBy",
      "fullName"
    );
    res.status(200).json(lectures);
  } catch (error) {
    console.error("Error in getMyLectures:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const getAllLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find().populate("uploadedBy", "fullName");
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

    // Check if the user is authorized to delete the lecture
    if (lecture.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "You are not authorized to delete this lecture" });
    }

    // Delete thumbnail and video from Cloudinary
    await cloudinary.uploader.destroy(lecture.thumbnailUrl, { resource_type: "image" });
    await cloudinary.uploader.destroy(lecture.videoUrl, { resource_type: "video" });

    await lecture.remove();
    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLecture:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

};
