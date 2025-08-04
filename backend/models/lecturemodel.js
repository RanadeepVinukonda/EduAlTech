import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: { type: String, required: true },
    thumbnailUrl: String,
    materials: [
      {
        title: String,
        fileUrl: String,
        type: String, // "pdf", "doc", "zip"
      },
    ],

    category: {
      type: String,
      enum: ["Edu", "AltEdu"],
      required: true,
    },

    // For Edu category
    classLevel: String,
    subject: String,
    course: String,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
