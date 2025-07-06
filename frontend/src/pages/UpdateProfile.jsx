// src/pages/UpdateProfile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";
import api from "../axios"; // Adjust the path as necessary

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    link: user?.link || "",
    profileImg: null,
    coverImg: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    }

    try {
      const res = await api.put("/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-lg w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
          Update Profile
        </h2>

        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="Link (LinkedIn, Website, etc)"
          className="input input-bordered w-full"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short Bio"
          className="textarea textarea-bordered w-full"
        />
        <label className="block font-semibold">Profile Image</label>
        <input
          type="file"
          name="profileImg"
          accept="image/*"
          onChange={handleChange}
          className="file-input file-input-bordered w-full"
        />
        <label className="block font-semibold">Cover Image</label>
        <input
          type="file"
          name="coverImg"
          accept="image/*"
          onChange={handleChange}
          className="file-input file-input-bordered w-full"
        />

        <button type="submit" className="btn btn-success w-full">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
