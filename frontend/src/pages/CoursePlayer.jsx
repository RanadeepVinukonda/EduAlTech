import React from "react";
import { useParams } from "react-router";

export default function CoursePlayer() {
  const { id } = useParams();
  // Fetch lecture by ID (omitted for brevity) and display

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <video src="..." controls className="w-full rounded" />
        <h3 className="text-2xl font-semibold mt-4 text-green-600">
          Lecture Title
        </h3>
        <p className="text-gray-600 mt-2">Lecture description...</p>
      </div>
    </div>
  );
}
