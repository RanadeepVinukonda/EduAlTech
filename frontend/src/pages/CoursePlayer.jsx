// src/pages/CoursePlayer.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLecture = async () => {
    try {
      const res = await api.get(`/courses/lecture/${id}`, { withCredentials: true });
      setLecture(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load lecture");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecture();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading course...</p>;

  if (!lecture)
    return <p className="text-center mt-10 text-red-600">Lecture not found.</p>;

  const materials = Array.isArray(lecture.materials) ? lecture.materials : [];

  return (
    <div className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-6 font-medium transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Lecture Info */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          {lecture.title || "Untitled Lecture"}
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {lecture.description || "No description available for this lecture."}
        </p>

        {/* Video Player */}
        {lecture.video ? (
          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-8">
            <video
              src={lecture.video}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No video available for this course.</p>
        )}

        {/* Materials */}
        {materials.length > 0 && (
          <div className="mt-4 space-y-6">
            <h3 className="text-2xl font-semibold text-green-700 mb-2">
              Supporting Materials
            </h3>

            {materials.map((file, idx) => {
              // Safe extraction of URL & title
              const url = file?.fileUrl;
              const name = file?.title || url?.split("/").pop() || `Material-${idx}`;

              if (!url) return null;

              return (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow">
                  <p className="font-medium text-gray-700 mb-2">{name}</p>

                  {/* Embed PDF if type is pdf */}
                  {file?.type === "pdf" ? (
                    <iframe
                      src={url}
                      title={`PDF-${idx}`}
                      className="w-full h-[500px] border rounded-lg"
                    />
                  ) : (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View / Download Material
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
