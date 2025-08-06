import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

export default function CoursePlayer() {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/lectures/${id}`);
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
      {/* VIDEO PLAYER */}
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
          <h4 className="text-xl font-bold text-green-700 mb-4">Materials</h4>
          <div className="space-y-6">
            {lecture.materials.map((material, idx) => (
              <div key={idx} className="border p-4 rounded-lg bg-gray-100">
                <h5 className="font-medium text-green-800 mb-2">
                  {material.title}
                </h5>

                {material.type === "pdf" ? (
                  <iframe
                    src={material.fileUrl}
                    className="w-full h-96 rounded"
                    title={material.title}
                  />
                ) : (
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View / Download
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}
