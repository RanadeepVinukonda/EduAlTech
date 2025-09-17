// src/components/CourseCard.jsx
import React from "react";
import { useNavigate } from "react-router";

const CourseCard = ({ lecture }) => {
  const navigate = useNavigate();

  const handleWatchNow = () => {
    navigate(`/course/${lecture._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      {/* Thumbnail */}
      <img
        src={lecture.thumbnail || "https://placehold.co/400x200?text=Thumbnail"}
        alt={lecture.title || "Lecture Thumbnail"}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      {/* Title & Category */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-green-700 truncate">
          {lecture.title || "Untitled"}
        </h3>
        <span className="text-sm text-gray-500 capitalize">
          {lecture.category || "N/A"}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {lecture.description || "No description available."}
      </p>

      {/* Info & Popular Badge */}
      <div className="flex justify-between items-center mb-4 text-gray-500 text-xs">
        <span>{lecture.views || 0} views</span>
        {lecture.popular && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            Popular
          </span>
        )}
      </div>

      {/* Watch Now Button */}
      <button
        onClick={handleWatchNow}
        className="btn btn-success mt-auto w-full"
      >
        Watch Now
      </button>
    </div>
  );
};

export default CourseCard;
