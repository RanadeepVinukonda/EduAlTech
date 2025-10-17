import { v2 as cloudinary } from "cloudinary";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendMail from "../sendMail.js";
import Contact from "../models/contactmodel.js";

// helper: upload buffer to cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

// Update user profile
export const updateUser = async (req, res) => {
  const {
    fullName,
    email,
    username,
    currentPassword,
    newPassword,
    bio,
    link,
    profileImg,
    coverImg,
  } = req.body;

  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Password update
    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Provide both current and new password" });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Incorrect current password" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Profile image
    if (req.files?.profileImg?.[0]) {
      user.profileImg = await uploadToCloudinary(
        req.files.profileImg[0].buffer,
        "profile"
      );
    } else if (profileImg?.startsWith("http")) {
      user.profileImg = profileImg;
    }

    // Cover image
    if (req.files?.coverImg?.[0]) {
      user.coverImg = await uploadToCloudinary(
        req.files.coverImg[0].buffer,
        "cover"
      );
    } else if (coverImg?.startsWith("http")) {
      user.coverImg = coverImg;
    }

    // Text updates
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();
    user.password = null; // hide password

    res.status(200).json(user);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendMail(email, "EduAltTech Password Reset", resetUrl);

    console.log(`🔗 Reset URL: ${resetUrl}`);
    res.status(200).json({ msg: "Reset link sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Failed to send reset email" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email, and message are required." });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res
      .status(201)
      .json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};