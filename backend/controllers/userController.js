// backend/controllers/userController.js
import { v2 as cloudinary } from "cloudinary";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendMail from "../lib/utils/sendMail.js"

// helper: wrap upload_stream in a Promise
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

export const updateUser = async (req, res) => {
  const {
    fullName,
    email,
    username,
    currentPassword,
    newPassword,
    bio,
    link,
    profileImg, // fallback if string url is given
    coverImg,
  } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
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

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Profile image upload
    if (req.files?.profileImg?.[0]) {
      const file = req.files.profileImg[0];
      user.profileImg = await uploadToCloudinary(file.buffer, "profile");
    } else if (profileImg?.startsWith("http")) {
      user.profileImg = profileImg;
    }

    // Cover image upload
    if (req.files?.coverImg?.[0]) {
      const file = req.files.coverImg[0];
      user.coverImg = await uploadToCloudinary(file.buffer, "cover");
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
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // valid for 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const message = `Click the link to reset your password: ${resetUrl}`;

    await sendMail(email, "EduAltTech Password Reset", message);

    res.status(200).json({ msg: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

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
    res.status(500).json({ msg: "Server Error" });
  }
};