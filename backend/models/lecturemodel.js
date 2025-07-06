import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
    subject: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Provider" if you have a separate model
      required: true,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);
export default Lecture;
