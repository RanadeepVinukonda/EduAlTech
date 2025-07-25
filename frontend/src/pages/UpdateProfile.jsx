// src/pages/UpdateProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";
import api from "../axios";

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    bio: "",
    link: "",
    phone: "",
    address: "",
    profileImg: null,
    coverImg: null,
  });

  const [preview, setPreview] = useState({
    profileImg: "",
    coverImg: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        fullName: user.fullName || "",
        bio: user.bio || "",
        link: user.link || "",
        phone: user.phone || "",
        address: user.address || "",
        profileImg: null,
        coverImg: null,
      });

      setPreview({
        profileImg: user.profileImg || "",
        coverImg: user.coverImg || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    } finally {
      setLoading(false);
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
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="input input-bordered w-full"
          required
        />
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
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="input input-bordered w-full"
        />

        <div>
          <label className="block font-semibold mb-1">Profile Image</label>
          <input
            type="file"
            name="profileImg"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          {preview.profileImg && (
            <img
              src={preview.profileImg}
              alt="Profile Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full border"
            />
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Cover Image</label>
          <input
            type="file"
            name="coverImg"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          {preview.coverImg && (
            <img
              src={preview.coverImg}
              alt="Cover Preview"
              className="mt-2 w-full h-32 object-cover rounded-md border"
            />
          )}
        </div>

        <button
          type="submit"
          className="btn btn-success w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
