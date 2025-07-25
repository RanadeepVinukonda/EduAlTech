import React, { useEffect, useState } from "react";
import api from "../axios";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";

export default function Courses() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/courses/all", { withCredentials: true })
      .then((res) => {
        setLectures(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load courses. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Available Lectures
      </h2>

      {error && <div className="text-red-500 text-center mb-6">{error}</div>}

      {lectures.length === 0 && !error ? (
        <p className="text-gray-600 text-center">
          No courses available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((l) => (
            <CourseCard key={l._id} lecture={l} />
          ))}
        </div>
      )}
    </div>
  );
}
