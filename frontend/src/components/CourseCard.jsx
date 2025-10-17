// src/components/CourseCard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router";

const CourseCard = ({ lecture }) => {
  const navigate = useNavigate();
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [demoVideo, setDemoVideo] = useState(null);
  const [message, setMessage] = useState("");

  // Listen/Learn flow: go to Subscribe.jsx
  const handleLearn = () => {
    navigate(`/course/${lecture._id}/subscribe`);
  };

  // Teach flow: open modal
  const handleTeach = () => {
    setShowTeachModal(true);
  };

  const handleSubmitTeach = (e) => {
    e.preventDefault();
    if (!resume && !demoVideo) {
      setMessage("Please upload at least a resume or demo video.");
      return;
    }
    // TODO: submit resume/demo to backend or schedule meeting
    console.log("Resume:", resume);
    console.log("Demo Video:", demoVideo);
    setMessage("Application submitted successfully!");
    setResume(null);
    setDemoVideo(null);
    setShowTeachModal(false);
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

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button onClick={handleLearn} className="btn btn-success w-full">
          Learn (Subscribe)
        </button>
        <button
          onClick={handleTeach}
          className="btn btn-outline btn-primary w-full"
        >
          Teach (Apply)
        </button>
      </div>

      {/* Teach Modal */}
      {showTeachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowTeachModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold text-primary mb-4">
              Apply to Teach
            </h2>
            <form onSubmit={handleSubmitTeach} className="flex flex-col gap-4">
              <label className="flex flex-col">
                Upload Resume:
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="file-input file-input-bordered file-input-primary mt-1"
                />
              </label>
              <label className="flex flex-col">
                Upload Demo Video:
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setDemoVideo(e.target.files[0])}
                  className="file-input file-input-bordered file-input-primary mt-1"
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Submit Application
              </button>
              {message && <p className="text-success font-medium">{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
