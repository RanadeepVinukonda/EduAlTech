import React from "react";
import { Link } from "react-router";
import { toast } from "react-hot-toast";
import api from "../axios";
import { useAuth } from "../context/AuthProvider"; // or wherever your auth hook is

const CourseCard = ({ lecture, fetchLectures }) => {
  const { user } = useAuth();

  const deleteLecture = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await api.delete(`/admin/lecture/${id}`, { withCredentials: true });
      toast.success("Lecture deleted");
      fetchLectures(); // must be passed from parent
    } catch (err) {
      toast.error("Failed to delete lecture");
    }
  };

  return (
    <div className="bg-white border border-green-100 rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
      {lecture.thumbnailUrl ? (
        <img
          src={lecture.thumbnailUrl}
          alt={lecture.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      ) : (
        <video
          className="w-full h-48 object-cover rounded mb-3"
          src={lecture.videoUrl}
          controls
        />
      )}
      <h2 className="text-lg font-semibold text-green-700">{lecture.title}</h2>
      {lecture.subject && (
        <p className="text-sm text-green-500">Subject: {lecture.subject}</p>
      )}
      {lecture.description && (
        <p className="text-gray-600 text-sm mt-1 line-clamp-3">
          {lecture.description}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Uploaded by:{" "}
        <span className="text-green-600 font-medium">
          {lecture.uploadedBy?.fullName || "Unknown"}
        </span>
      </p>
      <Link to={`/course/${lecture._id}`}>
        <button className="btn btn-sm btn-success mt-2">Watch Now</button>
      </Link>
      {user?.role === "provider" && (
        <div className="card-actions justify-end">
          <button
            onClick={() => deleteLecture(lecture._id)}
            className="btn btn-sm btn-error"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
