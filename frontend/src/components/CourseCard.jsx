import React from "react";
import { Link } from "react-router";


const CourseCard = ({ lecture }) => {
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
        /* Add delete functionality if needed */
      </p>
      <Link to={`/course/${lecture._id}`}>
        <button className="btn btn-sm btn-success mt-2">Watch Now</button>
      </Link>
    </div>
  );
};

export default CourseCard;
