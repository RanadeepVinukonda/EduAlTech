// Courses.jsx
import React, { useEffect, useState } from "react";
import api from "../axios";
import { toast } from "react-hot-toast";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [frequentCourses, setFrequentCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const [allRes, popularRes, frequentRes] = await Promise.all([
          api.get("/courses"),
          api.get("/courses/popular"),
          api.get("/courses/frequent"),
        ]);

        setCourses(allRes.data?.courses || []);
        setPopularCourses(popularRes.data?.courses || []);
        setFrequentCourses(frequentRes.data?.courses || []);
      } catch (err) {
        toast.error(err?.response?.data?.error || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Search filter
  const filteredCourses = Array.isArray(courses)
    ? courses.filter((c) =>
        c.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-700">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Popular Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Popular Courses
          </h2>
          {popularCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No popular courses available.</p>
          )}
        </section>

        {/* Frequently Opened Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Frequently Opened Courses
          </h2>
          {frequentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {frequentCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No frequently opened courses available.
            </p>
          )}
        </section>

        {/* All Courses with Search */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">All Courses</h2>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No courses found matching your search.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

// Reusable Course Card component
function CourseCard({ course }) {
  return (
    <div className="card bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <figure>
        <img
          src={course.thumbnail || "https://via.placeholder.com/300x200"}
          alt={course.title}
          className="h-40 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-lg font-semibold text-gray-800">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{course.description}</p>
        <div className="card-actions justify-end mt-3">
          <a href={`/course/${course._id}`} className="btn btn-primary btn-sm">
            Watch Now
          </a>
        </div>
      </div>
    </div>
  );
}
