import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  type: String,
});

const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, enum: ["Edu", "AltEdu"], required: true },
    classLevel: String,
    subject: String,
    course: String,
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    materials: [materialSchema], 
  },
  { timestamps: true }
);

export default mongoose.model("Lecture", lectureSchema);
