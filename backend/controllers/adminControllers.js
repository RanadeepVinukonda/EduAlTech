// controllers/adminController.js
import User from "../models/usermodel.js";
import Lecture from "../models/lecturemodel.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
// Delete a lecture
export const deleteLecture = async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecture deleted" });
  } catch (error) {
    console.error("Error deleting lecture:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
