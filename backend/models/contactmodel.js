// models/Contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
