import React, { useEffect, useState } from "react";
import api from "../axios"; // Adjust the path as necessary
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [lectures, setLectures] = useState([]);
  useEffect(() => {
    api
      .get("/courses/all", { withCredentials: true })
      .then((res) => setLectures(res.data))
      .catch(console.error);
  }, []);
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-green-600 mb-6">
        Available Lectures
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lectures.map((l) => (
          <CourseCard key={l._id} lecture={l} />
        ))}
      </div>
    </div>
  );
}
