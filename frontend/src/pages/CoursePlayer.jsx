// CoursePlayer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../axios";
import { toast } from "react-hot-toast";

const CoursePlayer = () => {
  const { id } = useParams();
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

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-6">
        {lecture.title}
      </h2>
      <p className="text-gray-500 mb-4">{lecture.description}</p>

      <div className="w-full aspect-video bg-black mb-6">
        <video
          src={lecture.video}
          controls
          className="w-full h-full object-cover"
        />
      </div>

      {lecture.materials?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Materials
          </h3>
          <ul className="list-disc list-inside">
            {lecture.materials.map((file, idx) => (
              <li key={idx}>
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
