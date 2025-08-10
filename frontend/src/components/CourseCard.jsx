import React from "react";
import { Link } from "react-router"; // fixed react-router-dom import
import { toast } from "react-hot-toast";
import api from "../axios";
import { useAuth } from "../context/AuthProvider";

const CourseCard = ({ lecture, fetchLectures }) => {
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;

    try {
      await api.delete(`/courses/delete/${id}`, { withCredentials: true });
      toast.success("Lecture deleted successfully");
      if (fetchLectures) fetchLectures();
    } catch (err) {
      console.error(
        "❌ Error deleting lecture:",
        err.response?.data || err.message
      );
      toast.error(
        err.response?.data?.error ||
          "Failed to delete lecture. Please try again."
      );
    }
  };

  return (
    <div className="bg-white border border-green-200 rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300 max-w-sm w-full">
      <div className="w-full h-48 rounded overflow-hidden">
        {lecture.thumbnailUrl ? (
          <img
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={lecture.videoUrl}
            controls
          />
        )}
      </div>

      <h2 className="text-lg font-semibold text-green-700 mt-2 truncate">
        {lecture.title}
      </h2>

      {lecture.classLevel && (
        <p className="text-xs text-gray-500">
          Class: <span className="font-medium">{lecture.classLevel}</span>
        </p>
      )}
      {lecture.subject && (
        <p className="text-xs text-gray-500">
          Subject: <span className="font-medium">{lecture.subject}</span>
        </p>
      )}
      {lecture.course && (
        <p className="text-xs text-gray-500">
          Course: <span className="font-medium">{lecture.course}</span>
        </p>
      )}

      {lecture.description && (
        <p className="text-gray-600 text-sm mt-1 line-clamp-3">
          {lecture.description}
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Uploaded by:{" "}
        <span className="text-green-600 font-medium">
          {lecture.uploadedBy?.fullName || "Unknown"}
        </span>
      </p>

      {lecture.materials?.length > 0 && (
        <p className="text-xs text-blue-600 mt-1 font-medium">
          {lecture.materials.length} Material
          {lecture.materials.length > 1 ? "s" : ""} Available
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <Link to={`/course/${lecture._id}`}>
          <button className="btn btn-sm bg-green-600 text-white hover:bg-green-700 transition">
            Watch Now
          </button>
        </Link>

        {(user?.role === "provider" || user?.role === "admin") && (
          <button
            onClick={() => handleDelete(lecture._id)}
            className="btn btn-sm btn-error hover:brightness-90"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
