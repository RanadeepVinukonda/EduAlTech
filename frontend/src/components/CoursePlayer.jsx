// src/pages/CoursePlayer.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const CoursePlayer = () => {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch lecture by ID
  const fetchLecture = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/lecture/${id}`, {
        withCredentials: true,
      });
      setLecture(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load lecture.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecture();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading course...</p>;
  }

  if (!lecture) {
    return <p className="text-center mt-10 text-red-600">Lecture not found.</p>;
  }

  return (
    <div className="min-h-screen bg-neutral px-4 py-8 sm:px-6 lg:px-8">
      {/* Header with Back Button */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Link
          to={-1}
          className="flex items-center text-green-700 hover:text-green-800 font-medium transition"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Link>
      </div>

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
          <div className="w-full aspect-video mb-8 bg-black rounded-lg overflow-hidden">
            <video
              src={lecture.video}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <p className="text-gray-500 mb-8">
            No video available for this course.
          </p>
        )}

        {/* Embedded PDF (if any material is a PDF) */}
        {lecture.materials?.some((m) => m.endsWith(".pdf")) && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Course Notes / PDF
            </h3>
            {lecture.materials
              .filter((file) => file.endsWith(".pdf"))
              .map((pdf, idx) => (
                <iframe
                  key={idx}
                  src={pdf}
                  title={`PDF-${idx}`}
                  className="w-full h-[500px] border rounded-lg shadow"
                />
              ))}
          </div>
        )}

        {/* Supporting Materials */}
        {lecture.materials?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Supporting Materials
            </h3>
            <ul className="space-y-2">
              {lecture.materials.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
