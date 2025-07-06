import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
//signup Controller
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password ,role} = req.body;
    const existingUser = await User.findOne({ username });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }
    if (!fullName || !username || !email || !password||!role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    if (!["seeker", "provider", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//login Controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Set cookie
    generateTokenAndSetCookie(user._id, res);

    // ✅ Send full user object (excluding password)
    const userData = {
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
    };

    return res.status(200).json(userData);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
//logout Controller
export const logout = async (_, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// getMe Controller
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
