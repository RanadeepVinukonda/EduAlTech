import React, { useEffect, useState } from "react";
import api from "../axios";
import CourseCard from "../components/CourseCard";
import { toast } from "react-hot-toast";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [frequentCourses, setFrequentCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch popular courses
  const fetchPopular = async () => {
    try {
      const res = await api.get("/courses/popular");
      setPopularCourses(res.data);
    } catch {
      toast.error("Failed to load popular courses");
    }
  };

  // Fetch frequently opened courses
  const fetchFrequent = async () => {
    try {
      const res = await api.get("/courses/frequently-viewed");
      setFrequentCourses(res.data);
    } catch {
      toast.error("Failed to load frequently opened courses");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchPopular();
    fetchFrequent();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center sm:text-left">
        Courses
      </h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search courses..."
        className="input input-bordered w-full max-w-md mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Popular Courses */}
      {popularCourses.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-600">
            Popular Courses
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <CourseCard key={course._id} lecture={course} />
            ))}
          </div>
        </section>
      )}

      {/* Frequently Opened Courses */}
      {frequentCourses.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-600">
            Frequently Opened
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {frequentCourses.map((course) => (
              <CourseCard key={course._id} lecture={course} />
            ))}
          </div>
        </section>
      )}

      {/* All Courses */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-green-600">
          All Courses
        </h3>
        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} lecture={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;
