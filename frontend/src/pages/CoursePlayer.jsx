import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../axios";

export default function CoursePlayer() {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/lecture/${id}`);
        setLecture(res.data);
      } catch (err) {
        console.error("Error fetching lecture:", err);
        setError("Lecture not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        {/* MAIN VIDEO PLAYER */}
        <video
          src={lecture?.videoUrl}
          controls
          className="w-full rounded"
          poster={lecture?.thumbnail || ""}
        />

        <h3 className="text-2xl font-semibold mt-4 text-green-600">
          {lecture?.title || "Untitled Lecture"}
        </h3>
        <p className="text-gray-600 mt-2">{lecture?.description}</p>

        {/* MATERIALS SECTION */}
        {lecture?.materials?.length > 0 && (
          <div className="mt-8">
            <h4 className="text-xl font-bold text-green-700 mb-4">
              Available Materials
            </h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {lecture.materials.map((material, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMaterial(material)}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg border border-green-300"
                >
                  {material.title}
                </button>
              ))}
            </div>

            {/* MATERIAL VIEWER */}
            {selectedMaterial && (
              <div className="p-4 border rounded-lg bg-gray-100">
                <h5 className="font-medium text-green-800 mb-2">
                  {selectedMaterial.title}
                </h5>

                {selectedMaterial.type === "pdf" ? (
                  // Use Google Docs Viewer for more reliable PDF rendering
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      selectedMaterial.fileUrl
                    )}&embedded=true`}
                    className="w-full h-96 rounded"
                    title={selectedMaterial.title}
                  />
                ) : selectedMaterial.type.startsWith("image/") ? (
                  <img
                    src={selectedMaterial.fileUrl}
                    alt={selectedMaterial.title}
                    className="w-full rounded"
                  />
                ) : selectedMaterial.type.startsWith("video/") ? (
                  <video
                    src={selectedMaterial.fileUrl}
                    controls
                    className="w-full rounded"
                  />
                ) : (
                  <a
                    href={selectedMaterial.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open File
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
