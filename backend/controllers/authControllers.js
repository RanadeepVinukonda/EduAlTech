import bcrypt from "bcryptjs";
import User from "../models/usermodel.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

// ✅ SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, role } = req.body;

    if (!fullName || !username || !email || !password || !role)
      return res.status(400).json({ error: "All fields are required" });

    if (!["seeker", "provider", "admin"].includes(role))
      return res.status(400).json({ error: "Invalid role" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username already taken" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ error: "Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    // ✅ FIX: Correct argument order
    generateTokenAndSetCookie(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // ✅ FIX: Correct argument order
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImg: user.profileImg || "",
      coverImg: user.coverImg || "",
      phone: user.phone || "",
      address: user.address || "",
      link: user.link || "",
      bio: user.bio || "",
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ✅ LOGOUT
export const logout = async (_, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err.message);
    res.status(500).json({ error: "Server error during logout" });
  }
};

// ✅ GET LOGGED-IN USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("getMe Error:", err.message);
    res.status(500).json({ error: "Server error during getMe" });
  }
};
