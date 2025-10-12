import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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
      const res = await api.get(`/courses/${id}`, { withCredentials: true });
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!lecture)
    return <p className="text-center mt-10 text-red-600">Lecture not found.</p>;

  const materials = Array.isArray(lecture.materials) ? lecture.materials : [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h2 className="text-3xl font-bold text-green-700 mb-2">
        {lecture.title}
      </h2>
      <p className="text-gray-500 mb-6">{lecture.description}</p>

      {/* Video Player */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-8">
        <video
          src={lecture.video}
          controls
          className="w-full h-full object-cover"
        />
      </div>

      {/* Materials Section */}
      {materials.length > 0 && (
        <div className="mt-4 space-y-6">
          <h3 className="text-2xl font-semibold text-green-700 mb-2">
            Supporting Materials
          </h3>

          {materials.map((file, idx) => {
            // Handle both string URLs and object formats safely
            const url = typeof file === "string" ? file : file.url || "";
            const name =
              typeof file === "string"
                ? file.split("/").pop()
                : file.name || "Material";

            if (!url) return null;

            return (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="font-medium text-gray-700 mb-2">{name}</p>

                {/* If it's a PDF, embed it directly */}
                {url.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={url}
                    className="w-full h-[500px] border rounded-lg"
                    title={`PDF-${idx}`}
                  />
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
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
  );
};

export default CoursePlayer;
