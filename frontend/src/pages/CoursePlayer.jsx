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
      </div>
    </div>
  );
}
