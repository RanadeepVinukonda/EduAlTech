import React, { useEffect, useState } from "react";
import api from "../axios";
import { useAuth } from "../context/AuthProvider";
import { toast } from "react-hot-toast";
import CourseCard from "../components/CourseCard";

const MyLectures = () => {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    classLevel: "",
    subject: "",
    course: "",
    thumbnail: null,
    video: null,
    materials: [], // array of files
  });

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await api.get("/courses/mylectures", {
          withCredentials: true,
        });
        setLectures(res.data);
      } catch (err) {
        toast.error("Failed to fetch lectures");
        console.error(err);
      }
    };

    if (user?.role === "provider") fetchLectures();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "materials") {
      setForm((prev) => ({ ...prev, materials: files }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.thumbnail ||
      !form.video ||
      (form.category === "Edu" &&
        (!form.classLevel || !form.subject || !form.course))
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    if (form.classLevel) formData.append("classLevel", form.classLevel);
    if (form.subject) formData.append("subject", form.subject);
    if (form.course) formData.append("course", form.course);
    formData.append("thumbnail", form.thumbnail);
    formData.append("video", form.video);
    for (let file of form.materials) {
      formData.append("materials", file);
    }

    try {
      const res = await api.post("/courses/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lecture uploaded successfully!");
      setLectures((prev) => [res.data.lecture, ...prev]);

      // Reset form
      setForm({
        title: "",
        description: "",
        category: "",
        classLevel: "",
        subject: "",
        course: "",
        thumbnail: null,
        video: null,
        materials: [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  if (user?.role !== "provider") {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold text-xl">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center sm:text-left">
        Upload New Lecture
      </h2>

      <form
        onSubmit={handleUpload}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow mb-10"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Lecture Title"
          className="input input-bordered w-full"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Category</option>
          <option value="Edu">Edu (Formal)</option>
          <option value="AltEdu">AltEdu (Alternative)</option>
        </select>

        {form.category === "Edu" && (
          <>
            <input
              type="text"
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              placeholder="Class Level (e.g., 10, 11)"
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Subject (e.g., Math, Physics)"
              className="input input-bordered w-full"
              required
            />

            <input
              type="text"
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="Course (e.g., Algebra, Mechanics)"
              className="input input-bordered w-full"
              required
            />
          </>
        )}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short Description"
          className="textarea textarea-bordered sm:col-span-2"
        />

        <div className="form-control">
          <label className="label font-semibold text-sm text-gray-700">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            name="thumbnail"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
            required
          />
          {form.thumbnail && (
            <p className="text-xs mt-1 text-gray-500">
              Selected: {form.thumbnail.name}
            </p>
          )}
        </div>

        <div className="form-control">
          <label className="label font-semibold text-sm text-gray-700">
            Lecture Video
          </label>
          <input
            type="file"
            accept="video/*"
            name="video"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
            required
          />
          {form.video && (
            <p className="text-xs mt-1 text-gray-500">
              Selected: {form.video.name}
            </p>
          )}
        </div>

        <div className="form-control sm:col-span-2">
          <label className="label font-semibold text-sm text-gray-700">
            Additional Materials (PDF, DOCX, ZIP)
          </label>
          <input
            type="file"
            name="materials"
            accept=".pdf,.doc,.docx,.zip"
            multiple
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />
          {form.materials.length > 0 && (
            <ul className="text-xs mt-2 text-gray-500 list-disc list-inside">
              {[...form.materials].map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-success col-span-1 sm:col-span-2"
        >
          Upload Lecture
        </button>
      </form>

      <h3 className="text-2xl font-semibold mb-4 text-green-700 text-center sm:text-left">
        My Lectures
      </h3>

      {lectures.length === 0 ? (
        <p className="text-gray-500 text-center">No lectures uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <CourseCard
              key={lecture._id}
              lecture={lecture}
              fetchLectures={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLectures;
